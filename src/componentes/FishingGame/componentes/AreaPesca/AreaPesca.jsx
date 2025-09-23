import React, { useEffect, useState, useRef } from 'react';
import { PECES_COLOMBIANOS } from '../../../data/datosPeces';
import './AreaPesca.css';

const AreaPesca = ({
  pezActual,
  posicionSedal,
  estadoJuego,
  tension,
  tiempoLucha,
  pezSaliendoDelAgua
}) => {
  const [ondas, setOndas] = useState([]);
  const [burbujas, setBurbujas] = useState([]);
  const [efectoLanzamiento, setEfectoLanzamiento] = useState(false);
  const [pezVisible, setPezVisible] = useState(false);
  const [pecesNadando, setPecesNadando] = useState([]);
  const [pezPicando, setPezPicando] = useState(null);
  const intervalRef = useRef();
  // Generar peces nadando aleatorios durante la pesca
  useEffect(() => {
    if (estadoJuego === 'pescando') {
      // Seleccionar aleatoriamente 3-5 peces de la base
      const pecesArray = Object.values(PECES_COLOMBIANOS);
      const cantidad = 3 + Math.floor(Math.random() * 3);
      const seleccionados = [];
      while (seleccionados.length < cantidad) {
        const idx = Math.floor(Math.random() * pecesArray.length);
        if (!seleccionados.some(p => p.id === pecesArray[idx].id)) {
          seleccionados.push({
            ...pecesArray[idx],
            x: Math.random() * 80 + 10, // posición inicial x
            y: Math.random() * 40 + 40, // posición inicial y
            dir: Math.random() > 0.5 ? 1 : -1, // dirección de nado
            speed: 0.3 + Math.random() * 0.7,
            fase: Math.random() * Math.PI * 2
          });
        }
      }
      setPecesNadando(seleccionados);
      setPezPicando(null);
    } else if (estadoJuego === 'picando' && pecesNadando.length > 0) {
      // Seleccionar uno de los peces nadando para que pique
      const idx = Math.floor(Math.random() * pecesNadando.length);
      setPezPicando({ ...pecesNadando[idx] });
    } else if (estadoJuego !== 'pescando' && estadoJuego !== 'picando') {
      setPecesNadando([]);
      setPezPicando(null);
    }
  }, [estadoJuego]);
  // Animar peces nadando
  useEffect(() => {
    if (estadoJuego === 'pescando' && pecesNadando.length > 0) {
      intervalRef.current = setInterval(() => {
        setPecesNadando(prev => prev.map(pez => {
          let nuevaX = pez.x + pez.dir * pez.speed * (0.7 + Math.sin(Date.now()/500 + pez.fase));
          let nuevaY = pez.y + Math.sin(Date.now()/400 + pez.fase) * 0.7;
          // Rebote en los bordes
          if (nuevaX < 5 || nuevaX > 90) pez.dir *= -1;
          return { ...pez, x: Math.max(5, Math.min(90, nuevaX)), y: Math.max(35, Math.min(80, nuevaY)), dir: pez.dir };
        }));
      }, 60);
      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [estadoJuego, pecesNadando.length]);
  // Animar pez picando hacia el señuelo
  useEffect(() => {
    if (estadoJuego === 'picando' && pezPicando) {
      intervalRef.current = setInterval(() => {
        setPezPicando(prev => {
          if (!prev) return null;
          // Movimiento hacia el señuelo
          const dx = posicionSedal.x - prev.x;
          const dy = posicionSedal.y + 15 - prev.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 5) return { ...prev, x: posicionSedal.x, y: posicionSedal.y + 15 };
          return {
            ...prev,
            x: prev.x + dx * 0.08,
            y: prev.y + dy * 0.08,
            dir: dx > 0 ? 1 : -1
          };
        });
      }, 60);
      return () => clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [estadoJuego, pezPicando, posicionSedal]);

  // Generar ondas en el agua
  useEffect(() => {
    if (estadoJuego === 'lanzando' || estadoJuego === 'luchando') {
      const nuevasOndas = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: posicionSedal.x + (Math.random() - 0.5) * 10,
        y: posicionSedal.y + (Math.random() - 0.5) * 10,
        size: 20 + Math.random() * 30,
        delay: i * 0.3
      }));
      setOndas(nuevasOndas);
    }
  }, [estadoJuego, posicionSedal]);

  // Generar burbujas constantes
  useEffect(() => {
    const interval = setInterval(() => {
      setBurbujas(prev => {
        const nuevasBurbujas = [...prev];
        
        // Agregar nueva burbuja
        if (nuevasBurbujas.length < 12) {
          nuevasBurbujas.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: 100,
            size: 3 + Math.random() * 8,
            velocidad: 0.5 + Math.random() * 1,
            opacidad: 0.3 + Math.random() * 0.4
          });
        }
        
        // Actualizar posición de burbujas existentes
        return nuevasBurbujas
          .map(burbuja => ({
            ...burbuja,
            y: burbuja.y - burbuja.velocidad,
            opacidad: burbuja.opacidad * 0.998
          }))
          .filter(burbuja => burbuja.y > -10 && burbuja.opacidad > 0.1);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Efecto de lanzamiento
  useEffect(() => {
    if (estadoJuego === 'lanzando') {
      setEfectoLanzamiento(true);
      setTimeout(() => setEfectoLanzamiento(false), 1500);
    }
  }, [estadoJuego]);

  // Mostrar pez durante la lucha
  useEffect(() => {
    if (estadoJuego === 'luchando' || estadoJuego === 'picando') {
      setPezVisible(true);
    } else {
      setPezVisible(false);
    }
  }, [estadoJuego]);

  // Obtener clase CSS para el estado del agua
  const getClaseAgua = () => {
    switch (estadoJuego) {
      case 'lanzando':
        return 'agua-activa lanzando';
      case 'luchando':
        return 'agua-activa luchando';
      case 'picando':
        return 'agua-activa picando';
      default:
        return '';
    }
  };

  // Calcular intensidad de la lucha para efectos visuales
  const intensidadLucha = tension > 70 ? 'alta' : tension > 40 ? 'media' : 'baja';

  return (
    <div className="area-pesca">
      {/* Superficie del agua con efectos dinámicos */}
      <div className={`superficie-agua ${getClaseAgua()}`}>
        
        {/* Video de fondo del río */}
        <div className="fondo-rio">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="video-rio"
          >
            <source src="/assets/videos/bucle.mp4" type="video/mp4" />
          </video>
          <div className="overlay-agua"></div>
        </div>

        {/* Ondas expansivas en el agua */}
        {ondas.map(onda => (
          <div
            key={onda.id}
            className="onda-agua"
            style={{
              left: `${onda.x}%`,
              top: `${onda.y}%`,
              width: `${onda.size}px`,
              height: `${onda.size}px`,
              animationDelay: `${onda.delay}s`
            }}
          />
        ))}

        {/* Burbujas del agua */}
        {burbujas.map(burbuja => (
          <div
            key={burbuja.id}
            className="burbuja-agua"
            style={{
              left: `${burbuja.x}%`,
              bottom: `${100 - burbuja.y}%`,
              width: `${burbuja.size}px`,
              height: `${burbuja.size}px`,
              opacity: burbuja.opacidad
            }}
          />
        ))}

        {/* Línea de pesca */}
        <div className="contenedor-linea">
          <div
            className={`linea-pesca ${estadoJuego} tension-${intensidadLucha}`}
            style={{
              transform: `translate(${posicionSedal.x - 50}%, ${posicionSedal.y}%)`
            }}
          >
            <div className="sedal-punta"></div>
          </div>
        </div>

        {/* Señuelo con animación */}
        <div
          className={`senuelo ${efectoLanzamiento ? 'lanzando' : ''} ${estadoJuego}`}
          style={{
            left: `${posicionSedal.x}%`,
            top: `${posicionSedal.y + 15}%`,
            transform: estadoJuego === 'luchando' 
              ? `translate(-50%, -50%) rotate(${Math.sin(tiempoLucha * 5) * 15}deg)` 
              : 'translate(-50%, -50%)'
          }}
        >
          <div className="brillo-senuelo"></div>
        </div>

        {/* Peces nadando aleatorios durante la pesca */}
        {estadoJuego === 'pescando' && pecesNadando.map((pez, idx) => (
          <div
            key={pez.id + idx}
            className={`pez-nadando rareza-${pez.rareza}`}
            style={{
              left: `${pez.x}%`,
              top: `${pez.y}%`,
              transform: `scale(${0.35 + pez.dificultad * 0.07}) scaleX(${pez.dir})`,
              filter: 'blur(0.7px) brightness(0.8)',
              transition: 'left 0.1s linear, top 0.1s linear, transform 0.2s'
            }}
          >
            <img
              src={pez.imagen}
              alt={pez.nombre}
              className="imagen-pez-nadando"
              style={{
                width: '50px',
                height: 'auto',
                opacity: 0.85
              }}
            />
          </div>
        ))}

        {/* Pez que pica y se acerca al señuelo */}
        {estadoJuego === 'picando' && pezPicando && (
          <div
            className={`pez-picando rareza-${pezPicando.rareza}`}
            style={{
              left: `${pezPicando.x}%`,
              top: `${pezPicando.y}%`,
              transform: `scale(${0.4 + pezPicando.dificultad * 0.1}) scaleX(${pezPicando.dir})`,
              filter: 'blur(0.5px) brightness(0.9)',
              transition: 'left 0.1s linear, top 0.1s linear, transform 0.2s'
            }}
          >
            <img
              src={pezPicando.imagen}
              alt={pezPicando.nombre}
              className="imagen-pez-picando"
              style={{
                width: '60px',
                height: 'auto',
                opacity: 0.95
              }}
            />
          </div>
        )}
        
        {/* Pez luchando bajo el agua */}
        {pezVisible && pezActual && (
          <div
            className={`pez-luchando ${estadoJuego} rareza-${pezActual.rareza}`}
            style={{
              left: `${posicionSedal.x + Math.sin(tiempoLucha * 3) * 8}%`,
              top: `${posicionSedal.y + 25 + Math.cos(tiempoLucha * 2) * 5}%`,
              transform: `scale(${0.4 + pezActual.dificultad * 0.1})`,
              filter: 'blur(1px) brightness(0.7)'
            }}
          >
            <img
              src={pezActual.imagen}
              alt={pezActual.nombre}
              className="imagen-pez-lucha"
              style={{
                transform: `scaleX(${Math.sin(tiempoLucha * 2) > 0 ? 1 : -1})`
              }}
            />
            {estadoJuego === 'luchando' && (
              <div className="particulas-lucha">
                {Array.from({ length: tension > 50 ? 6 : 3 }, (_, i) => (
                  <div
                    key={i}
                    className="particula"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      opacity: tension / 100
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pez saltando fuera del agua */}
        {pezSaliendoDelAgua && pezActual && (
          <div className="pez-saltando">
            <div
              className={`pez-capturado rareza-${pezActual.rareza}`}
              style={{
                left: `${posicionSedal.x}%`,
                top: `${posicionSedal.y}%`
              }}
            >
              <img
                src={pezActual.imagen}
                alt={pezActual.nombre}
                className="imagen-pez-salto"
              />
              
              {/* Gotas de agua del salto */}
              <div className="gotas-salto">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="gota"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      left: `${-20 + Math.random() * 40}px`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`
                    }}
                  />
                ))}
              </div>

              {/* Brillo especial por rareza */}
              {(pezActual.rareza === 'épico' || pezActual.rareza === 'legendario') && (
                <div className="efecto-rareza">
                  <div className="particulas-doradas">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="particula-dorada"
                        style={{
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Efecto de chapuzón durante lanzamiento */}
        {efectoLanzamiento && (
          <div
            className="efecto-chapuzon"
            style={{
              left: `${posicionSedal.x}%`,
              top: `${posicionSedal.y + 10}%`
            }}
          >
            <div className="onda-chapuzon"></div>
            <div className="splash-particulas">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="splash-particula"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Indicadores de estado del agua */}
        <div className="indicadores-agua">
          <div className={`indicador-corriente ${estadoJuego}`}>
            <div className="lineas-corriente">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="linea-corriente"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Efectos de profundidad */}
        <div className="efectos-profundidad">
          <div className="gradiente-profundidad"></div>
          <div className="particulas-sedimento">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="particula-sedimento"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Información contextual durante la pesca */}
        {estadoJuego === 'pescando' && (
          <div className="info-esperando">
            <div className="icono-esperando">⏳</div>
            <div className="texto-esperando">Esperando picada...</div>
            <div className="ondas-sonar">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="onda-sonar"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HUD de información sobre el área */}
      <div className="info-area">
        <div className="condiciones-agua">
          <div className="condicion">
            <span className="icono">💧</span>
            <span className="texto">Agua Turbia</span>
          </div>
          <div className="condicion">
            <span className="icono">🌊</span>
            <span className="texto">Corriente Moderada</span>
          </div>
          <div className="condicion">
            <span className="icono">🌡️</span>
            <span className="texto">24°C</span>
          </div>
        </div>
        
        {pezActual && estadoJuego === 'luchando' && (
          <div className="info-pez-luchando">
            <div className="nombre-pez">{pezActual.nombre}</div>
            <div className="peso-estimado">~{pezActual.pesoCapturado}kg</div>
            <div className="rareza-indicator rareza-${pezActual.rareza}">
              {pezActual.rareza.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaPesca;