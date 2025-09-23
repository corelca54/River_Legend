import React from 'react';
import './estadoJugador.css';

const EstadoJugador = ({ estadisticas }) => {
  
  const {
    nivel = 1,
    experiencia = 0,
    experienciaNecesaria = 100,
    pecesCapturados = 0,
    puntosTotales = 0
  } = estadisticas || {};

  const porcentajeExp = (experiencia / experienciaNecesaria) * 100;

  return (
    <div className="panel-estado-jugador">
      <div className="titulo-panel">
        <h2>🎣 Pescador</h2>
      </div>
      
      <div className="stats-principales">
        <div className="stat-item">
          <div className="stat-icono">🏆</div>
          <div className="stat-info">
            <div className="stat-label">Nivel</div>
            <div className="stat-valor">{nivel}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icono">⭐</div>
          <div className="stat-info">
            <div className="stat-label">EXP</div>
            <div className="stat-valor">{experiencia}/{experienciaNecesaria}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icono">🐟</div>
          <div className="stat-info">
            <div className="stat-label">Peces</div>
            <div className="stat-valor">{pecesCapturados}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icono">💰</div>
          <div className="stat-info">
            <div className="stat-label">Puntos</div>
            <div className="stat-valor">{puntosTotales.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="barra-experiencia">
        <div className="exp-label">
          <span>Experiencia</span>
          <span>{Math.round(porcentajeExp)}%</span>
        </div>
        <div className="exp-barra">
          <div 
            className="exp-progreso"
            style={{ width: `${porcentajeExp}%` }}
          />
        </div>
      </div>

      <div className="logros-mini">
        <div className="logro-item">
          <span className="logro-icono">🎯</span>
          <span className="logro-texto">
            {pecesCapturados > 0 ? `${pecesCapturados} capturas` : 'Primer pez'}
          </span>
        </div>
        
        {nivel > 1 && (
          <div className="logro-item">
            <span className="logro-icono">📈</span>
            <span className="logro-texto">Nivel {nivel}</span>
          </div>
        )}
        
        {puntosTotales >= 1000 && (
          <div className="logro-item">
            <span className="logro-icono">💎</span>
            <span className="logro-texto">1K+ puntos</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoJugador;