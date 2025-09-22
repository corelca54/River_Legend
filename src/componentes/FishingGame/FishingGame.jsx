/**
 * FishingGame.jsx - VERSIÓN ACTUALIZADA con modal de captura realista
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
import ModalCapturaPez from './componentes/ModalCaptura/ModalCapturaPez';

// Importación de estilos
import './FishingGame.css';

/**
 * Componente principal del juego de pesca colombiano MEJORADO
 * Ahora incluye modal de captura realista y efectos visuales avanzados
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

  // Función para cerrar el modal de captura
  const cerrarModalCaptura = () => {
    // En el hook real, esto debería cambiar el estado
    // Por ahora simularemos cerrando después de 3 segundos
    setTimeout(() => {
      reiniciarJuego();
    }, 100);
  };

  // Verificar si hay nuevo récord
  const esNuevoRecord = ultimaCaptura && pezesCapturados.length > 1 && (
    ultimaCaptura.pesoActual > Math.max(...pezesCapturados.slice(0, -1)
      .filter(p => p.id === ultimaCaptura.id)
      .map(p => p.pesoActual || 0), 0) ||
    ultimaCaptura.longitudActual > Math.max(...pezesCapturados.slice(0, -1)
      .filter(p => p.id === ultimaCaptura.id)
      .map(p => p.longitudActual || 0), 0)
  );

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
                <span 
                  className="rareza-badge" 
                  style={{ 
                    backgroundColor: pezActual.rareza === 'común' ? '#90EE90' : 
                                    pezActual.rareza === 'raro' ? '#87CEEB' : 
                                    pezActual.rareza === 'épico' ? '#DDA0DD' : '#FFD700',
                    color: pezActual.rareza === 'común' ? '#2F4F4F' : '#FFFFFF'
                  }}
                >
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

        {/* Botones flotantes mejorados */}
        <div className="botones-flotantes">
          <button 
            className="boton-coleccion"
            onClick={() => {/* Implementar modal de colección */}}
            title="Ver colección de peces"
          >
            <span className="icono-boton">📚</span>
            <span className="texto-boton">Colección</span>
            <span className="contador-boton">({pezesCapturados.length})</span>
          </button>

          <button 
            className="boton-estadisticas"
            onClick={() => {/* Implementar modal de estadísticas */}}
            title="Ver estadísticas detalladas"
          >
            <span className="icono-boton">📊</span>
            <span className="texto-boton">Stats</span>
          </button>

          <button 
            className="boton-configuracion"
            onClick={() => {/* Implementar modal de configuración */}}
            title="Configuración del juego"
          >
            <span className="icono-boton">⚙️</span>
            <span className="texto-boton">Config</span>
          </button>
        </div>
      </div>

      {/* MODAL DE CAPTURA REALISTA - NUEVO */}
      <ModalCapturaPez
        pezCapturado={ultimaCaptura}
        visible={estadoJuego === ESTADOS_JUEGO.CAPTURADO && ultimaCaptura}
        onCerrar={cerrarModalCaptura}
        esNuevoRecord={esNuevoRecord}
        puntosGanados={ultimaCaptura?.puntosObtenidos || 0}
        experienciaGanada={ultimaCaptura?.experienciaObtenida || 0}
      />

      {/* Efectos adicionales para mayor realismo */}
      {estadoJuego === ESTADOS_JUEGO.LUCHANDO && (
        <div className="efectos-lucha-globales">
          {/* Efecto de vibración en toda la pantalla */}
          <div className="vibración-pantalla" />
          
          {/* Indicador de tensión crítica */}
          {tensionCritica && (
            <div className="alerta-tension-critica">
              <div className="icono-alerta-grande">⚠️</div>
              <div className="texto-alerta-grande">¡TENSIÓN CRÍTICA!</div>
              <div className="subtexto-alerta">Suelta el sedal para no romperlo</div>
            </div>
          )}
        </div>
      )}

      {/* Efectos de celebración cuando se captura */}
      {estadoJuego === ESTADOS_JUEGO.CAPTURADO && (
        <div className="efectos-celebracion-globales">
          {/* Confetti cayendo */}
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#FFD700', '#FF6B35', '#87CEEB', '#90EE90', '#DDA0DD'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>

          {/* Destello de captura */}
          <div className="destello-captura" />
        </div>
      )}

      {/* Indicadores de progreso */}
      {(estadoJuego === ESTADOS_JUEGO.LANZANDO || estadoJuego === ESTADOS_JUEGO.PESCANDO) && (
        <div className="indicadores-progreso">
          {estadoJuego === ESTADOS_JUEGO.LANZANDO && (
            <div className="progreso-lanzamiento">
              <div className="barra-progreso">
                <div className="relleno-progreso lanzando" />
              </div>
              <div className="texto-progreso">Lanzando señuelo...</div>
            </div>
          )}

          {estadoJuego === ESTADOS_JUEGO.PESCANDO && (
            <div className="progreso-espera">
              <div className="animacion-espera">
                <div className="dot-espera"></div>
                <div className="dot-espera"></div>
                <div className="dot-espera"></div>
              </div>
              <div className="texto-progreso">Esperando pez...</div>
            </div>
          )}
        </div>
      )}

      {/* Panel de información rápida */}
      <div className="info-rapida">
        <div className="info-item">
          <span className="info-icono">🏆</span>
          <span className="info-valor">{puntuacion.toLocaleString()}</span>
        </div>
        <div className="info-item">
          <span className="info-icono">⭐</span>
          <span className="info-valor">Nivel {nivel}</span>
        </div>
        <div className="info-item">
          <span className="info-icono">🐟</span>
          <span className="info-valor">{pezesCapturados.length}</span>
        </div>
      </div>

      {/* Tutorial para nuevos usuarios */}
      {/* ========================================================================== */}
      {/* ESTE ES EL BLOQUE QUE VOY A CORREGIR / AÑADIR EL BOTÓN */}
      {/* ========================================================================== */}
      {pezesCapturados.length === 0 && estadoJuego === ESTADOS_JUEGO.ESPERANDO && (
        <div className="tutorial-overlay">
          <div className="tutorial-bubble">
            <div className="tutorial-titulo">¡Bienvenido a Pesca Colombia!</div>
            <div className="tutorial-texto">
              🎣 Presiona "Lanzar" para comenzar tu aventura de pesca
            </div>
            <div className="tutorial-pasos">
              <div className="paso">1. Lanza el señuelo</div>
              <div className="paso">2. Espera que pique un pez</div>
              <div className="paso">3. ¡Controla la tensión!</div>
            </div>
            {/* ================================================================ */}
            {/* AÑADE ESTE BOTÓN AQUÍ PARA QUE EL USUARIO PUEDA INICIAR */}
            <button className="boton-comenzar-tutorial" onClick={lanzarSenuelo}>
              ¡Comenzar a Pescar!
            </button>
            {/* ================================================================ */}
          </div>
        </div>
      )}
      {/* ========================================================================== */}
      {/* FIN DEL BLOQUE CORREGIDO */}
      {/* ========================================================================== */}
    </div>
  );
};

export default JuegoPesca;