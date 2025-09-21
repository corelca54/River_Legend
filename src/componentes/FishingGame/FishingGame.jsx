/**
 * FishingGame.jsx - Componente principal del juego de pesca
 * Orquesta todos los subcomponentes y maneja el estado global del juego
 */

import React from 'react';
import { useJuegoPesca } from '../../hooks/useJuegoPesca';
import { ESTADOS_JUEGO } from '../../data/constantesJuego';

// Importación de componentes
import VideoFondo from '../multimedia/VideoBackground/VideoBackground';
import EstadisticasJugador from './componentes/estadoJugador/estadoJugador';
import AreaPesca from './componentes/AreaPesca/AreaPesca';
import MedidorTension from './componentes/MedidorTension/MedidorTension';
import ControlesJuego from './componentes/ControlesJuego/ControlesJuego';
import InfoPez from './componentes/InfoPez/InfoPez';

// Importación de estilos
import './FishingGame.css';

/**
 * Componente principal del juego de pesca colombiano
 * Integra todos los elementos del juego en una experiencia cohesiva
 */
const JuegoPesca = () => {
  // Hook principal con toda la lógica del juego
  const {
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
    
    // Estados condicionales
    tensionCritica,
    puedeRecoger,
    puedeSoltar,
    puedeLanzar
  } = useJuegoPesca();

  // Función para determinar si mostrar el medidor de tensión
  const mostrarMedidorTension = () => {
    return estadoJuego === ESTADOS_JUEGO.LUCHANDO;
  };

  // Función para determinar el mensaje de estado a mostrar
  const obtenerMensajeEstado = () => {
    if (mensajeEstado) return mensajeEstado;
    
    switch (estadoJuego) {
      case ESTADOS_JUEGO.LANZANDO:
        return "Lanzando señuelo al río...";
      case ESTADOS_JUEGO.PESCANDO:
        return "Esperando que pique un pez... 🎣";
      case ESTADOS_JUEGO.LUCHANDO:
        return pezActual ? `¡${pezActual.nombre} luchando! Tiempo: ${tiempoLucha.toFixed(1)}s` : "";
      case ESTADOS_JUEGO.PERDIDO:
        return "¡El pez se escapó! 💔";
      case ESTADOS_JUEGO.PAUSA:
        return "Juego en pausa";
      default:
        return "";
    }
  };

  return (
    <div className="juego-pesca">
      {/* Video de fondo del río */}
      <VideoFondo />
      
      {/* Interfaz principal del juego */}
      <div className="interfaz-juego">
        
        {/* Panel superior con estadísticas del jugador */}
        <div className="panel-superior">
          <EstadisticasJugador
            nivel={nivel}
            experiencia={experiencia}
            puntuacion={puntuacion}
            pezesCapturados={pezesCapturados.length}
          />
        </div>

        {/* Área central de pesca */}
        <div className="area-central-pesca">
          <AreaPesca
            estadoJuego={estadoJuego}
            posicionSenuelo={posicionSenuelo}
            profundidad={profundidad}
            pezActual={pezActual}
            animacionPez={animacionPez}
            tiempoLucha={tiempoLucha}
          />
          
          {/* Panel de información del pez durante la lucha */}
          {estadoJuego === ESTADOS_JUEGO.LUCHANDO && pezActual && (
            <div className="panel-info-lucha">
              <div className="header-info-lucha">
                <h3>{pezActual.nombre}</h3>
                <span className="rareza-badge" style={{ backgroundColor: pezActual.rareza === 'común' ? '#90EE90' : pezActual.rareza === 'raro' ? '#87CEEB' : pezActual.rareza === 'épico' ? '#DDA0DD' : '#FFD700' }}>
                  {pezActual.rareza.toUpperCase()}
                </span>
              </div>
              <div className="stats-lucha">
                <div className="stat-lucha">
                  <span className="label">Peso:</span>
                  <span className="valor">{pezActual.pesoActual}kg</span>
                </div>
                <div className="stat-lucha">
                  <span className="label">Longitud:</span>
                  <span className="valor">{pezActual.longitudActual}cm</span>
                </div>
                <div className="stat-lucha">
                  <span className="label">Dificultad:</span>
                  <span className="valor">{pezActual.dificultad}/10</span>
                </div>
                <div className="stat-lucha">
                  <span className="label">Hábitat:</span>
                  <span className="valor-habitat">{pezActual.habitat}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Medidor de tensión (solo visible durante la lucha) */}
          {mostrarMedidorTension() && (
            <MedidorTension
              tension={tension}
              tensionCritica={tensionCritica}
              colorTension={obtenerColorTension(tension)}
            />
          )}
        </div>

        {/* Panel de controles */}
        <div className="panel-controles">
          <ControlesJuego
            estadoJuego={estadoJuego}
            puedeLanzar={puedeLanzar}
            puedeRecoger={puedeRecoger}
            puedeSoltar={puedeSoltar}
            onLanzar={lanzarSenuelo}
            onRecoger={recogerSedal}
            onSoltar={soltarSedal}
            onReiniciar={reiniciarJuego}
            onPausa={alternarPausa}
          />
        </div>

        {/* Mensaje de estado del juego */}
        {obtenerMensajeEstado() && (
          <div className="mensaje-estado">
            <div className={`texto-estado ${estadoJuego === ESTADOS_JUEGO.PERDIDO ? 'error' : ''}`}>
              {obtenerMensajeEstado()}
            </div>
          </div>
        )}

        {/* Botón de colección de peces */}
        <button 
          className="boton-coleccion"
          onClick={() => {/* Implementar modal de colección */}}
          title="Ver colección de peces"
        >
          📚 Colección ({pezesCapturados.length})
        </button>

        {/* Botón de estadísticas */}
        <button 
          className="boton-estadisticas"
          onClick={() => {/* Implementar modal de estadísticas */}}
          title="Ver estadísticas detalladas"
        >
          📊 Estadísticas
        </button>
      </div>

      {/* Modal de información del pez capturado */}
      {mostrandoInfoPez && ultimaCaptura && (
        <InfoPez
          pez={ultimaCaptura}
          onCerrar={() => {/* Se cierra automáticamente */}}
          mostrarAnimacion={true}
          historialPeces={pezesCapturados}
        />
      )}
    </div>
  );
};

export default JuegoPesca;