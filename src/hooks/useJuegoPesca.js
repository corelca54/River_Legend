/**
 * useJuegoPesca.js - Hook principal para la lógica del juego de pesca
 * Maneja todos los estados y acciones del juego
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ESTADOS_JUEGO, CONFIGURACION_PESCA, CONFIGURACION_UI } from '../data/constantesJuego';
import { obtenerPezAleatorio } from '../data/datosPeces';
import { calcularPuntosPorCaptura, calcularExperienciaPorCaptura } from '../herramientas/calculosPesca';

export const useJuegoPesca = () => {
  // Estados principales del juego
  const [estadoJuego, setEstadoJuego] = useState(ESTADOS_JUEGO.ESPERANDO);
  const [pezActual, setPezActual] = useState(null);
  const [tension, setTension] = useState(0);
  const [profundidad, setProfundidad] = useState(0);
  const [tiempoLucha, setTiempoLucha] = useState(0);
  const [posicionSenuelo, setPosicionSenuelo] = useState({ x: 50, y: 20 });
  const [animacionPez, setAnimacionPez] = useState({ rotacion: 0, escala: 1 });

  // Estados del jugador
  const [puntuacion, setPuntuacion] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [experiencia, setExperiencia] = useState(0);
  const [pezesCapturados, setPezesCapturados] = useState([]);

  // Estados de UI
  const [mostrandoInfoPez, setMostrandoInfoPez] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [ultimaCaptura, setUltimaCaptura] = useState(null);

  // Referencias para temporizadores
  const intervalosRef = useRef([]);
  const timeoutsRef = useRef([]);
  const tiempoInicioLuchaRef = useRef(0);
  const resistenciaPezRef = useRef(0);

  // Función para limpiar temporizadores
  const limpiarTemporizadores = useCallback(() => {
    intervalosRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalosRef.current = [];
    timeoutsRef.current = [];
  }, []);

  // Función para agregar intervalos con limpieza automática
  const agregarIntervalo = useCallback((callback, tiempo) => {
    const intervalo = setInterval(callback, tiempo);
    intervalosRef.current.push(intervalo);
    return intervalo;
  }, []);

  // Función para agregar timeouts con limpieza automática
  const agregarTimeout = useCallback((callback, tiempo) => {
    const timeout = setTimeout(callback, tiempo);
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  // Limpiar temporizadores al desmontar
  useEffect(() => {
    return () => limpiarTemporizadores();
  }, [limpiarTemporizadores]);

  // Función para mostrar mensaje temporal
  const mostrarMensaje = useCallback((mensaje, tiempo = CONFIGURACION_UI.TIEMPO_MENSAJE_ESTADO) => {
    setMensajeEstado(mensaje);
    agregarTimeout(() => setMensajeEstado(''), tiempo);
  }, [agregarTimeout]);

  // Función para obtener color de tensión
  const obtenerColorTension = useCallback((tensionActual) => {
    if (tensionActual < CONFIGURACION_UI.UMBRAL_TENSION_MEDIA) {
      return CONFIGURACION_UI.COLORES_TENSION.BAJA;
    } else if (tensionActual < CONFIGURACION_UI.UMBRAL_TENSION_ALTA) {
      return CONFIGURACION_UI.COLORES_TENSION.MEDIA;
    }
    return CONFIGURACION_UI.COLORES_TENSION.ALTA;
  }, []);

  // Función para lanzar el señuelo
  const lanzarSenuelo = useCallback(() => {
    if (estadoJuego !== ESTADOS_JUEGO.ESPERANDO) return;

    setEstadoJuego(ESTADOS_JUEGO.LANZANDO);
    setTension(0);
    setProfundidad(0);
    mostrarMensaje("Lanzando señuelo al río...");

    // Animación de lanzamiento
    let profundidadActual = 0;
    const intervaloLanzamiento = agregarIntervalo(() => {
      profundidadActual += CONFIGURACION_PESCA.VELOCIDAD_HUNDIMIENTO;
      setProfundidad(profundidadActual);
      setPosicionSenuelo(prev => ({ 
        ...prev, 
        y: 20 + (profundidadActual / 100) * 60 
      }));

      if (profundidadActual >= CONFIGURACION_PESCA.PROFUNDIDAD_MAXIMA) {
        clearInterval(intervaloLanzamiento);
        setEstadoJuego(ESTADOS_JUEGO.PESCANDO);
        mostrarMensaje("Esperando que pique un pez... 🎣");
        
        // Calcular tiempo de espera aleatorio
        const tiempoEspera = Math.random() * 
          (CONFIGURACION_PESCA.TIEMPO_ESPERA_MAXIMO - CONFIGURACION_PESCA.TIEMPO_ESPERA_MINIMO) + 
          CONFIGURACION_PESCA.TIEMPO_ESPERA_MINIMO;

        agregarTimeout(() => {
          // Verificar que el juego siga en estado de pesca antes de iniciar lucha
          setEstadoJuego(prevEstado => {
            if (prevEstado === ESTADOS_JUEGO.PESCANDO) {
              iniciarLucha();
              return ESTADOS_JUEGO.LUCHANDO;
            }
            return prevEstado;
          });
        }, tiempoEspera);
      }
    }, 50);
  }, [estadoJuego, agregarIntervalo, agregarTimeout, mostrarMensaje]);

  // Función para iniciar la lucha con un pez
  const iniciarLucha = useCallback(() => {
    const pez = obtenerPezAleatorio(nivel);
    setPezActual(pez);
    setEstadoJuego(ESTADOS_JUEGO.LUCHANDO);
    setTiempoLucha(0);
    tiempoInicioLuchaRef.current = Date.now();
    resistenciaPezRef.current = pez.resistencia;

    mostrarMensaje(`¡${pez.nombre} está luchando!`);

    // Ciclo de lucha
    const intervaloLucha = agregarIntervalo(() => {
      const tiempoTranscurrido = (Date.now() - tiempoInicioLuchaRef.current) / 1000;
      setTiempoLucha(tiempoTranscurrido);

      // El pez lucha y aumenta la tensión
      if (Math.random() < CONFIGURACION_PESCA.PROBABILIDAD_LUCHA) {
        const incrementoTension = pez.fuerza * 
          (CONFIGURACION_PESCA.INCREMENTO_TENSION_BASE + Math.random() * 2);
        
        setTension(prev => {
          const nuevaTension = Math.min(prev + incrementoTension, CONFIGURACION_PESCA.TENSION_MAXIMA);
          
          // Si la tensión es muy alta, el sedal se rompe
          if (nuevaTension >= CONFIGURACION_PESCA.TENSION_MAXIMA) {
            clearInterval(intervaloLucha);
            perderPez("¡Se rompió el sedal! 💔");
          }
          
          return nuevaTension;
        });

        // Animación del pez luchando
        setAnimacionPez(prev => ({
          rotacion: prev.rotacion + (Math.random() - 0.5) * CONFIGURACION_PESCA.ROTACION_MAXIMA_PEZ,
          escala: 1 + Math.sin(Date.now() / CONFIGURACION_PESCA.VELOCIDAD_ANIMACION_PEZ) * 
                  CONFIGURACION_PESCA.ESCALA_LUCHA_PEZ
        }));
      }

      // El pez se cansa gradualmente
      resistenciaPezRef.current -= CONFIGURACION_PESCA.FACTOR_CANSANCIO;
      
      if (resistenciaPezRef.current <= 0) {
        clearInterval(intervaloLucha);
        capturarPez(pez, tiempoTranscurrido);
      }
    }, CONFIGURACION_UI.INTERVALO_ACTUALIZACION);
  }, [nivel, agregarIntervalo, mostrarMensaje]);

  // Función para capturar el pez
  const capturarPez = useCallback((pez, tiempoLuchaFinal) => {
    setEstadoJuego(ESTADOS_JUEGO.CAPTURADO);
    
    // Calcular puntos y experiencia
    const puntosGanados = calcularPuntosPorCaptura(pez, tiempoLuchaFinal, nivel);
    const experienciaGanada = calcularExperienciaPorCaptura(pez, tiempoLuchaFinal);

    // Actualizar estadísticas del jugador
    setPuntuacion(prev => prev + puntosGanados);
    setExperiencia(prev => {
      const nuevaExp = prev + experienciaGanada;
      const expRequeridaParaNivel = nivel * 100;
      
      if (nuevaExp >= expRequeridaParaNivel) {
        setNivel(prevNivel => prevNivel + 1);
        mostrarMensaje(`¡Felicidades! Has subido al nivel ${nivel + 1}`, 3000);
        return nuevaExp - expRequeridaParaNivel;
      }
      return nuevaExp;
    });

    // Agregar pez a la colección
    const pezCapturado = {
      ...pez,
      fechaCaptura: new Date(),
      tiempoLucha: tiempoLuchaFinal,
      puntosObtenidos: puntosGanados,
      experienciaObtenida: experienciaGanada
    };

    setPezesCapturados(prev => [...prev, pezCapturado]);
    setUltimaCaptura(pezCapturado);

    // Mostrar información del pez
    setMostrandoInfoPez(true);
    setAnimacionPez({ rotacion: 0, escala: 1.5 });

    // Ocultar información y reiniciar después de un tiempo
    agregarTimeout(() => {
      setMostrandoInfoPez(false);
      reiniciarJuego();
    }, CONFIGURACION_UI.TIEMPO_MOSTRAR_INFO_PEZ);

    mostrarMensaje(`¡${pez.nombre} capturado! +${puntosGanados} puntos`);
  }, [nivel, agregarTimeout, mostrarMensaje]);

  // Función para perder el pez
  const perderPez = useCallback((mensaje) => {
    setEstadoJuego(ESTADOS_JUEGO.PERDIDO);
    mostrarMensaje(mensaje);
    
    agregarTimeout(() => {
      reiniciarJuego();
    }, 2000);
  }, [agregarTimeout, mostrarMensaje]);

  // Función para recoger el sedal
  const recogerSedal = useCallback(() => {
    if (estadoJuego === ESTADOS_JUEGO.LUCHANDO) {
      setTension(prev => Math.max(prev - CONFIGURACION_PESCA.REDUCCION_TENSION_RECOGER, 0));
      setProfundidad(prev => Math.max(prev - CONFIGURACION_PESCA.VELOCIDAD_RECOGIDA, 0));
      setPosicionSenuelo(prev => ({ 
        ...prev, 
        y: Math.max(prev.y - 2, 20) 
      }));
    } else if (estadoJuego === ESTADOS_JUEGO.PESCANDO) {
      // Recoger sin pez enganchado
      reiniciarJuego();
    }
  }, [estadoJuego]);

  // Función para soltar el sedal (cuando hay mucha tensión)
  const soltarSedal = useCallback(() => {
    if (estadoJuego === ESTADOS_JUEGO.LUCHANDO && tension >= 50) {
      setTension(prev => Math.max(prev - CONFIGURACION_PESCA.REDUCCION_TENSION_SOLTAR, 0));
      setProfundidad(prev => Math.min(prev + 10, CONFIGURACION_PESCA.PROFUNDIDAD_MAXIMA));
      setPosicionSenuelo(prev => ({ 
        ...prev, 
        y: Math.min(prev.y + 3, 80) 
      }));
    }
  }, [estadoJuego, tension]);

  // Función para reiniciar el juego
  const reiniciarJuego = useCallback(() => {
    limpiarTemporizadores();
    setEstadoJuego(ESTADOS_JUEGO.ESPERANDO);
    setPezActual(null);
    setTension(0);
    setProfundidad(0);
    setTiempoLucha(0);
    setPosicionSenuelo({ x: 50, y: 20 });
    setAnimacionPez({ rotacion: 0, escala: 1 });
    setMensajeEstado('');
    tiempoInicioLuchaRef.current = 0;
    resistenciaPezRef.current = 0;
  }, [limpiarTemporizadores]);

  // Función para pausar/reanudar el juego
  const alternarPausa = useCallback(() => {
    if (estadoJuego === ESTADOS_JUEGO.PAUSA) {
      setEstadoJuego(ESTADOS_JUEGO.ESPERANDO);
    } else if (estadoJuego !== ESTADOS_JUEGO.CAPTURADO && estadoJuego !== ESTADOS_JUEGO.PERDIDO) {
      setEstadoJuego(ESTADOS_JUEGO.PAUSA);
    }
  }, [estadoJuego]);

  // Función para obtener estadísticas del jugador
  const obtenerEstadisticas = useCallback(() => {
    const totalPeces = pezesCapturados.length;
    const pesoTotal = pezesCapturados.reduce((sum, pez) => sum + pez.pesoActual, 0);
    const pezMasGrande = pezesCapturados.reduce((mayor, pez) => 
      pez.pesoActual > (mayor?.pesoActual || 0) ? pez : mayor, null);
    
    const especiesCapturadas = [...new Set(pezesCapturados.map(pez => pez.id))].length;
    const tiempoTotalLucha = pezesCapturados.reduce((sum, pez) => sum + pez.tiempoLucha, 0);

    return {
      totalPeces,
      pesoTotal: pesoTotal.toFixed(1),
      pezMasGrande,
      especiesCapturadas,
      tiempoTotalLucha: tiempoTotalLucha.toFixed(1),
      promedioTiempoLucha: totalPeces > 0 ? (tiempoTotalLucha / totalPeces).toFixed(1) : 0
    };
  }, [pezesCapturados]);

  return {
    // Estados del juego
    estadoJuego,
    pezActual,
    tension,
    profundidad,
    tiempoLucha,
    posicionSenuelo,
    animacionPez,
    
    // Estados del jugador
    puntuacion,
    nivel,
    experiencia,
    pezesCapturados,
    
    // Estados de UI
    mostrandoInfoPez,
    mensajeEstado,
    ultimaCaptura,
    
    // Acciones del juego
    lanzarSenuelo,
    recogerSedal,
    soltarSedal,
    reiniciarJuego,
    alternarPausa,
    
    // Utilidades
    obtenerColorTension,
    obtenerEstadisticas,
    
    // Estado de la tensión para la UI
    tensionCritica: tension >= CONFIGURACION_PESCA.TENSION_CRITICA,
    puedeRecoger: estadoJuego === ESTADOS_JUEGO.LUCHANDO || estadoJuego === ESTADOS_JUEGO.PESCANDO,
    puedeSoltar: estadoJuego === ESTADOS_JUEGO.LUCHANDO && tension >= 50,
    puedeLanzar: estadoJuego === ESTADOS_JUEGO.ESPERANDO
  };
};