import React, { useEffect, useState } from 'react';
import './InfoPez.css';

const InfoPez = ({ pez, visible, onCerrar }) => {
  const [mostrarConfetti, setMostrarConfetti] = useState(false);

  useEffect(() => {
    if (visible && pez) {
      setMostrarConfetti(true);
      const timer = setTimeout(() => {
        setMostrarConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, pez]);

  if (!visible || !pez) return null;

  const obtenerColorRareza = (rareza) => {
    switch (rareza) {
      case 'común': return '#90EE90';
      case 'raro': return '#87CEEB';
      case 'épico': return '#DDA0DD';
      case 'legendario': return '#FFD700';
      default: return '#FFFFFF';
    }
  };

  const calcularPuntos = () => {
    return pez.puntos || 0;
  };

  return (
    <>
      {/* Confetti de celebración */}
      {mostrarConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
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
      )}

      <div className="info-pez-overlay" onClick={onCerrar}>
        <div className="info-pez-modal" onClick={e => e.stopPropagation()}>
          
          {/* Header del modal */}
          <div className="modal-header">
            <div className="celebracion-badge">🎉 ¡PEZ CAPTURADO! 🎉</div>
            <button className="cerrar-modal" onClick={onCerrar}>✕</button>
          </div>

          {/* Imagen del pez */}
          <div className="pez-imagen-container">
            <div className="imagen-marco" style={{ borderColor: obtenerColorRareza(pez.rareza) }}>
              <div 
                className="pez-icono-grande"
                style={{ backgroundColor: pez.color || '#C0C0C0' }}
              >
                🐟
              </div>
            </div>

            {/* Badge de rareza */}
            <div 
              className="rareza-badge"
              style={{ 
                backgroundColor: obtenerColorRareza(pez.rareza),
                color: pez.rareza === 'común' ? '#006400' : '#000'
              }}
            >
              {pez.rareza.toUpperCase()}
            </div>
          </div>

          {/* Información principal del pez */}
          <div className="pez-info-principal">
            <h2 className="nombre-pez">{pez.nombre}</h2>
            <p className="nombre-cientifico">{pez.nombreCientifico}</p>
            
            {/* Estadísticas principales */}
            <div className="stats-principales">
              <div className="stat-item-grande">
                <span className="valor-grande">{pez.peso} kg</span>
                <span className="label-stat">Peso</span>
              </div>
              <div className="stat-item-grande">
                <span className="valor-grande">{pez.longitud} cm</span>
                <span className="label-stat">Longitud</span>
              </div>
              <div className="stat-item-grande">
                <span className="valor-grande puntos-valor">{calcularPuntos()}</span>
                <span className="label-stat">Puntos</span>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="info-detallada">
            <div className="seccion-info">
              <h3>📍 Información Biológica</h3>
              <div className="grid-info">
                <div className="info-item">
                  <span className="label-info">Hábitat:</span>
                  <span className="valor-info">{pez.habitat}</span>
                </div>
                <div className="info-item">
                  <span className="label-info">Dificultad:</span>
                  <span className="valor-info">
                    {'⭐'.repeat(Math.min(pez.dificultad, 5))} ({pez.dificultad}/10)
                  </span>
                </div>
              </div>
            </div>

            <div className="descripcion-seccion">
              <h3>📝 Descripción</h3>
              <p className="descripcion-texto">{pez.descripcion}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="acciones-modal">
            <button 
              className="boton-continuar"
              onClick={onCerrar}
            >
              🎣 Continuar Pescando
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPez;