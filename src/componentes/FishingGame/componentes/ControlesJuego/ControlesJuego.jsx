/**
 * ControlesJuego.jsx - Componente de controles del juego de pesca
 * Maneja los botones principales: Lanzar, Recoger, Soltar, etc.
 */

import React, { useState, useEffect } from 'react';
import { ESTADOS_JUEGO } from '../../../../data/constantesJuego';
import './ControlesJuego.css';

/**
 * Componente de controles del juego
 * @param {Object} props - Propiedades del componente
 * @param {string} props.estadoJuego - Estado actual del juego
 * @param {boolean} props.puedeLanzar - Si se puede lanzar el señuelo
 * @param {boolean} props.puedeRecoger - Si se puede recoger el sedal
 * @param {boolean} props.puedeSoltar - Si se puede soltar el sedal
 * @param {Function} props.onLanzar - Función para lanzar
 * @param {Function} props.onRecoger - Función para recoger
 * @param {Function} props.onSoltar - Función para soltar
 * @param {Function} props.onReiniciar - Función para reiniciar
 * @param {Function} props.onPausa - Función para pausar/reanudar
 */
const ControlesJuego = ({
  estadoJuego,
  puedeLanzar,
  puedeRecoger,
  puedeSoltar,
  onLanzar,
  onRecoger,
  onSoltar,
  onReiniciar,
  onPausa
}) => {
  const [presionandoRecoger, setPresionandoRecoger] = useState(false);
  const [presionandoSoltar, setPresionandoSoltar] = useState(false);
  const [vibracionDisponible, setVibracionDisponible] = useState(false);

  // Detectar si la vibración está disponible
  useEffect(() => {
    setVibracionDisponible('vibrate' in navigator);
  }, []);

  // Manejar vibración táctil
  const vibrar = (patron = [50]) => {
    if (vibracionDisponible) {
      navigator.vibrate(patron);
    }
  };

  // Manejar presión continua para recoger
  const manejarInicioRecoger = () => {
    if (!puedeRecoger) return;
    
    setPresionandoRecoger(true);
    vibrar([30]);
    onRecoger();
    
    // Recoger continuo mientras se mantenga presionado
    const intervalo = setInterval(() => {
      if (puedeRecoger) {
        onRecoger();
      }
    }, 100);
    
    // Cleanup function para el intervalo
    const cleanup = () => {
      clearInterval(intervalo);
      setPresionandoRecoger(false);
    };
    
    // Event listeners para detectar cuando se suelta
    const manejarFin = () => {
      cleanup();
      document.removeEventListener('mouseup', manejarFin);
      document.removeEventListener('touchend', manejarFin);
    };
    
    document.addEventListener('mouseup', manejarFin);
    document.addEventListener('touchend', manejarFin);
  };

  // Manejar presión continua para soltar
  const manejarInicioSoltar = () => {
    if (!puedeSoltar) return;
    
    setPresionandoSoltar(true);
    vibrar([50]);
    onSoltar();
    
    // Soltar continuo mientras se mantenga presionado
    const intervalo = setInterval(() => {
      if (puedeSoltar) {
        onSoltar();
      }
    }, 150);
    
    // Cleanup function para el intervalo
    const cleanup = () => {
      clearInterval(intervalo);
      setPresionandoSoltar(false);
    };
    
    // Event listeners para detectar cuando se suelta
    const manejarFin = () => {
      cleanup();
      document.removeEventListener('mouseup', manejarFin);
      document.removeEventListener('touchend', manejarFin);
    };
    
    document.addEventListener('mouseup', manejarFin);
    document.addEventListener('touchend', manejarFin);
  };

  // Manejar clic en lanzar
  const manejarLanzar = () => {
    if (!puedeLanzar) return;
    vibrar([100, 50, 100]);
    onLanzar();
  };

  // Manejar clic en reiniciar
  const manejarReiniciar = () => {
    vibrar([80]);
    onReiniciar();
  };

  // Manejar clic en pausa
  const manejarPausa = () => {
    vibrar([60]);
    onPausa();
  };

  // Obtener texto del botón de lanzar según el estado
  const obtenerTextoLanzar = () => {
    switch (estadoJuego) {
      case ESTADOS_JUEGO.LANZANDO:
        return 'Lanzando...';
      case ESTADOS_JUEGO.PESCANDO:
        return 'Pescando...';
      case ESTADOS_JUEGO.LUCHANDO:
        return 'Luchando!';
      default:
        return 'Lanzar';
    }
  };

  // Obtener icono del botón de lanzar según el estado
  const obtenerIconoLanzar = () => {
    switch (estadoJuego) {
      case ESTADOS_JUEGO.LANZANDO:
        return '🎯';
      case ESTADOS_JUEGO.PESCANDO:
        return '🎣';
      case ESTADOS_JUEGO.LUCHANDO:
        return '⚔️';
      default:
        return '🎣';
    }
  };

  return (
    <div className="controles-juego">
      {/* Controles principales */}
      <div className="controles-principales">
        
        {/* Botón de lanzar */}
        <button
          className={`control-btn lanzar ${!puedeLanzar ? 'deshabilitado' : ''} ${estadoJuego === ESTADOS_JUEGO.LANZANDO ? 'activo' : ''}`}
          onClick={manejarLanzar}
          disabled={!puedeLanzar}
        >
          <div className="contenido-boton">
            <span className="icono-boton">{obtenerIconoLanzar()}</span>
            <span className="texto-boton">{obtenerTextoLanzar()}</span>
          </div>
          {estadoJuego === ESTADOS_JUEGO.ESPERANDO && (
            <div className="indicador-pulse" />
          )}
        </button>

        {/* Botón de recoger */}
        <button
          className={`control-btn recoger ${!puedeRecoger ? 'deshabilitado' : ''} ${presionandoRecoger ? 'presionado' : ''}`}
          onMouseDown={manejarInicioRecoger}
          onTouchStart={manejarInicioRecoger}
          disabled={!puedeRecoger}
        >
          <div className="contenido-boton">
            <span className="icono-boton">⬆️</span>
            <span className="texto-boton">Recoger</span>
          </div>
          <div className="efecto-indicador">-15% Tensión</div>
          {presionandoRecoger && (
            <div className="efecto-presion" />
          )}
        </button>

        {/* Botón de soltar */}
        <button
          className={`control-btn soltar ${!puedeSoltar ? 'deshabilitado' : ''} ${presionandoSoltar ? 'presionado' : ''}`}
          onMouseDown={manejarInicioSoltar}
          onTouchStart={manejarInicioSoltar}
          disabled={!puedeSoltar}
        >
          <div className="contenido-boton">
            <span className="icono-boton">⬇️</span>
            <span className="texto-boton">Soltar</span>
          </div>
          <div className="efecto-indicador">-25% Tensión</div>
          {presionandoSoltar && (
            <div className="efecto-presion" />
          )}
        </button>
      </div>

      {/* Controles secundarios */}
      <div className="controles-secundarios">
        
        {/* Botón de pausa */}
        <button
          className="control-btn-secundario pausa"
          onClick={manejarPausa}
          title={estadoJuego === ESTADOS_JUEGO.PAUSA ? 'Reanudar' : 'Pausar'}
        >
          <span className="icono-boton">
            {estadoJuego === ESTADOS_JUEGO.PAUSA ? '▶️' : '⏸️'}
          </span>
        </button>

        {/* Botón de reiniciar */}
        <button
          className="control-btn-secundario reiniciar"
          onClick={manejarReiniciar}
          title="Reiniciar juego"
        >
          <span className="icono-boton">🔄</span>
        </button>

        {/* Botón de configuración */}
        <button
          className="control-btn-secundario configuracion"
          onClick={() => {/* Implementar modal de configuración */}}
          title="Configuración"
        >
          <span className="icono-boton">⚙️</span>
        </button>
      </div>

      {/* Instrucciones de uso */}
      <div className="instrucciones-controles">
        {estadoJuego === ESTADOS_JUEGO.ESPERANDO && (
          <div className="instruccion activa">
            <span className="icono-instruccion">💡</span>
            <span className="texto-instruccion">Presiona "Lanzar" para comenzar a pescar</span>
          </div>
        )}
        
        {estadoJuego === ESTADOS_JUEGO.PESCANDO && (
          <div className="instruccion activa">
            <span className="icono-instruccion">⏳</span>
            <span className="texto-instruccion">Espera pacientemente... un pez puede picar en cualquier momento</span>
          </div>
        )}
        
        {estadoJuego === ESTADOS_JUEGO.LUCHANDO && (
          <div className="instruccion activa critica">
            <span className="icono-instruccion">⚠️</span>
            <span className="texto-instruccion">
              ¡Controla la tensión! Mantén presionado "Recoger" o "Soltar" según sea necesario
            </span>
          </div>
        )}
      </div>

      {/* Indicadores de estado */}
      <div className="indicadores-estado">
        
        {/* Indicador de vibración */}
        {vibracionDisponible && (
          <div className="indicador-caracteristica">
            <span className="icono-caracteristica">📳</span>
            <span className="texto-caracteristica">Vibración activa</span>
          </div>
        )}
        
        {/* Indicador de controles táctiles */}
        <div className="indicador-caracteristica">
          <span className="icono-caracteristica">👆</span>
          <span className="texto-caracteristica">Controles táctiles optimizados</span>
        </div>
        
        {/* Indicador de estado del juego */}
        <div className={`indicador-estado-juego ${estadoJuego}`}>
          <div className="punto-estado" />
          <span className="texto-estado">
            {estadoJuego === ESTADOS_JUEGO.ESPERANDO && 'Listo para pescar'}
            {estadoJuego === ESTADOS_JUEGO.LANZANDO && 'Lanzando señuelo'}
            {estadoJuego === ESTADOS_JUEGO.PESCANDO && 'Esperando pez'}
            {estadoJuego === ESTADOS_JUEGO.LUCHANDO && 'Pez luchando'}
            {estadoJuego === ESTADOS_JUEGO.CAPTURADO && 'Pez capturado'}
            {estadoJuego === ESTADOS_JUEGO.PERDIDO && 'Pez perdido'}
            {estadoJuego === ESTADOS_JUEGO.PAUSA && 'Juego pausado'}
          </span>
        </div>
      </div>

      {/* Consejos dinámicos */}
      <div className="consejos-dinamicos">
        {estadoJuego === ESTADOS_JUEGO.LUCHANDO && (
          <div className="consejo">
            <span className="icono-consejo">💪</span>
            <span className="texto-consejo">
              Mantén la tensión entre 30-70% para no romper el sedal ni perder el pez
            </span>
          </div>
        )}
        
        {estadoJuego === ESTADOS_JUEGO.ESPERANDO && (
          <div className="consejo">
            <span className="icono-consejo">🎯</span>
            <span className="texto-consejo">
              Los peces más grandes suelen estar en aguas más profundas
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlesJuego;