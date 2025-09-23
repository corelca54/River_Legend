/**
 * estadoJugador.jsx - Componente de estadísticas del jugador
 * Muestra nivel, experiencia, puntuación y progreso
 */

import React from 'react';
import { calcularExperienciaRequerida } from '../../../../herramientas/calculosPesca';
import './estadoJugador.css';

/**
 * Componente que muestra las estadísticas principales del jugador
 * @param {Object} props - Propiedades del componente
 * @param {number} props.nivel - Nivel actual del jugador
 * @param {number} props.experiencia - Experiencia actual
 * @param {number} props.puntuacion - Puntuación total
 * @param {number} props.pezesCapturados - Número de peces capturados
 */
const EstadisticasJugador = ({ 
  nivel, 
  experiencia, 
  puntuacion, 
  pezesCapturados 
}) => {
  // Calcular experiencia requerida para el siguiente nivel
  const experienciaRequerida = calcularExperienciaRequerida(nivel);
  const porcentajeProgreso = (experiencia / experienciaRequerida) * 100;

  // Formatear números grandes para mejor legibilidad
  const formatearNumero = (numero) => {
    if (numero == null) return '0';
    if (numero >= 1000000) {
      return (numero / 1000000).toFixed(1) + 'M';
    } else if (numero >= 1000) {
      return (numero / 1000).toFixed(1) + 'K';
    }
    return Number(numero).toLocaleString();
  };

  // Determinar el color del nivel basado en el progreso
  const obtenerColorNivel = (nivelActual) => {
    if (nivelActual >= 50) return '#FF6B35'; // Naranja legendario
    if (nivelActual >= 25) return '#9B59B6'; // Púrpura épico
    if (nivelActual >= 10) return '#3498DB'; // Azul raro
    return '#2ECC71'; // Verde común
  };

  // Obtener título basado en el nivel
  const obtenerTituloJugador = (nivelActual) => {
    if (nivelActual >= 50) return 'Maestro Pescador';
    if (nivelActual >= 30) return 'Pescador Experto';
    if (nivelActual >= 20) return 'Pescador Avanzado';
    if (nivelActual >= 10) return 'Pescador Hábil';
    if (nivelActual >= 5) return 'Pescador Aficionado';
    return 'Pescador Novato';
  };

  return (
    <div className="estadisticas-jugador">
      {/* Sección de nivel y título */}
      <div className="seccion-nivel">
        <div 
          className="badge-nivel"
          style={{ backgroundColor: obtenerColorNivel(nivel) }}
        >
          <span className="numero-nivel">{nivel}</span>
        </div>
        <div className="info-nivel">
          <div className="titulo-jugador">{obtenerTituloJugador(nivel)}</div>
          <div className="texto-nivel">Nivel {nivel}</div>
        </div>
      </div>

      {/* Barra de experiencia */}
      <div className="seccion-experiencia">
        <div className="etiqueta-experiencia">
          <span>Experiencia</span>
          <span className="numeros-exp">
            {(experiencia ?? 0).toLocaleString()} / {(experienciaRequerida ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="contenedor-barra-exp">
          <div className="barra-experiencia">
            <div 
              className="relleno-experiencia"
              style={{ 
                width: `${Math.min(porcentajeProgreso, 100)}%`,
                background: `linear-gradient(90deg, ${obtenerColorNivel(nivel)}, ${obtenerColorNivel(nivel + 1)})`
              }}
            />
          </div>
          <div className="porcentaje-exp">{Math.round(porcentajeProgreso)}%</div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="seccion-estadisticas">
        <div className="stat-item puntuacion">
          <div className="stat-icono">🏆</div>
          <div className="stat-info">
            <div className="stat-valor">{formatearNumero(puntuacion)}</div>
            <div className="stat-etiqueta">Puntos</div>
          </div>
        </div>

        <div className="stat-item capturas">
          <div className="stat-icono">🐟</div>
          <div className="stat-info">
            <div className="stat-valor">{pezesCapturados}</div>
            <div className="stat-etiqueta">Capturas</div>
          </div>
        </div>

        <div className="stat-item siguiente-nivel">
          <div className="stat-icono">⚡</div>
          <div className="stat-info">
            <div className="stat-valor">{Number.isFinite(experienciaRequerida - experiencia) ? (experienciaRequerida - experiencia) : 0}</div>
            <div className="stat-etiqueta">Para Nivel {nivel + 1}</div>
          </div>
        </div>
      </div>

      {/* Indicador de progreso al siguiente nivel */}
      {porcentajeProgreso >= 90 && (
        <div className="alerta-nivel-cercano">
          <span className="icono-alerta">🌟</span>
          ¡Casi en Nivel {nivel + 1}!
        </div>
      )}
    </div>
  );
};

export default EstadisticasJugador;