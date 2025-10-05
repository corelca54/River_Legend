import React, { useState, useEffect } from 'react';
import AreaPesca from './componentes/AreaPesca/AreaPesca';
import ControlesJuego from './componentes/ControlesJuego/ControlesJuego';
import EstadoJugador from './componentes/estadoJugador/estadoJugador';
import MedidorTension from './componentes/MedidorTension/MedidorTension';
import ModalCapturaPez from './componentes/ModalCaptura/ModalCapturaPez';
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

  try {
    return (
      <div className="fishing-game" style={{ minHeight: '100vh', minWidth: '100vw', background: '#4682B4' }}>
        {/* Imagen fija de fondo del río */}
        <div className="imagen-background" />

        {/* Panel de estadísticas del jugador */}
        <div className="panel-superior" style={{zIndex: 10}}>
          <EstadoJugador estadisticas={estadisticasJugador} />
        </div>

        {/* Área principal de pesca CON IMÁGENES REALES */}
        <div style={{zIndex: 5, position: 'relative'}}>
          <AreaPesca
            pezActual={pezActual}
            posicionSedal={posicionSedal}
            estadoJuego={estadoJuego}
            tension={tension}
            tiempoLucha={tiempoLucha}
            pezSaliendoDelAgua={pezSaliendoDelAgua}
          />
        </div>

        {/* Medidor de tensión (solo durante la lucha) */}
        {estadoJuego === 'luchando' && (
          <div className="medidor-tension-container" style={{zIndex: 20}}>
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
        <div style={{zIndex: 100, position: 'absolute', left: 0, right: 0, bottom: 0}}>
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
        </div>

        {/* Imagen del pez capturado en grande (sin mensajes flotantes) */}
        {estadoJuego === 'capturado' && pezActual && pezActual.imagen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 24
          }}>
            <img
              src={pezActual.imagen.startsWith('/') ? pezActual.imagen : `/assets/imagenes/peces/${pezActual.imagen}`}
              alt={pezActual.nombre}
              style={{
                width: 180,
                height: 'auto',
                borderRadius: 18,
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                background: 'rgba(255,255,255,0.05)',
                marginBottom: 12
              }}
            />
          </div>
        )}

        {/* Modal de información del pez CON IMAGEN REAL */}
        {mostrarInfoPez && pezActual && (
          <ModalCapturaPez
            pezCapturado={pezActual}
            visible={mostrarInfoPez}
            onCerrar={cerrarInfoPez}
            esNuevoRecord={false}
            puntosGanados={pezActual.puntos || 0}
            experienciaGanada={pezActual.experiencia || 0}
          />
        )}

        {/* Indicadores ambientales (mantener, pero sin mensaje de lanzar señuelo) */}
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
  } catch (error) {
    return (
      <div style={{background: '#4682B4', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h2>Error al cargar el juego</h2>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default FishingGame;