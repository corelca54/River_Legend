/**
 * AreaPesca.jsx - Componente del área de pesca con caña y señuelo
 * Maneja la visualización de la caña, sedal, señuelo y pez luchando
 */

import React, { useEffect, useState } from 'react';
import { ESTADOS_JUEGO } from '../../../../data/constantesJuego';
import './AreaPesca.css';

/**
 * Componente principal del área de pesca
 * @param {Object} props - Propiedades del componente
 * @param {string} props.estadoJuego - Estado actual del juego
 * @param {Object} props.posicionSenuelo - Posición del señuelo {x, y}
 * @param {number} props.profundidad - Profundidad actual del señuelo
 * @param {Object} props.pezActual - Datos del pez actual (si hay uno)
 * @param {Object} props.animacionPez - Datos de animación del pez
 * @param {number} props.tiempoLucha - Tiempo transcurrido de lucha
 */
const AreaPesca = ({
  estadoJuego,
  posicionSenuelo,
  profundidad,
  pezActual,
  animacionPez,
  tiempoLucha
}) => {
  const [ondulacionAgua, setOndulacionAgua] = useState(0);
  const [burbujas, setBurbujas] = useState([]);
  const [efectoChapuzon, setEfectoChapuzon] = useState(false);

  // Efecto de ondulación del agua
  useEffect(() => {
    const intervaloOndulacion = setInterval(() => {
      setOndulacionAgua(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(intervaloOndulacion);
  }, []);

  // Crear efecto de chapuzón cuando se lanza
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.LANZANDO) {
      setEfectoChapuzon(true);
      setTimeout(() => setEfectoChapuzon(false), 1000);
    }
  }, [estadoJuego]);

  // Generar burbujas aleatorias
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.PESCANDO || estadoJuego === ESTADOS_JUEGO.LUCHANDO) {
      const generarBurbuja = () => {
        const nuevaBurbuja = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: 100,
          tamaño: Math.random() * 8 + 4,
          velocidad: Math.random() * 2 + 1,
          opacidad: Math.random() * 0.7 + 0.3
        };
        
        setBurbujas(prev => [...prev.slice(-10), nuevaBurbuja]);
      };

      const intervaloBurbujas = setInterval(generarBurbuja, 2000);
      return () => clearInterval(intervaloBurbujas);
    }
  }, [estadoJuego]);

  // Animar burbujas hacia arriba
  useEffect(() => {
    const intervaloBurbujas = setInterval(() => {
      setBurbujas(prev => prev
        .map(burbuja => ({
          ...burbuja,
          y: burbuja.y - burbuja.velocidad,
          opacidad: burbuja.opacidad - 0.01
        }))
        .filter(burbuja => burbuja.y > -10 && burbuja.opacidad > 0)
      );
    }, 50);

    return () => clearInterval(intervaloBurbujas);
  }, []);

  // Calcular ángulo de la caña basado en la posición del señuelo
  const calcularAnguloCaná = () => {
    const anguloBase = 15; // Ángulo base de la caña
    const factorProfundidad = profundidad * 0.3;
    return anguloBase + factorProfundidad;
  };

  // Determinar si mostrar el pez
  const mostrarPez = estadoJuego === ESTADOS_JUEGO.LUCHANDO && pezActual;

  return (
    <div className="area-pesca">
      {/* Superficie del agua con ondulación */}
      <div 
        className="superficie-agua"
        style={{
          transform: `translateY(${Math.sin(ondulacionAgua * Math.PI / 180) * 2}px)`
        }}
      >
        {efectoChapuzon && <div className="efecto-chapuzon" />}
      </div>

      {/* Caña de pescar */}
      <div className="contenedor-caña">
        <div 
          className="caña-pescar"
          style={{
            transform: `rotate(${calcularAnguloCaná()}deg)`,
            transformOrigin: 'bottom left'
          }}
        >
          {/* Mango de la caña */}
          <div className="mango-caña" />
          
          {/* Cuerpo de la caña */}
          <div className="cuerpo-caña" />
          
          {/* Punta de la caña */}
          <div className="punta-caña" />
        </div>

        {/* Carrete */}
        <div 
          className={`carrete ${estadoJuego === ESTADOS_JUEGO.LANZANDO ? 'girando' : ''}`}
        />
      </div>

      {/* Sedal y señuelo */}
      <div className="contenedor-sedal">
        <svg 
          className="sedal-svg"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Línea del sedal con curvatura natural */}
          <path
            d={`M 15 10 Q ${posicionSenuelo.x * 0.7} ${posicionSenuelo.y * 0.5} ${posicionSenuelo.x} ${posicionSenuelo.y}`}
            stroke="#E6E6FA"
            strokeWidth="0.3"
            fill="none"
            className={`linea-sedal ${estadoJuego === ESTADOS_JUEGO.LUCHANDO ? 'tension' : ''}`}
          />
        </svg>

        {/* Señuelo */}
        <div 
          className={`señuelo ${estadoJuego === ESTADOS_JUEGO.LANZANDO ? 'cayendo' : ''} ${estadoJuego === ESTADOS_JUEGO.LUCHANDO ? 'luchando' : ''}`}
          style={{
            left: `${posicionSenuelo.x}%`,
            top: `${posicionSenuelo.y}%`,
            transform: `translate(-50%, -50%) rotate(${animacionPez.rotacion}deg) scale(${animacionPez.escala})`
          }}
        >
          {/* Anzuelo */}
          <div className="anzuelo" />
          
          {/* Carnada */}
          <div className="carnada" />
          
          {/* Brillo del señuelo */}
          <div className="brillo-señuelo" />
        </div>

        {/* Pez luchando con físicas realistas */}
        {mostrarPez && (
          <div 
            className="pez-luchando-realista"
            style={{
              left: `${posicionSenuelo.x}%`,
              top: `${posicionSenuelo.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {/* Sedal tenso desde el anzuelo hasta el pez */}
            <svg className="sedal-tenso" viewBox="0 0 100 100" style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '50px',
              zIndex: 10
            }}>
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="100"
                stroke="#E6E6FA"
                strokeWidth="3"
                className="linea-sedal-tension"
              />
            </svg>

            {/* Pez con movimiento realista */}
            <div 
              className="contenedor-pez-realista"
              style={{
                transform: `rotate(${animacionPez.rotacion}deg) scale(${animacionPez.escala})`,
                animation: `luchaPezRealista 0.6s infinite alternate, saltosPez 2s infinite`
              }}
            >
              <img 
                src={pezActual.imagen}
                alt={pezActual.nombre}
                className="imagen-pez-luchando"
                style={{
                  width: `${Math.max(100, Math.min(pezActual.longitudActual * 2.5, 180))}px`,
                  height: 'auto',
                }}
                onLoad={(e) => {
                  console.log('Imagen del pez cargada exitosamente:', pezActual.imagen);
                  e.target.style.display = 'block';
                }}
                onError={(e) => {
                  console.error('ERROR: No se pudo cargar la imagen:', pezActual.imagen);
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.pez-emoji-fallback').style.display = 'block';
                }}
              />
              
              {/* Fallback más realista */}
              <div 
                className="pez-emoji-fallback"
                style={{ 
                  display: 'none',
                  fontSize: `${Math.max(3, Math.min(pezActual.longitudActual / 15, 6))}rem`,
                  color: pezActual.color,
                }}
              >
                🐠
              </div>

              {/* Salpicaduras de agua alrededor del pez */}
              <div className="salpicaduras-agua">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="gota-agua"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      '--angulo': `${i * 45}deg`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Ondas en el agua donde lucha el pez */}
            <div className="ondas-lucha">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i}
                  className="onda-agua"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Burbujas del agua */}
      <div className="contenedor-burbujas">
        {burbujas.map(burbuja => (
          <div
            key={burbuja.id}
            className="burbuja"
            style={{
              left: `${burbuja.x}%`,
              bottom: `${burbuja.y}%`,
              width: `${burbuja.tamaño}px`,
              height: `${burbuja.tamaño}px`,
              opacity: burbuja.opacidad,
              animationDuration: `${3 / burbuja.velocidad}s`
            }}
          />
        ))}
      </div>

      {/* Indicadores de profundidad - ocultos por defecto */}
      <div className="indicadores-profundidad" style={{ display: 'none' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i}
            className={`marca-profundidad ${profundidad >= (i + 1) * 10 ? 'activa' : ''}`}
            style={{ top: `${(i + 1) * 8 + 20}%` }}
          >
            <span className="numero-profundidad">{(i + 1) * 10}m</span>
          </div>
        ))}
      </div>

      {/* Peces nadando de fondo (decorativos) */}
      <div className="peces-decorativos">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="pez-decorativo"
            style={{
              '--delay': `${i * 2}s`,
              '--velocidad': `${15 + Math.random() * 10}s`,
              '--profundidad': `${40 + i * 20}%`,
              '--tamaño': `${0.5 + Math.random() * 0.5}`
            }}
          >
            🐟
          </div>
        ))}
      </div>
      <div className="efectos-ambientales">
        {/* Rayos de sol en el agua */}
        <div className="rayos-sol">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i}
              className="rayo-sol"
              style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Partículas flotantes en el agua */}
        <div className="particulas-agua">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="particula-agua"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Estados visuales del juego */}
      {estadoJuego === ESTADOS_JUEGO.ESPERANDO && (
        <div className="mensaje-estado-area">
          <div className="icono-espera">🎣</div>
          <div className="texto-espera">Presiona "Lanzar" para comenzar</div>
        </div>
      )}

      {estadoJuego === ESTADOS_JUEGO.PESCANDO && (
        <div className="indicador-pescando">
          <div className="ondas-sonar">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="onda-sonar"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaPesca;