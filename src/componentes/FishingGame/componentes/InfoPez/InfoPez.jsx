/**
 * InfoPez.jsx - Modal de información detallada del pez capturado
 * Muestra datos científicos, estadísticas y celebración de captura
 */

import React, { useEffect, useState } from 'react';
import { verificarRecords } from '../../../../herramientas/calculosPesca';
import './InfoPez.css';

/**
 * Componente modal para mostrar información del pez capturado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.pez - Datos del pez capturado
 * @param {Function} props.onCerrar - Función para cerrar el modal
 * @param {boolean} props.mostrarAnimacion - Si mostrar animaciones de celebración
 * @param {Array} props.historialPeces - Historial de peces capturados para verificar récords
 */
const InfoPez = ({ 
  pez, 
  onCerrar, 
  mostrarAnimacion = true,
  historialPeces = []
}) => {
  const [records, setRecords] = useState({});
  const [mostrandoDetalles, setMostrandoDetalles] = useState(false);
  const [animacionCompleta, setAnimacionCompleta] = useState(false);

  // Verificar récords al montar el componente
  useEffect(() => {
    if (pez && historialPeces.length > 0) {
      const recordsObtenidos = verificarRecords(pez, historialPeces);
      setRecords(recordsObtenidos);
    }
  }, [pez, historialPeces]);

  // Mostrar detalles después de la animación inicial
  useEffect(() => {
    if (mostrarAnimacion) {
      const timer = setTimeout(() => {
        setMostrandoDetalles(true);
      }, 800);

      const timer2 = setTimeout(() => {
        setAnimacionCompleta(true);
      }, 1200);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    } else {
      setMostrandoDetalles(true);
      setAnimacionCompleta(true);
    }
  }, [mostrarAnimacion]);

  if (!pez) return null;

  // Obtener color de rareza
  const obtenerColorRareza = (rareza) => {
    const colores = {
      común: '#90EE90',
      raro: '#87CEEB',
      épico: '#DDA0DD',
      legendario: '#FFD700'
    };
    return colores[rareza] || '#FFFFFF';
  };

  // Obtener icono de rareza
  const obtenerIconoRareza = (rareza) => {
    const iconos = {
      común: '🐟',
      raro: '🐠',
      épico: '🦈',
      legendario: '🐲'
    };
    return iconos[rareza] || '🐟';
  };

  // Obtener mensaje de celebración
  const obtenerMensajeCelebracion = () => {
    if (records.primerEspecie) return '¡Primera captura de esta especie!';
    if (records.mayorPeso) return '¡Nuevo récord de peso!';
    if (records.mayorLongitud) return '¡Nuevo récord de longitud!';
    if (records.menorTiempoLucha) return '¡Récord de velocidad de captura!';
    if (pez.rareza === 'legendario') return '¡Captura legendaria increíble!';
    if (pez.rareza === 'épico') return '¡Excelente captura épica!';
    return '¡Fantástica captura!';
  };

  return (
    <div className="modal-info-pez">
      <div className="overlay-modal" onClick={onCerrar} />
      
      <div className={`contenido-modal ${animacionCompleta ? 'completado' : ''}`}>
        
        {/* Animación de celebración inicial */}
        {mostrarAnimacion && !animacionCompleta && (
          <div className="animacion-celebracion">
            <div className="explosion-confeti">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i}
                  className="particula-confeti"
                  style={{
                    '--angulo': `${i * 30}deg`,
                    '--color': `hsl(${i * 30}, 70%, 60%)`
                  }}
                />
              ))}
            </div>
            <div className="texto-celebracion">
              <h1>¡CAPTURADO!</h1>
              <div className="icono-pez-grande">
                {obtenerIconoRareza(pez.rareza)}
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal del modal */}
        {mostrandoDetalles && (
          <div className="info-principal">
            
            {/* Header con nombre y rareza */}
            <div className="header-pez">
              <div className="nombre-container">
                <h2 className="nombre-pez">{pez.nombre}</h2>
                <div 
                  className="badge-rareza"
                  style={{ backgroundColor: obtenerColorRareza(pez.rareza) }}
                >
                  <span className="icono-rareza">{obtenerIconoRareza(pez.rareza)}</span>
                  <span className="texto-rareza">{pez.rareza.toUpperCase()}</span>
                </div>
              </div>
              <div className="nombre-cientifico">{pez.nombreCientifico}</div>
              <div className="familia-pez">Familia: {pez.familia}</div>
            </div>

            {/* Imagen del pez */}
            <div className="contenedor-imagen-pez">
              <div 
                className="imagen-pez-capturado"
                style={{ 
                  backgroundImage: `url(${pez.imagen})`,
                  borderColor: obtenerColorRareza(pez.rareza)
                }}
              >
                {!pez.imagen && (
                  <div 
                    className="pez-placeholder"
                    style={{ backgroundColor: pez.color }}
                  >
                    {obtenerIconoRareza(pez.rareza)}
                  </div>
                )}
                
                {/* Efectos visuales */}
                <div className="brillo-captura" />
                <div className="ondas-captura">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div 
                      key={i}
                      className="onda"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Mensaje de celebración */}
              <div className="mensaje-celebracion">
                {obtenerMensajeCelebracion()}
              </div>
            </div>

            {/* Estadísticas del pez */}
            <div className="estadisticas-pez">
              <div className="grid-estadisticas">
                
                <div className="stat-card peso">
                  <div className="stat-icono">⚖️</div>
                  <div className="stat-contenido">
                    <div className="stat-valor">{pez.pesoActual} kg</div>
                    <div className="stat-etiqueta">Peso</div>
                    <div className="stat-rango">({pez.peso.minimo} - {pez.peso.maximo} kg)</div>
                  </div>
                  {records.mayorPeso && <div className="badge-record">¡RÉCORD!</div>}
                </div>

                <div className="stat-card longitud">
                  <div className="stat-icono">📏</div>
                  <div className="stat-contenido">
                    <div className="stat-valor">{pez.longitudActual} cm</div>
                    <div className="stat-etiqueta">Longitud</div>
                    <div className="stat-rango">({pez.longitud.minimo} - {pez.longitud.maximo} cm)</div>
                  </div>
                  {records.mayorLongitud && <div className="badge-record">¡RÉCORD!</div>}
                </div>

                <div className="stat-card dificultad">
                  <div className="stat-icono">💪</div>
                  <div className="stat-contenido">
                    <div className="stat-valor">{pez.dificultad}/10</div>
                    <div className="stat-etiqueta">Dificultad</div>
                    <div className="stat-rango">Resistencia</div>
                  </div>
                </div>

                <div className="stat-card puntos">
                  <div className="stat-icono">🏆</div>
                  <div className="stat-contenido">
                    <div className="stat-valor">{pez.puntosObtenidos}</div>
                    <div className="stat-etiqueta">Puntos</div>
                    <div className="stat-rango">Obtenidos</div>
                  </div>
                </div>

                {pez.tiempoLucha && (
                  <div className="stat-card tiempo">
                    <div className="stat-icono">⏱️</div>
                    <div className="stat-contenido">
                      <div className="stat-valor">{pez.tiempoLucha.toFixed(1)}s</div>
                      <div className="stat-etiqueta">Tiempo de Lucha</div>
                      <div className="stat-rango">Duración</div>
                    </div>
                    {records.menorTiempoLucha && <div className="badge-record">¡RÉCORD!</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Información del hábitat */}
            <div className="info-habitat">
              <h3>Información del Hábitat</h3>
              <div className="habitat-grid">
                <div className="habitat-item">
                  <span className="habitat-icono">🌊</span>
                  <div className="habitat-contenido">
                    <div className="habitat-titulo">Ubicación</div>
                    <div className="habitat-descripcion">{pez.habitat}</div>
                  </div>
                </div>
                
                <div className="habitat-item">
                  <span className="habitat-icono">📅</span>
                  <div className="habitat-contenido">
                    <div className="habitat-titulo">Mejor Época</div>
                    <div className="habitat-descripcion">{pez.temporadaOptima}</div>
                  </div>
                </div>
                
                <div className="habitat-item">
                  <span className="habitat-icono">📊</span>
                  <div className="habitat-contenido">
                    <div className="habitat-titulo">Estado</div>
                    <div className="habitat-descripcion">{pez.estadoConservacion}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción del pez */}
            <div className="descripcion-pez">
              <h3>Acerca de esta Especie</h3>
              <p>{pez.descripcion}</p>
            </div>

            {/* Botones de acción */}
            <div className="acciones-modal">
              <button 
                className="boton-compartir"
                onClick={() => {
                  // Implementar funcionalidad de compartir
                  console.log('Compartir captura:', pez);
                }}
              >
                <span className="icono-boton">📸</span>
                Compartir Captura
              </button>
              
              <button 
                className="boton-continuar"
                onClick={onCerrar}
              >
                <span className="icono-boton">🎣</span>
                Continuar Pescando
              </button>
            </div>
          </div>
        )}

        {/* Botón de cerrar */}
        <button className="boton-cerrar" onClick={onCerrar}>
          <span>✕</span>
        </button>
      </div>
    </div>
  );
};

export default InfoPez;