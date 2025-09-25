/**
 * ModalCapturaPez.jsx - Modal de captura estilo Fishing Clash
 * Muestra el pez capturado con animaciones y estadísticas completas
 */

import React, { useEffect, useState } from 'react';
import './ModalCapturaPez.css';
import InfoPez from '../InfoPez/InfoPez';

const ModalCaptura = ({ pez, visible, onCerrar, estadisticas }) => {
  return (
    <InfoPez 
      pez={pez}
      visible={visible}
      onCerrar={onCerrar}
    />
  );
};

const ModalCapturaPez = ({ 
  pezCapturado, 
  visible, 
  onCerrar,
  esNuevoRecord = false,
  puntosGanados = 0,
  experienciaGanada = 0
}) => {
  const [animacionCompleta, setAnimacionCompleta] = useState(false);
  const [mostrandoEstadisticas, setMostrandoEstadisticas] = useState(false);
  const [rotacionPez, setRotacionPez] = useState(0);

  useEffect(() => {
    if (visible && pezCapturado) {
      // Secuencia de animaciones
      setTimeout(() => setAnimacionCompleta(true), 500);
      setTimeout(() => setMostrandoEstadisticas(true), 1000);
      
      // Rotación continua del pez
      const intervalo = setInterval(() => {
        setRotacionPez(prev => (prev + 2) % 360);
      }, 50);
      
      return () => clearInterval(intervalo);
    }
  }, [visible, pezCapturado]);

  if (!visible || !pezCapturado) return null;

  // Obtener color según rareza
  const obtenerColorRareza = (rareza) => {
    const colores = {
      común: '#90EE90',
      raro: '#87CEEB', 
      épico: '#DDA0DD',
      legendario: '#FFD700'
    };
    return colores[rareza] || '#90EE90';
  };

  // Obtener imagen del pez
  const obtenerImagenPez = () => {
    const rutasImagenes = {
      bocachico: '/assets/imagenes/peces/Bocachico.png',
  // arapaima: '/assets/imagenes/peces/Arapaima.png',
  bagre_rayado: '/assets/imagenes/peces/Bagre_rayado.png',
  sabalo: '/assets/imagenes/peces/Sabalo.png',
      sabaleta: '/assets/imagenes/peces/Sabaleta.png',
      nicuro: '/assets/imagenes/peces/dorado.png',
      corroncho: '/assets/imagenes/peces/Bocachico.png',
      azulejo: '/assets/imagenes/peces/perca.png',
      pavon: '/assets/imagenes/peces/Pavón.png',
      mojarra: '/assets/imagenes/peces/trucha_mariposa.png'
    };
    
    return rutasImagenes[pezCapturado.id] || '/assets/imagenes/peces/Bocachico.png';
  };

  return (
    <div className="modal-captura-overlay">
      <div className="modal-captura-container">
        
        {/* Header con celebración */}
        <div className="header-captura">
          <div className="explosion-fuegos">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="fuego-artificial"
                style={{
                  '--angulo': `${i * 45}deg`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          {esNuevoRecord && (
            <div className="badge-nuevo-record">
              <div className="icono-record">🏆</div>
              <div className="texto-record">¡NUEVO RÉCORD!</div>
            </div>
          )}
          
          <div className="titulo-captura">
            <h1>¡CAPTURADO!</h1>
            <div className="subtitulo-captura">{pezCapturado.nombre}</div>
          </div>
        </div>

        {/* Área principal del pez */}
        <div className="area-pez-principal">
          
          {/* Pez 3D rotando */}
          <div className="contenedor-pez-3d">
            <div 
              className="pez-rotando"
              style={{
                transform: `rotateY(${rotacionPez}deg) rotateX(10deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img 
                src={obtenerImagenPez()}
                alt={pezCapturado.nombre}
                className="imagen-pez-modal"
                style={{
                  border: `4px solid ${obtenerColorRareza(pezCapturado.rareza)}`,
                  boxShadow: `0 0 30px ${obtenerColorRareza(pezCapturado.rareza)}80`
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.pez-emoji-3d').style.display = 'block';
                }}
              />
              
              {/* Fallback emoji 3D */}
              <div 
                className="pez-emoji-3d"
                style={{ 
                  display: 'none',
                  fontSize: '6rem',
                  filter: `drop-shadow(0 0 20px ${obtenerColorRareza(pezCapturado.rareza)})`
                }}
              >
                🐠
              </div>
            </div>
            
            {/* Anzuelo colgando */}
            <div className="anzuelo-colgante">
              <div className="sedal-modal"></div>
              <div className="anzuelo-dorado"></div>
            </div>
            
            {/* Efectos de partículas */}
            <div className="particulas-celebracion">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i}
                  className="particula-oro"
                  style={{
                    '--direccion': `${i * 30}deg`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Badge de rareza */}
          <div 
            className="badge-rareza-grande"
            style={{ 
              backgroundColor: obtenerColorRareza(pezCapturado.rareza),
              color: pezCapturado.rareza === 'común' ? '#2F4F4F' : '#FFFFFF'
            }}
          >
            <div className="texto-rareza-grande">{pezCapturado.rareza.toUpperCase()}</div>
            <div className="estrellas-rareza">
              {Array.from({ length: pezCapturado.rareza === 'común' ? 1 : 
                                    pezCapturado.rareza === 'raro' ? 2 :
                                    pezCapturado.rareza === 'épico' ? 3 : 4 
              }).map((_, i) => (
                <span key={i} className="estrella-rareza">★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas del pez */}
        {mostrandoEstadisticas && (
          <div className="estadisticas-captura">
            
            {/* Estadísticas principales */}
            <div className="stats-principales">
              <div className="stat-box peso">
                <div className="stat-icono">⚖️</div>
                <div className="stat-valor">{pezCapturado.pesoActual} kg</div>
                <div className="stat-etiqueta">Peso</div>
              </div>
              
              <div className="stat-box longitud">
                <div className="stat-icono">📏</div>
                <div className="stat-valor">{pezCapturado.longitudActual} cm</div>
                <div className="stat-etiqueta">Longitud</div>
              </div>
              
              <div className="stat-box puntos">
                <div className="stat-icono">🏆</div>
                <div className="stat-valor">{puntosGanados}</div>
                <div className="stat-etiqueta">Puntos</div>
              </div>
              
              <div className="stat-box experiencia">
                <div className="stat-icono">⚡</div>
                <div className="stat-valor">+{experienciaGanada}</div>
                <div className="stat-etiqueta">EXP</div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="info-adicional">
              <div className="info-habitat">
                <div className="info-titulo">
                  <span className="icono-info">🌊</span>
                  Hábitat Natural
                </div>
                <div className="info-contenido">{pezCapturado.habitat}</div>
              </div>
              
              <div className="info-descripcion">
                <div className="info-titulo">
                  <span className="icono-info">📖</span>
                  Descripción
                </div>
                <div className="info-contenido">{pezCapturado.descripcion}</div>
              </div>
              
              <div className="info-cientifico">
                <div className="info-titulo">
                  <span className="icono-info">🔬</span>
                  Nombre Científico
                </div>
                <div className="info-contenido info-cientifico-texto">
                  {pezCapturado.nombreCientifico}
                </div>
              </div>
            </div>

            {/* Comparación con récords */}
            <div className="comparacion-records">
              <div className="record-item">
                <span className="record-etiqueta">Peso promedio:</span>
                <span className="record-valor">
                  {((pezCapturado.peso.minimo + pezCapturado.peso.maximo) / 2).toFixed(1)} kg
                </span>
              </div>
              <div className="record-item">
                <span className="record-etiqueta">Longitud promedio:</span>
                <span className="record-valor">
                  {Math.round((pezCapturado.longitud.minimo + pezCapturado.longitud.maximo) / 2)} cm
                </span>
              </div>
              <div className="record-item">
                <span className="record-etiqueta">Dificultad:</span>
                <span className="record-valor">{pezCapturado.dificultad}/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="acciones-captura">
          <button 
            className="boton-compartir"
            onClick={() => {
              // Implementar compartir
              console.log('Compartir captura');
            }}
          >
            <span className="icono-boton">📸</span>
            Compartir
          </button>
          
          <button 
            className="boton-continuar"
            onClick={onCerrar}
          >
            <span className="icono-boton">🎣</span>
            Continuar Pescando
          </button>
          
          <button 
            className="boton-coleccion"
            onClick={() => {
              // Implementar ver colección
              console.log('Ver colección');
            }}
          >
            <span className="icono-boton">📚</span>
            Ver Colección
          </button>
        </div>

        {/* Botón cerrar */}
        <button className="boton-cerrar-modal" onClick={onCerrar}>
          <span>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ModalCapturaPez;