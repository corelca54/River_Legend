import React, { useState, useEffect } from 'react';
// Imports corregidos según tu estructura de carpetas
import VideoBackground from '../multimedia/VideoBackground/VideoBackground';
import AreaPesca from './componentes/AreaPesca/AreaPesca';
import ControlesJuego from './componentes/ControlesJuego/ControlesJuego';
import EstadoJugador from './componentes/estadoJugador/estadoJugador';
import InfoPez from './componentes/InfoPez/InfoPez';
import MedidorTension from './componentes/MedidorTension/MedidorTension';
import ModalCaptura from './componentes/ModalCaptura/ModalCapturaPez';
import { useJuegoPesca } from '../../hooks/useJuegoPesca';
import { obtenerPezAleatorio } from '../../data/datosPeces';
import './FishingGame.css';

const FishingGame = () => {
  // Estados del juego principal
  const [mostrarInfoPez, setMostrarInfoPez] = useState(false);
  const [mostrarModalCaptura, setMostrarModalCaptura] = useState(false);
  const [pezCapturado, setPezCapturado] = useState(null);
  const [efectosSonido, setEfectosSonido] = useState(true);
  
  // Hook personalizado para la lógica del juego
  const {
    estadoJuego,
    pezActual,
    tension,
    tiempoLucha,
    posicionSedal,
    estadisticasJugador,
    lanzarSenuelo,
    recogerSedal,
    soltarSedal,
    reiniciarJuego,
    pausarJuego,
    reanudarJuego,
    puedeLanzar,
    puedeRecoger,
    puedeSoltar,
    alternarPausa
  } = useJuegoPesca();

  // Audio context para efectos de sonido
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    // Inicializar audio context
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
      }
    };

    // Inicializar audio al primer clic del usuario
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [audioContext]);

  // Reproducir efectos de sonido
  const reproducirSonido = (tipo, volumen = 0.3) => {
    if (!efectosSonido || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    let frecuencia = 440;
    let duracion = 0.2;

    switch (tipo) {
      case 'lanzar':
        frecuencia = 800;
        duracion = 0.4;
        oscillator.type = 'sine';
        break;
      case 'recoger':
        frecuencia = 600;
        duracion = 0.2;
        oscillator.type = 'square';
        break;
      case 'pez_pica':
        frecuencia = 1000;
        duracion = 0.6;
        oscillator.type = 'triangle';
        break;
      case 'captura':
        frecuencia = 1200;
        duracion = 1.0;
        oscillator.type = 'sine';
        break;
      case 'escape':
        frecuencia = 200;
        duracion = 0.8;
        oscillator.type = 'sawtooth';
        break;
      default:
        oscillator.type = 'sine';
    }

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volumen, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duracion);

    oscillator.frequency.setValueAtTime(frecuencia, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duracion);
  };

  // Manejar eventos del juego
  const manejarLanzamiento = () => {
    lanzarSenuelo();
    reproducirSonido('lanzar');
  };

  const manejarRecogida = () => {
    recogerSedal();
    reproducirSonido('recoger');
  };

  const manejarSoltada = () => {
    soltarSedal();
    reproducirSonido('recoger', 0.2);
  };

  const manejarCaptura = (pez) => {
    setPezCapturado(pez);
    setMostrarModalCaptura(true);
    reproducirSonido('captura');
  };

  const manejarEscape = () => {
    reproducirSonido('escape');
  };

  const manejarPezSale = () => {
    if (pezActual) {
      manejarCaptura(pezActual);
    }
  };

  const cerrarModalCaptura = () => {
    setMostrarModalCaptura(false);
    setPezCapturado(null);
    reiniciarJuego();
  };

  // Obtener mensaje de estado del juego
  const obtenerMensajeEstado = () => {
    switch (estadoJuego) {
      case 'inicial':
        return '🎣 Haz clic en "Lanzar" para comenzar a pescar';
      case 'lanzando':
        return '🌊 Lanzando señuelo al río...';
      case 'pescando':
        return '⏳ Esperando que pique un pez... (El agua está turbia)';
      case 'luchando':
        return `🎯 ¡${pezActual?.nombre || 'Pez'} luchando! Controla la tensión`;
      case 'capturado':
        return `🎉 ¡${pezActual?.nombre || 'Pez'} capturado!`;
      case 'perdido':
        return `😞 El ${pezActual?.nombre || 'pez'} se escapó...`;
      case 'pausado':
        return '⏸️ Juego pausado';
      default:
        return '';
    }
  };

  // Obtener color de la tensión
  const obtenerColorTension = () => {
    if (tension < 30) return '#4CAF50';
    if (tension < 60) return '#FFC107';
    if (tension < 80) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="fishing-game-container">
      {/* Video de fondo del río */}
      <VideoBackground />

      {/* Área principal de pesca */}
      <AreaPesca
        pezActual={pezActual}
        posicionSedal={posicionSedal}
        estadoJuego={estadoJuego}
        tension={tension}
        onPezSale={manejarPezSale}
      />

      {/* Panel de estadísticas del jugador */}
      <div className="panel-estadisticas-superior">
        <EstadoJugador estadisticas={estadisticasJugador} />
      </div>

      {/* Medidor de tensión (solo visible durante la lucha) */}
      {estadoJuego === 'luchando' && (
        <div className="medidor-tension-overlay">
          <MedidorTension
            tension={tension}
            tensionMaxima={100}
            colorTension={obtenerColorTension()}
            tiempoLucha={tiempoLucha}
            pezNombre={pezActual?.nombre}
          />
        </div>
      )}

      {/* Controles del juego */}
      <div className="controles-principales">
        <ControlesJuego
          estadoJuego={estadoJuego}
          puedeLanzar={puedeLanzar}
          puedeRecoger={puedeRecoger}
          puedeSoltar={puedeSoltar}
          onLanzar={manejarLanzamiento}
          onRecoger={manejarRecogida}
          onSoltar={manejarSoltada}
          onReiniciar={reiniciarJuego}
          onPausa={alternarPausa}
        />
      </div>

      {/* Mensaje de estado */}
      <div className="mensaje-estado-juego">
        <div className={`estado-texto ${estadoJuego}`}>
          {obtenerMensajeEstado()}
        </div>
        
        {/* Información adicional durante la lucha */}
        {estadoJuego === 'luchando' && pezActual && (
          <div className="info-lucha-activa">
            <div className="pez-info-mini">
              <span className="pez-nombre">{pezActual.nombre}</span>
              <span className="pez-peso">{pezActual.peso}kg</span>
              <span className={`pez-rareza ${pezActual.rareza}`}>
                {pezActual.rareza.toUpperCase()}
              </span>
            </div>
            <div className="consejos-lucha">
              <p>💡 Usa "Recoger" y "Soltar" para controlar la tensión</p>
              <p>⚠️ No dejes que la tensión llegue al 100%</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de captura exitosa */}
      {mostrarModalCaptura && pezCapturado && (
        <ModalCaptura
          pez={pezCapturado}
          visible={mostrarModalCaptura}
          onCerrar={cerrarModalCaptura}
          estadisticas={estadisticasJugador}
        />
      )}

      {/* Modal de información detallada del pez */}
      {mostrarInfoPez && pezActual && (
        <InfoPez
          pez={pezActual}
          visible={mostrarInfoPez}
          onCerrar={() => setMostrarInfoPez(false)}
        />
      )}

      {/* Indicadores de profundidad y condiciones */}
      <div className="indicadores-ambiente">
        <div className="condiciones-agua">
          <div className="condicion">
            <span className="icono">🌊</span>
            <span className="texto">Agua Turbia</span>
          </div>
          <div className="condicion">
            <span className="icono">🌡️</span>
            <span className="texto">25°C</span>
          </div>
          <div className="condicion">
            <span className="icono">💨</span>
            <span className="texto">Viento Suave</span>
          </div>
        </div>
      </div>

      {/* Easter eggs y detalles ambientales */}
      <div className="detalles-ambientales">
        {/* Sonidos del río */}
        <div className="efectos-audio-visual">
          {efectosSonido && (
            <div className="indicador-audio">
              <span className="onda-sonido onda-1"></span>
              <span className="onda-sonido onda-2"></span>
              <span className="onda-sonido onda-3"></span>
            </div>
          )}
        </div>

        {/* Vida silvestre ocasional */}
        <div className="vida-silvestre">
          <div className="pajaro pajaro-1">🦅</div>
          <div className="mariposa mariposa-1">🦋</div>
        </div>
      </div>
    </div>
  );
};

export default FishingGame;