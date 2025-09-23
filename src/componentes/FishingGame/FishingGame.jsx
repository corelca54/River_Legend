import React, { useState, useEffect } from 'react';
import AreaPesca from './componentes/AreaPesca/AreaPesca';
import ControlesJuego from './componentes/ControlesJuego/ControlesJuego';
import EstadoJugador from './componentes/estadoJugador/estadoJugador';
import MedidorTension from './componentes/MedidorTension/MedidorTension';
import InfoPez from './componentes/InfoPez/InfoPez';
import useJuegoPesca from '../../hooks/useJuegoPesca';
import './FishingGame.css';

const FishingGame = () => {
  // Estados del componente
  const [mostrarInfoPez, setMostrarInfoPez] = useState(false);
  const [efectosSonido, setEfectosSonido] = useState(true);

  // Hook principal del juego
  const {
    estadoJuego,
    pezActual,
    tension,
    tiempoLucha,
    posicionSedal,
    estadisticasJugador,
    pezSaliendoDelAgua,
    lanzarSenuelo,
    recogerSedal,
    soltarSedal,
    reiniciarJuego,
    pausarJuego,
    reanudarJuego,
    reproducirSonido,
    inicializarAudio
  } = useJuegoPesca();

  // Inicializar audio en el primer clic
  useEffect(() => {
    const handleFirstClick = () => {
      inicializarAudio();
      document.removeEventListener('click', handleFirstClick);
    };
    
    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [inicializarAudio]);

  // Mostrar modal de información cuando se captura un pez
  useEffect(() => {
    if (estadoJuego === 'capturado' && pezActual) {
      setTimeout(() => {
        setMostrarInfoPez(true);
      }, 2000); // Esperar a que termine la animación del pez saltando
    } else {
      setMostrarInfoPez(false);
    }
  }, [estadoJuego, pezActual]);

  // Funciones de manejo con efectos de sonido
  const manejarLanzamiento = () => {
    if (efectosSonido) {
      reproducirSonido('lanzar');
    }
    lanzarSenuelo();
  };

  const manejarRecogida = () => {
    if (efectosSonido) {
      reproducirSonido('recoger');
      reproducirSonido('carrete', 0.3);
    }
    recogerSedal();
  };

  const manejarSoltada = () => {
    soltarSedal();
  };

  const cerrarInfoPez = () => {
    setMostrarInfoPez(false);
    // Reiniciar después de cerrar el modal
    setTimeout(() => {
      reiniciarJuego();
    }, 300);
  };

  // Obtener mensaje de estado principal
  const obtenerMensajeEstado = () => {
    switch (estadoJuego) {
      case 'inicial':
        return "🎣 River Legend - Haz clic en 'Lanzar' para comenzar";
      case 'lanzando':
        return "🌊 Lanzando señuelo al río turbio...";
      case 'pescando':
        return "⏳ Esperando que pique un pez... (Agua muy turbia)";
      case 'luchando':
        return `🐟 ¡${pezActual?.nombre} luchando! Tensión: ${Math.round(tension)}%`;
      case 'capturado':
        return `🎉 ¡${pezActual?.nombre} capturado! (+${pezActual?.puntos} pts)`;
      case 'perdido':
        return `😞 El ${pezActual?.nombre || 'pez'} se escapó...`;
      default:
        return "🎣 River Legend";
    }
  };

  // Obtener color de tensión para el medidor
  const obtenerColorTension = () => {
    if (tension < 30) return '#4CAF50';
    if (tension < 60) return '#FFC107';
    if (tension < 80) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="fishing-game">
      {/* Video de fondo del río colombiano */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/assets/videos/rio-colombiano.mp4" type="video/mp4" />
          <source src="/assets/videos/rio-colombiano.webm" type="video/webm" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Panel de estadísticas del jugador */}
      <div className="panel-superior">
        <EstadoJugador estadisticas={estadisticasJugador} />
      </div>

      {/* Área principal de pesca CON IMÁGENES REALES */}
      <AreaPesca
        pezActual={pezActual}
        posicionSedal={posicionSedal}
        estadoJuego={estadoJuego}
        tension={tension}
        tiempoLucha={tiempoLucha}
        pezSaliendoDelAgua={pezSaliendoDelAgua}
      />

      {/* Medidor de tensión (solo durante la lucha) */}
      {estadoJuego === 'luchando' && (
        <div className="medidor-tension-container">
          <MedidorTension
            tension={tension}
            tensionMaxima={100}
            colorTension={obtenerColorTension()}
            tiempoLucha={tiempoLucha}
            pezNombre={pezActual?.nombre}
            pezDificultad={pezActual?.dificultad}
          />
        </div>
      )}

      {/* Controles del juego */}
      <ControlesJuego
        estadoJuego={estadoJuego}
        onLanzar={manejarLanzamiento}
        onRecoger={manejarRecogida}
        onSoltar={manejarSoltada}
        onReiniciar={reiniciarJuego}
        onPausar={pausarJuego}
        onReanudar={reanudarJuego}
        efectosSonido={efectosSonido}
        onToggleSonido={() => setEfectosSonido(!efectosSonido)}
        tension={tension}
      />

      {/* Mensaje de estado principal */}
      <div className="mensaje-estado-principal">
        <div className={`estado-principal ${estadoJuego}`}>
          {obtenerMensajeEstado()}
        </div>

        {/* Información adicional durante la lucha */}
        {estadoJuego === 'luchando' && pezActual && (
          <div className="info-lucha-detallada">
            <div className="consejos-lucha">
              <div className="consejo">
                💡 <strong>Recoger:</strong> Reduce mucho la tensión
              </div>
              <div className="consejo">
                ⚠️ <strong>Soltar:</strong> Reduce poco la tensión
              </div>
              <div className="consejo peligro">
                🚨 <strong>¡No dejes que llegue al 100%!</strong>
              </div>
            </div>
          </div>
        )}

        {/* Celebración cuando se captura */}
        {estadoJuego === 'capturado' && (
          <div className="celebracion-captura">
            <div className="confetti-container">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4FC3F7', '#81C784', '#FFB74D'][
                      Math.floor(Math.random() * 5)
                    ]
                  }}
                />
              ))}
            </div>
            <div className="texto-celebracion">
              ¡PEZ CAPTURADO!
            </div>
          </div>
        )}
      </div>

      {/* Modal de información del pez CON IMAGEN REAL */}
      {mostrarInfoPez && pezActual && (
        <InfoPez
          pez={pezActual}
          visible={mostrarInfoPez}
          onCerrar={cerrarInfoPez}
        />
      )}

      {/* Indicadores ambientales */}
      <div className="indicadores-ambientales">
        <div className="condiciones-rio">
          <div className="condicion">
            <span className="icono-condicion">🌊</span>
            <span className="texto-condicion">Río Turbio</span>
          </div>
          <div className="condicion">
            <span className="icono-condicion">🌡️</span>
            <span className="texto-condicion">24°C</span>
          </div>
          <div className="condicion">
            <span className="icono-condicion">💨</span>
            <span className="texto-condicion">Viento Suave</span>
          </div>
          <div className="condicion">
            <span className="icono-condicion">🕐</span>
            <span className="texto-condicion">Tarde</span>
          </div>
        </div>
      </div>

      {/* Efectos de agua y ambiente */}
      <div className="efectos-ambiente">
        {/* Burbujas del agua */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`burbuja-${i}`}
            className="burbuja"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Ondas en el agua cuando hay actividad */}
        {(estadoJuego === 'lanzando' || estadoJuego === 'luchando') && (
          <div className="ondas-agua">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`onda-${i}`}
                className="onda"
                style={{
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Efecto de chapuzón cuando el pez salta */}
        {pezSaliendoDelAgua && (
          <div className="efecto-chapuzon">
            <div className="splash-principal"></div>
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`gotas-${i}`}
                className="gota-agua"
                style={{
                  left: `${45 + Math.random() * 10}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Overlay de pausa */}
      {estadoJuego === 'pausado' && (
        <div className="overlay-pausa">
          <div className="mensaje-pausa">
            <h2>⏸️ JUEGO PAUSADO</h2>
            <p>Presiona "Reanudar" para continuar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FishingGame;