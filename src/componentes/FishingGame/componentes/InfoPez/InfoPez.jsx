import React, { useState, useEffect } from 'react';
import { COLORES_RAREZA } from '../../../../data/datosPeces';
import './InfoPez.css';

const InfoPez = ({ pez, visible, onCerrar }) => {
  const [imagenCargada, setImagenCargada] = useState(false);
  const [imagenError, setImagenError] = useState(false);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);

  useEffect(() => {
    if (visible && pez) {
      setImagenCargada(false);
      setImagenError(false);
      setMostrarConfetti(true);
      
      // Ocultar confetti después de 3 segundos
      const timer = setTimeout(() => {
        setMostrarConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, pez]);

  const handleImagenCarga = () => {
    setImagenCargada(true);
    setImagenError(false);
  };

  const handleImagenError = () => {
    setImagenError(true);
    setImagenCargada(false);
  };

  const obtenerRutaImagen = () => {
    if (!pez) return '';
    
    // Intentar imagen principal primero
    if (!imagenError) {
      return pez.imagen;
    }
    
    // Fallback a imagen alternativa
    return pez.imagenAlternativa || pez.imagen;
  };

  const calcularPuntosCaptura = () => {
    if (!pez) return 0;
    const multiplicadorTamaño = pez.multiplicadorTamaño || 1;
    const bonusRareza = {
      común: 1,
      raro: 1.5,
      épico: 2,
      legendario: 3
    };
    
    return Math.floor(pez.puntos * multiplicadorTamaño * bonusRareza[pez.rareza]);
  };

  const obtenerClasificacionTamaño = () => {
    if (!pez) return 'Normal';
    
    const porcentajeTamaño = (pez.peso - pez.pesoMin) / (pez.pesoMax - pez.pesoMin);
    
    if (porcentajeTamaño >= 0.9) return 'Trofeo';
    if (porcentajeTamaño >= 0.7) return 'Grande';
    if (porcentajeTamaño >= 0.4) return 'Normal';
    return 'Pequeño';
  };

  if (!visible || !pez) return null;

  const coloresRareza = COLORES_RAREZA[pez.rareza];
  const clasificacionTamaño = obtenerClasificacionTamaño();
  const puntosCaptura = calcularPuntosCaptura();

  return (
    <>
      {/* Confetti para celebración */}
      {mostrarConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4FC3F7', '#81C784', '#FFB74D'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="info-pez-overlay" onClick={onCerrar}>
        <div className="info-pez-modal" onClick={e => e.stopPropagation()}>
          
          {/* Header del modal */}
          <div className="modal-header" style={{ borderBottomColor: coloresRareza.border }}>
            <div className="celebracion-badge">🎉 ¡PEZ CAPTURADO! 🎉</div>
            <button className="cerrar-modal" onClick={onCerrar}>✕</button>
          </div>

          {/* Imagen del pez */}
          <div className="pez-imagen-container">
            <div className="imagen-marco" style={{ borderColor: coloresRareza.border }}>
              {!imagenError ? (
                <img
                                  src={obtenerRutaImagen()}
                                  alt={pez.nombre}
                                  className={`pez-imagen ${imagenCargada ? 'cargada' : ''}`}
                                  onLoad={handleImagenCarga}
                                  onError={handleImagenError}
                                />
                              ) : (
                                <div className="imagen-error">Imagen no disponible</div>
                              )}
                            </div>
                          </div>
                
                          {/* Información del pez */}
                          <div className="pez-info">
                            <h2 style={{ color: coloresRareza.texto }}>{pez.nombre}</h2>
                            <div className="rareza-badge" style={{ backgroundColor: coloresRareza.fondo, color: coloresRareza.texto }}>
                              {pez.rareza}
                            </div>
                            <div className="clasificacion-tamano">{clasificacionTamaño}</div>
                            <div className="puntos-captura">Puntos: {puntosCaptura}</div>
                            <div className="peso-pez">
                              Peso: {pez.peso} kg
                              <span className="rango-peso">
                                ({pez.pesoMin} - {pez.pesoMax} kg)
                              </span>
                            </div>
                                            <div className="descripcion-pez">{pez.descripcion}</div>
                                          </div>
                                        </div>
                                      </div>
                    </>
                                    );
                  }

export default InfoPez;