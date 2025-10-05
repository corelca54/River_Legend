import { useState, useEffect, useRef, useCallback } from 'react';

// Estados del juego
export const ESTADOS_JUEGO = {
  INICIAL: 'inicial',
  LANZANDO: 'lanzando',
  PESCANDO: 'pescando',
  LUCHANDO: 'luchando',
  CAPTURADO: 'capturado',
  PERDIDO: 'perdido'
};

// Configuración del juego
const CONFIG_JUEGO = {
  TIEMPO_ESPERA_MIN: 3000,
  TIEMPO_ESPERA_MAX: 8000,
  TIEMPO_LUCHA_MAX: 30000,
  TENSION_MAX: 100,
  TENSION_CRITICA: 85
};

// Base de datos de peces con imágenes reales
const PECES_DISPONIBLES = {
  bocachico: {
    id: 'bocachico',
    nombre: 'Bocachico',
    nombreCientifico: 'Prochilodus magdalenae',
    imagen: '/assets/imagenes/peces/Bocachico.png', // ✅ Mayúscula + .png
    rareza: 'común',
    dificultad: 3,
    pesoMin: 0.5,
    pesoMax: 3.0,
    longitudMin: 20,
    longitudMax: 40,
    habitat: 'Río Magdalena',
    puntos: 150,
    descripcion: 'Pez plateado muy común en los ríos colombianos',
  },
  bagre_rayado: {
    id: 'bagre_rayado',
    nombre: 'Bagre Rayado',
    nombreCientifico: 'Pseudoplatystoma fasciatum',
    imagen: '/assets/imagenes/peces/Bagre_rayado.png', // ✅ Mayúscula + guion + .png
    rareza: 'raro',
    dificultad: 6,
    pesoMin: 5.0,
    pesoMax: 25.0,
    longitudMin: 50,
    longitudMax: 120,
    habitat: 'Río Orinoco',
    puntos: 400,
    descripcion: 'Depredador con distintivas rayas negras',
  },
  sabalo: {
    id: 'sabalo',
    nombre: 'Sabalo',
    nombreCientifico: 'Brycon moorei',
    imagen: '/assets/imagenes/peces/sabalo.png', // ✅ minúscula + .png
    rareza: 'común',
    dificultad: 4,
    pesoMin: 1.0,
    pesoMax: 8.0,
    longitudMin: 25,
    longitudMax: 60,
    habitat: 'Ríos Andinos',
    puntos: 200,
    descripcion: 'Pez plateado con aletas naranjas',
  },
  pavon: {
    id: 'pavon',
    nombre: 'Pavón',
    nombreCientifico: 'Cichla orinocensis',
    imagen: '/assets/imagenes/peces/Pavon.png', // ✅ Mayúscula + .png
    rareza: 'épico',
    dificultad: 8,
    pesoMin: 3.0,
    pesoMax: 15.0,
    longitudMin: 40,
    longitudMax: 80,
    habitat: 'Río Orinoco',
    puntos: 600,
    descripcion: 'Depredador agresivo de aguas tropicales',
  },
  arapaima: {
    id: 'arapaima',
    nombre: 'Arapaima',
    nombreCientifico: 'Arapaima gigas',
    imagen: '/assets/imagenes/peces/arapaima.png', // ✅ minúscula + .png
    // ... resto de propiedades
  },
  corroncho: {
    id: 'corroncho',
    nombre: 'Corroncho',
    imagen: '/assets/imagenes/peces/Corroncho.png', // ✅ Mayúscula + .png
    // ... resto
  },
  dorado: {
    id: 'dorado',
    nombre: 'Dorado',
    imagen: '/assets/imagenes/peces/dorado.png', // ✅ minúscula + .png
    // ... resto
  },
  perca: {
    id: 'perca',
    nombre: 'Perca',
    imagen: '/assets/imagenes/peces/perca.png', // ✅ minúscula + .png
    // ... resto
  },
  trucha_mariposa: {
    id: 'trucha_mariposa',
    nombre: 'Trucha Mariposa',
    imagen: '/assets/imagenes/peces/trucha_mariposa.png', // ✅ minúscula + guion + .png
    // ... resto
  }
};

const useJuegoPesca = () => {
  // Estados principales
  const [estadoJuego, setEstadoJuego] = useState(ESTADOS_JUEGO.INICIAL);
  const [pezActual, setPezActual] = useState(null);
  const [tension, setTension] = useState(0);
  const [tiempoLucha, setTiempoLucha] = useState(0);
  const [posicionSedal, setPosicionSedal] = useState({ x: 50, y: 15 });
  const [pezSaliendoDelAgua, setPezSaliendoDelAgua] = useState(false);
  const [estadisticasJugador, setEstadisticasJugador] = useState({
    nivel: 1,
    experiencia: 0,
    experienciaNecesaria: 100,
    pecesCapturados: 0,
    puntosTotales: 0
  });

  // Referencias para timers
  const timeoutPescaRef = useRef(null);
  const intervalLuchaRef = useRef(null);
  const tiempoInicioLuchaRef = useRef(null);

  // Sistema de audio mejorado
  const [audioContext, setAudioContext] = useState(null);

  const inicializarAudio = useCallback(() => {
    if (!audioContext && typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [audioContext]);

  const reproducirSonido = useCallback((tipo, volumen = 0.5) => {
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      let frecuencia, duracion, tipoOnda;
      
      switch (tipo) {
        case 'lanzar':
          frecuencia = 800;
          duracion = 0.6;
          tipoOnda = 'sine';
          break;
        case 'recoger':
          frecuencia = 1200;
          duracion = 0.3;
          tipoOnda = 'square';
          break;
        case 'carrete':
          frecuencia = 900;
          duracion = 0.2;
          tipoOnda = 'sawtooth';
          break;
        case 'pez_pica':
          frecuencia = 600;
          duracion = 1.0;
          tipoOnda = 'triangle';
          break;
        case 'pez_salta':
          frecuencia = 800;
          duracion = 0.8;
          tipoOnda = 'sine';
          break;
        case 'splash_pequeno':
          frecuencia = 400;
          duracion = 0.8;
          tipoOnda = 'sine';
          break;
        case 'splash_mediano':
          frecuencia = 350;
          duracion = 1.0;
          tipoOnda = 'sine';
          break;
        case 'splash_grande':
          frecuencia = 300;
          duracion = 1.2;
          tipoOnda = 'sine';
          break;
        case 'splash_epico':
          frecuencia = 250;
          duracion = 1.5;
          tipoOnda = 'sine';
          break;
        default:
          frecuencia = 440;
          duracion = 0.3;
          tipoOnda = 'sine';
      }

      oscillator.type = tipoOnda;
      oscillator.frequency.setValueAtTime(frecuencia, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volumen, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duracion);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duracion);
    } catch (error) {
      console.log('Error reproduciendo sonido:', error);
    }
  }, [audioContext]);

  // Generar pez aleatorio
  const generarPezAleatorio = useCallback(() => {
    const peces = Object.values(PECES_DISPONIBLES);
    const pezSeleccionado = peces[Math.floor(Math.random() * peces.length)];
    
    const peso = (
      Math.random() * (pezSeleccionado.pesoMax - pezSeleccionado.pesoMin) + 
      pezSeleccionado.pesoMin
    ).toFixed(1);
    
    const longitud = Math.floor(
      Math.random() * (pezSeleccionado.longitudMax - pezSeleccionado.longitudMin) + 
      pezSeleccionado.longitudMin
    );

    return {
      ...pezSeleccionado,
      peso: parseFloat(peso),
      longitud: longitud,
      id: `${pezSeleccionado.id}_${Date.now()}`
    };
  }, []);

  // Lanzar señuelo
  const lanzarSenuelo = useCallback(() => {
    if (estadoJuego !== ESTADOS_JUEGO.INICIAL) return;

    console.log('🎣 Lanzando señuelo...');
    inicializarAudio();
    reproducirSonido('lanzar');
    setEstadoJuego(ESTADOS_JUEGO.LANZANDO);
    setPezSaliendoDelAgua(false);
    
    // Animación del lanzamiento
    const nuevaX = 25 + Math.random() * 50; // 25-75%
    const nuevaY = 35 + Math.random() * 35; // 35-70%
    setPosicionSedal({ x: nuevaX, y: nuevaY });

    // Transición a pescando
    setTimeout(() => {
      console.log('🌊 Señuelo en el agua, esperando...');
      setEstadoJuego(ESTADOS_JUEGO.PESCANDO);
      
      // Tiempo aleatorio para que pique un pez
      const tiempoEspera = CONFIG_JUEGO.TIEMPO_ESPERA_MIN + 
        Math.random() * (CONFIG_JUEGO.TIEMPO_ESPERA_MAX - CONFIG_JUEGO.TIEMPO_ESPERA_MIN);

      console.log(`⏳ Pez picará en ${(tiempoEspera/1000).toFixed(1)}s`);

      timeoutPescaRef.current = setTimeout(() => {
        iniciarCaptura();
      }, tiempoEspera);
    }, 1200);
  }, [estadoJuego, inicializarAudio, reproducirSonido]);

  // Iniciar captura de pez
  const iniciarCaptura = useCallback(() => {
    const nuevoPez = generarPezAleatorio();
    console.log('🐟 Pez picó:', nuevoPez.nombre, `${nuevoPez.peso}kg`);
    
    setPezActual(nuevoPez);
    setEstadoJuego(ESTADOS_JUEGO.LUCHANDO);
    setTension(30 + Math.random() * 20); // 30-50% inicial
    setTiempoLucha(0);
    tiempoInicioLuchaRef.current = Date.now();
    
    reproducirSonido('pez_pica');
    iniciarLucha(nuevoPez);
  }, [generarPezAleatorio, reproducirSonido]);

  // Iniciar lucha con el pez
  const iniciarLucha = useCallback((pez) => {
    console.log('⚔️ Iniciando lucha con:', pez.nombre);
    
    intervalLuchaRef.current = setInterval(() => {
      const tiempoActual = Date.now() - tiempoInicioLuchaRef.current;
      setTiempoLucha(tiempoActual);

      setTension(prev => {
        const factorDificultad = pez.dificultad / 10;
        const incremento = (0.8 + Math.random() * 1.5) * factorDificultad;
        const nuevaTension = Math.min(prev + incremento, CONFIG_JUEGO.TENSION_MAX);
        
        // Si la tensión llega al máximo, el pez se escapa
        if (nuevaTension >= CONFIG_JUEGO.TENSION_MAX) {
          console.log('💔 Pez escapó por tensión máxima');
          clearInterval(intervalLuchaRef.current);
          setEstadoJuego(ESTADOS_JUEGO.PERDIDO);
          reproducirSonido('splash_grande');
          setTimeout(() => reiniciarJuego(), 2500);
        }
        
        return nuevaTension;
      });

      // Límite de tiempo de lucha
      if (tiempoActual >= CONFIG_JUEGO.TIEMPO_LUCHA_MAX) {
        console.log('⏰ Tiempo de lucha agotado');
        clearInterval(intervalLuchaRef.current);
        setEstadoJuego(ESTADOS_JUEGO.PERDIDO);
        reproducirSonido('splash_grande');
        setTimeout(() => reiniciarJuego(), 2500);
      }
    }, 100);
  }, [reproducirSonido]);

  // Recoger sedal
  const recogerSedal = useCallback(() => {
    if (estadoJuego !== ESTADOS_JUEGO.LUCHANDO) return;

    console.log('⬆️ Recogiendo sedal');
    reproducirSonido('recoger');
    reproducirSonido('carrete', 0.3);
    
    setTension(prev => {
        let reduccion = 12 + Math.random() * 8; // 12-20 de reducción
        let nuevaTension = Math.max(prev - reduccion, 0);
        if (isNaN(nuevaTension)) nuevaTension = 0;
      
      console.log(`📉 Tensión: ${prev.toFixed(1)} → ${nuevaTension.toFixed(1)}`);
      
      // Si la tensión llega a 0, el pez es capturado
      if (nuevaTension <= 3) {
        console.log('🎉 ¡Pez capturado!');
        clearInterval(intervalLuchaRef.current);
        setPezSaliendoDelAgua(true);
        reproducirSonido('pez_salta');
        
        // Animación del pez saliendo del agua
        setTimeout(() => {
          setEstadoJuego(ESTADOS_JUEGO.CAPTURADO);
          if (pezActual) {
            reproducirSonido(pezActual.sonidoCaptura);
            actualizarEstadisticas(pezActual);
          }
        }, 500);
      }
      
      return nuevaTension;
    });
  }, [estadoJuego, reproducirSonido, pezActual]);

  // Soltar sedal
  const soltarSedal = useCallback(() => {
    if (estadoJuego !== ESTADOS_JUEGO.LUCHANDO) return;

    console.log('⬇️ Soltando sedal');
    setTension(prev => {
      const reduccion = 6;
      const nuevaTension = Math.max(prev - reduccion, 0);
      console.log(`📉 Tensión: ${prev.toFixed(1)} → ${nuevaTension.toFixed(1)} (soltando)`);
      return nuevaTension;
    });
  }, [estadoJuego]);

  // Actualizar estadísticas del jugador
  const actualizarEstadisticas = useCallback((pez) => {
    setEstadisticasJugador(prev => {
      const nuevaExp = prev.experiencia + (pez.dificultad * 15);
      const nuevoNivel = nuevaExp >= prev.experienciaNecesaria ? prev.nivel + 1 : prev.nivel;
      
      const nuevasStats = {
        ...prev,
        pecesCapturados: prev.pecesCapturados + 1,
        puntosTotales: prev.puntosTotales + pez.puntos,
        experiencia: nuevaExp >= prev.experienciaNecesaria ? 
          nuevaExp - prev.experienciaNecesaria : nuevaExp,
        experienciaNecesaria: nuevoNivel > prev.nivel ? 
          prev.experienciaNecesaria + 50 : prev.experienciaNecesaria,
        nivel: nuevoNivel
      };
      
      console.log('📊 Estadísticas actualizadas:', nuevasStats);
      return nuevasStats;
    });
  }, []);

  // Reiniciar juego
  const reiniciarJuego = useCallback(() => {
    console.log('🔄 Reiniciando juego');
    clearTimeout(timeoutPescaRef.current);
    clearInterval(intervalLuchaRef.current);
    setEstadoJuego(ESTADOS_JUEGO.INICIAL);
    setPezActual(null);
    setTension(0);
    setTiempoLucha(0);
    setPosicionSedal({ x: 50, y: 15 });
    setPezSaliendoDelAgua(false);
  }, []);

  // Pausar/reanudar juego
  const pausarJuego = useCallback(() => {
    if (estadoJuego === ESTADOS_JUEGO.LUCHANDO) {
      clearInterval(intervalLuchaRef.current);
    }
    if (estadoJuego === ESTADOS_JUEGO.PESCANDO) {
      clearTimeout(timeoutPescaRef.current);
    }
  }, [estadoJuego]);

  const reanudarJuego = useCallback(() => {
    if (estadoJuego === ESTADOS_JUEGO.LUCHANDO && pezActual) {
      iniciarLucha(pezActual);
    }
    if (estadoJuego === ESTADOS_JUEGO.PESCANDO) {
      const tiempoEspera = 2000 + Math.random() * 3000;
      timeoutPescaRef.current = setTimeout(() => {
        iniciarCaptura();
      }, tiempoEspera);
    }
  }, [estadoJuego, pezActual, iniciarLucha, iniciarCaptura]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearTimeout(timeoutPescaRef.current);
      clearInterval(intervalLuchaRef.current);
    };
  }, []);

  return {
    // Estados
    estadoJuego,
    pezActual,
    tension,
    tiempoLucha,
    posicionSedal,
    estadisticasJugador,
    pezSaliendoDelAgua,
    
    // Acciones
    lanzarSenuelo,
    recogerSedal,
    soltarSedal,
    reiniciarJuego,
    pausarJuego,
    reanudarJuego,
    
    // Audio
    reproducirSonido,
    inicializarAudio
  };
};

export default useJuegoPesca;