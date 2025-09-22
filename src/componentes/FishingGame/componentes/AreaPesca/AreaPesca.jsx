/**
 * AreaPesca.jsx - VERSIÓN MEJORADA con pez realista
 * Muestra el pez colgando del anzuelo, girando y moviéndose de forma realista
 */

import React, { useEffect, useState, useRef } from 'react';
import { ESTADOS_JUEGO } from '../../../../data/constantesJuego';
import './AreaPesca.css';

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
  const [rotacionPez, setRotacionPez] = useState(0);
  const [balanceoPez, setBalanceoPez] = useState(0);
  const [escalaPez, setEscalaPez] = useState(1);
  const [mordidaVisible, setMordidaVisible] = useState(false);
  
  const intervalosRef = useRef([]);

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      intervalosRef.current.forEach(clearInterval);
    };
  }, []);

  // Efecto de ondulación del agua
  useEffect(() => {
    const intervalo = setInterval(() => {
      setOndulacionAgua(prev => (prev + 1) % 360);
    }, 100);
    intervalosRef.current.push(intervalo);

    return () => clearInterval(intervalo);
  }, []);

  // Animación del pez cuando está luchando
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.LUCHANDO && pezActual) {
      // Mostrar mordida del anzuelo
      setMordidaVisible(true);
      
      const intervaloLucha = setInterval(() => {
        // Movimiento errático durante la lucha
        setRotacionPez(prev => prev + (Math.random() - 0.5) * 30);
        setBalanceoPez(Math.sin(Date.now() / 200) * 15);
        setEscalaPez(1 + Math.sin(Date.now() / 300) * 0.2);
      }, 100);
      
      intervalosRef.current.push(intervaloLucha);
      
      return () => clearInterval(intervaloLucha);
    } else {
      setMordidaVisible(false);
    }
  }, [estadoJuego, pezActual]);

  // Animación del pez capturado (colgando)
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.CAPTURADO && pezActual) {
      let anguloBalanceo = 0;
      let velocidadRotacion = 0;
      
      const intervaloCapturado = setInterval(() => {
        // Física de péndulo para el balanceo
        anguloBalanceo += 0.1;
        const balanceo = Math.sin(anguloBalanceo) * 20;
        setBalanceoPez(balanceo);
        
        // Rotación continua para mostrar el pez completo
        velocidadRotacion += 2;
        setRotacionPez(velocidadRotacion);
        
        // Escala que "respira"
        setEscalaPez(1 + Math.sin(anguloBalanceo * 2) * 0.1);
      }, 50);
      
      intervalosRef.current.push(intervaloCapturado);
      
      return () => clearInterval(intervaloCapturado);
    }
  }, [estadoJuego, pezActual]);

  // Crear efecto de chapuzón cuando se lanza
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.LANZANDO) {
      setEfectoChapuzon(true);
      setTimeout(() => setEfectoChapuzon(false), 1000);
    }
  }, [estadoJuego]);

  // Generar burbujas durante la pesca y lucha
  useEffect(() => {
    if (estadoJuego === ESTADOS_JUEGO.PESCANDO || estadoJuego === ESTADOS_JUEGO.LUCHANDO) {
      const generarBurbuja = () => {
        const nuevaBurbuja = {
          id: Date.now() + Math.random(),
          x: posicionSenuelo.x + (Math.random() - 0.5) * 30,
          y: 100,
          tamaño: Math.random() * 8 + 4,
          velocidad: Math.random() * 2 + 1,
          opacidad: Math.random() * 0.7 + 0.3
        };
        
        setBurbujas(prev => [...prev.slice(-15), nuevaBurbuja]);
      };

      const intervaloBurbujas = setInterval(generarBurbuja, 
        estadoJuego === ESTADOS_JUEGO.LUCHANDO ? 500 : 2000
      );
      intervalosRef.current.push(intervaloBurbujas);
      
      return () => clearInterval(intervaloBurbujas);
    }
  }, [estadoJuego, posicionSenuelo.x]);

  // Animar burbujas hacia arriba
  useEffect(() => {
    const intervalo = setInterval(() => {
      setBurbujas(prev => prev
        .map(burbuja => ({
          ...burbuja,
          y: burbuja.y - burbuja.velocidad,
          opacidad: burbuja.opacidad - 0.01
        }))
        .filter(burbuja => burbuja.y > -10 && burbuja.opacidad > 0)
      );
    }, 50);
    
    intervalosRef.current.push(intervalo);
    return () => clearInterval(intervalo);
  }, []);

  // Calcular ángulo de la caña
  const calcularAnguloCaná = () => {
    const anguloBase = 15;
    const factorProfundidad = profundidad * 0.3;
    const factorLucha = estadoJuego === ESTADOS_JUEGO.LUCHANDO ? Math.sin(Date.now() / 200) * 5 : 0;
    return anguloBase + factorProfundidad + factorLucha;
  };

  // Obtener la imagen del pez o fallback
  const obtenerImagenPez = () => {
    if (!pezActual) return null;
    
    // Rutas de imágenes mejoradas
    const rutasImagenes = {
      bocachico: '/assets/imagenes/peces/Bocachico.png',
      arapaima: '/assets/imagenes/peces/Arapaima.png',
      bagre: '/assets/imagenes/peces/Bagre_rayado.png',
      sabalo: '/assets/imagenes/peces/Sabalo.png',
      sabaleta: '/assets/imagenes/peces/Sabaleta.png',
      nicuro: '/assets/imagenes/peces/dorado.png',
      corroncho: '/assets/imagenes/peces/Bocachico.png',
      azulejo: '/assets/imagenes/peces/Perca.png',
      pavon: '/assets/imagenes/peces/Pavon.png',
      mojarra: '/assets/imagenes/peces/trucha_mariposa.png'
    };
    
    return rutasImagenes[pezActual.id] || '/assets/imagenes/peces/Bocachico.png';
  };

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
          <div className="mango-caña" />
          <div className="cuerpo-caña" />
          <div className="punta-caña" />
        </div>
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
          <path
            d={`M 15 10 Q ${posicionSenuelo.x * 0.7} ${posicionSenuelo.y * 0.5} ${posicionSenuelo.x} ${posicionSenuelo.y}`}
            stroke="#E6E6FA"
            strokeWidth={estadoJuego === ESTADOS_JUEGO.LUCHANDO ? "0.5" : "0.3"}
            fill="none"
            className={`linea-sedal ${estadoJuego === ESTADOS_JUEGO.LUCHANDO ? 'tension' : ''}`}
          />
        </svg>

        {/* Señuelo con estados mejorados */}
        <div 
          className={`señuelo ${estadoJuego === ESTADOS_JUEGO.LANZANDO ? 'cayendo' : ''} ${estadoJuego === ESTADOS_JUEGO.LUCHANDO ? 'luchando' : ''}`}
          style={{
            left: `${posicionSenuelo.x}%`,
            top: `${posicionSenuelo.y}%`,
            transform: `translate(-50%, -50%) rotate(${animacionPez.rotacion}deg) scale(${animacionPez.escala})`
          }}
        >
          <div className="anzuelo" />
          <div className="carnada" />
          <div className="brillo-señuelo" />
        </div>

        {/* PEZ LUCHANDO - VERSIÓN REALISTA */}
        {estadoJuego === ESTADOS_JUEGO.LUCHANDO && pezActual && (
          <div 
            className="pez-luchando-realista"
            style={{
              left: `${posicionSenuelo.x}%`,
              top: `${posicionSenuelo.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {/* Sedal desde anzuelo hasta pez */}
            <div 
              className="sedal-al-pez"
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '25px',
                background: '#E6E6FA',
                boxShadow: '0 0 5px rgba(230, 230, 250, 0.8)',
                zIndex: 10
              }}
            />

            {/* Pez con movimiento realista */}
            <div 
              className="contenedor-pez-realista"
              style={{
                transform: `rotate(${rotacionPez}deg) scale(${escalaPez}) translateX(${balanceoPez}px)`,
                transformOrigin: 'center top',
                transition: estadoJuego === ESTADOS_JUEGO.CAPTURADO ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              {/* Imagen del pez */}
              <img 
                src={obtenerImagenPez()}
                alt={pezActual.nombre}
                className="imagen-pez-luchando"
                style={{
                  width: `${Math.max(80, Math.min(pezActual.longitudActual * 2, 150))}px`,
                  height: 'auto',
                  filter: `brightness(1.2) contrast(1.1) saturate(1.3) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))`,
                  transform: mordidaVisible ? 'rotateY(10deg)' : 'rotateY(0deg)',
                }}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.pez-emoji-fallback').style.display = 'block';
                }}
              />
              
              {/* Fallback emoji */}
              <div 
                className="pez-emoji-fallback"
                style={{ 
                  display: 'none',
                  fontSize: `${Math.max(2, Math.min(pezActual.longitudActual / 20, 4))}rem`,
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                  animation: 'rebotePez 0.5s infinite alternate'
                }}
              >
                🐠
              </div>

              {/* Indicador de mordida en el anzuelo */}
              {mordidaVisible && (
                <div 
                  className="indicador-mordida"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '30%',
                    width: '8px',
                    height: '8px',
                    background: 'red',
                    borderRadius: '50%',
                    animation: 'parpadearMordida 0.3s infinite',
                    zIndex: 15
                  }}
                />
              )}

              {/* Salpicaduras de agua alrededor del pez */}
              <div className="salpicaduras-agua">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="gota-agua"
                    style={{
                      position: 'absolute',
                      width: '4px',
                      height: '4px',
                      background: 'rgba(173, 216, 230, 0.8)',
                      borderRadius: '50%',
                      animation: `salpicadura 0.8s ease-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      '--angulo': `${i * 60}deg`
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
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${20 + i * 20}px`,
                    height: `${20 + i * 20}px`,
                    border: '2px solid rgba(173, 216, 230, 0.6)',
                    borderRadius: '50%',
                    animation: `expandirOnda 1.5s ease-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* PEZ CAPTURADO - COLGANDO DEL ANZUELO */}
        {estadoJuego === ESTADOS_JUEGO.CAPTURADO && pezActual && (
          <div 
            className="pez-capturado-colgando"
            style={{
              left: `${posicionSenuelo.x}%`,
              top: `${posicionSenuelo.y + 15}%`,
              transform: `translate(-50%, -50%)`,
              zIndex: 20
            }}
          >
            {/* Sedal visible hasta el pez */}
            <div 
              className="sedal-captura"
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '35px',
                background: 'linear-gradient(to bottom, #E6E6FA, #B0C4DE)',
                boxShadow: '0 0 8px rgba(230, 230, 250, 0.9)',
                zIndex: 19
              }}
            />

            {/* Pez colgando con física de péndulo */}
            <div 
              className="pez-colgando"
              style={{
                transform: `rotate(${balanceoPez}deg) rotateY(${rotacionPez}deg) scale(${escalaPez})`,
                transformOrigin: 'center top',
                animation: 'none'
              }}
            >
              {/* Anzuelo visible en la boca del pez */}
              <div 
                className="anzuelo-en-boca"
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '80%',
                  width: '6px',
                  height: '6px',
                  background: '#FFD700',
                  borderRadius: '50%',
                  boxShadow: '0 0 5px #FFA500',
                  zIndex: 21
                }}
              />
              
              {/* Imagen del pez capturado */}
              <img 
                src={obtenerImagenPez()}
                alt={`${pezActual.nombre} capturado`}
                className="imagen-pez-capturado"
                style={{
                  width: `${Math.max(100, Math.min(pezActual.longitudActual * 2.5, 180))}px`,
                  height: 'auto',
                  filter: `brightness(1.3) contrast(1.2) saturate(1.4) drop-shadow(0 0 25px rgba(255, 215, 0, 0.8))`,
                  border: `3px solid ${pezActual.rareza === 'legendario' ? '#FFD700' : pezActual.rareza === 'épico' ? '#DDA0DD' : pezActual.rareza === 'raro' ? '#87CEEB' : '#90EE90'}`,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.pez-emoji-capturado').style.display = 'block';
                }}
              />
              
              {/* Fallback para pez capturado */}
              <div 
                className="pez-emoji-capturado"
                style={{ 
                  display: 'none',
                  fontSize: `${Math.max(3, Math.min(pezActual.longitudActual / 15, 5))}rem`,
                  filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.9))',
                  border: '3px solid #FFD700',
                  borderRadius: '50%',
                  padding: '10px',
                  background: 'rgba(255, 215, 0, 0.2)'
                }}
              >
                🏆🐠
              </div>

              {/* Efectos de celebración */}
              <div className="efectos-celebracion">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i}
                    className="estrella-celebracion"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '8px',
                      height: '8px',
                      background: '#FFD700',
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                      animation: `celebrarEstrella 2s ease-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                      '--direccion': `${i * 45}deg`
                    }}
                  />
                ))}
              </div>
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
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(173, 216, 230, 0.4) 50%, rgba(255, 255, 255, 0.2) 100%)`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              animation: `subirBurbuja ${3 / burbuja.velocidad}s linear infinite`
            }}
          />
        ))}
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
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 215, 0, 0.6)',
                  borderRadius: '50%',
                  animation: `ondaSonar 2s ease-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Efectos ambientales mejorados */}
      <div className="efectos-ambientales">
        <div className="rayos-sol">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="rayo-sol"
              style={{
                position: 'absolute',
                top: 0,
                left: `${25 + i * 25}%`,
                width: '2px',
                height: '100%',
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)`,
                animation: `ondularRayo ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreaPesca;