// Componente principal del área de pesca
import React, { useEffect, useState, useRef } from 'react';
import { PECES_COLOMBIANOS } from '../../../../data/datosPeces.js';
import './AreaPesca.css';

// Recibe las props principales del juego de pesca
const AreaPesca = ({
  pezActual, // Pez actual en lucha o captura
  posicionSedal, // Posición del señuelo
  estadoJuego, // Estado actual del juego
  tension, // Tensión de la línea
  tiempoLucha, // Tiempo de lucha con el pez
  pezSaliendoDelAgua // Si el pez está saltando fuera del agua
}) => {
  // Estados locales para efectos visuales y animaciones
  const [ondas, setOndas] = useState([]); // Ondas en el agua
  const [burbujas, setBurbujas] = useState([]); // Burbujas animadas
  const [efectoLanzamiento, setEfectoLanzamiento] = useState(false); // Efecto al lanzar
  const [pezVisible, setPezVisible] = useState(false); // Visibilidad del pez luchando
  const [pecesNadando, setPecesNadando] = useState([]); // Peces nadando
  const [pezPicando, setPezPicando] = useState(null); // Pez que pica
  const intervalRef = useRef(); // Referencia para intervalos
  // Generar peces nadando aleatorios durante la pesca
  // Efecto: Genera peces nadando aleatorios y gestiona el pez que pica
  useEffect(() => {
    if (estadoJuego === 'pescando') {
      // Selecciona aleatoriamente 3-5 peces de la base de datos
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
      // Selecciona uno de los peces nadando para que pique
      const idx = Math.floor(Math.random() * pecesNadando.length);
      setPezPicando({ ...pecesNadando[idx] });
    } else if (estadoJuego !== 'pescando' && estadoJuego !== 'picando') {
      setPecesNadando([]);
      setPezPicando(null);
    }
  }, [estadoJuego]);
  // Animar peces nadando
  // Efecto: Animación de peces nadando
  useEffect(() => {
    if (estadoJuego === 'pescando' && pecesNadando.length > 0) {
      intervalRef.current = setInterval(() => {
        setPecesNadando(prev => prev.map(pez => {
          let nuevaX = pez.x + pez.dir * pez.speed * (0.7 + Math.sin(Date.now()/500 + pez.fase));
          let nuevaY = pez.y + Math.sin(Date.now()/400 + pez.fase) * 0.7;
          // Rebote en los bordes del área
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
  // Efecto: Animación del pez que pica acercándose al señuelo
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
  // Efecto: Genera ondas en el agua al lanzar o luchar
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
  // Efecto: Genera burbujas animadas en el agua
  useEffect(() => {
    const interval = setInterval(() => {
      setBurbujas(prev => {
        const nuevasBurbujas = [...prev];
        // Agrega nueva burbuja si hay menos de 12
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
        // Actualiza posición y opacidad de burbujas existentes
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
  // Efecto: Muestra animación de lanzamiento
  useEffect(() => {
    if (estadoJuego === 'lanzando') {
      setEfectoLanzamiento(true);
      setTimeout(() => setEfectoLanzamiento(false), 1500);
    }
  }, [estadoJuego]);

  // Mostrar pez durante la lucha
  // Efecto: Controla la visibilidad del pez durante la lucha y la picada
  useEffect(() => {
    if (estadoJuego === 'luchando' || estadoJuego === 'picando') {
      setPezVisible(true);
    } else {
      setPezVisible(false);
    }
  }, [estadoJuego]);

  // Obtener clase CSS para el estado del agua
  // Devuelve la clase CSS para el estado del agua
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
  // Calcula la intensidad de la lucha para efectos visuales
  const intensidadLucha = tension > 70 ? 'alta' : tension > 40 ? 'media' : 'baja';

  // Componente principal del área de pesca
  // - Muestra el área visual donde nadan los peces y ocurre la pesca
  // - Usa imagen de fondo de río y superpone efectos visuales y peces
  // - Recibe props desde FishingGame.jsx
  return (
    <div className="area-pesca">
      {/* Fondo de río: imagen real, no video */}
      <img
        src="/assets/imagenes/fondos/fondo_rio.png"
        alt="Fondo río colombiano"
        className="fondo-rio"
        draggable="false"
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
      />
      {/* Superficie del agua y efectos */}
      <div className={`superficie-agua ${getClaseAgua()}`}> 

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

        {/* Peces nadando y picando siempre visibles durante pesca y picada */}
        {/* Peces nadando animados */}
        {(estadoJuego === 'pescando' || estadoJuego === 'picando' || estadoJuego === 'luchando') && (
          <>
            {pecesNadando.map((pez, idx) => (
              pez.imagen && (
                <div
                  key={pez.id + idx}
                  className={`pez-nadando rareza-${pez.rareza}`}
                  style={{
                    left: `${pez.x}%`,
                    top: `${pez.y}%`,
                    transform: `scale(${0.7 + pez.dificultad * 0.13}) scaleX(${pez.dir})`,
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18)) brightness(0.98)',
                    transition: 'left 0.1s linear, top 0.1s linear, transform 0.2s',
                    background: 'none',
                    border: 'none',
                    zIndex: 6
                  }}
                >
                  <img
                    src={pez.imagen.startsWith('/') ? pez.imagen : `/assets/imagenes/peces/${pez.imagen}`}
                    alt={pez.nombre}
                    className="imagen-pez-nadando"
                    style={{
                      width: '140px',
                      height: 'auto',
                      opacity: 1,
                      background: 'transparent',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
                    }}
                    onError={e => {
                      if (pez.imagenAlternativa && e.target.src !== pez.imagenAlternativa) {
                        e.target.src = pez.imagenAlternativa;
                      }
                    }}
                  />
                </div>
              )
            ))}
            {/* Pez picando */}
            {estadoJuego === 'picando' && pezPicando && pezPicando.imagen && (
              <div
                className={`pez-picando rareza-${pezPicando.rareza}`}
                style={{
                  left: `${pezPicando.x}%`,
                  top: `${pezPicando.y}%`,
                  transform: `scale(${0.8 + pezPicando.dificultad * 0.15}) scaleX(${pezPicando.dir})`,
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18)) brightness(1)',
                  transition: 'left 0.1s linear, top 0.1s linear, transform 0.2s',
                  background: 'none',
                  border: 'none',
                  zIndex: 7
                }}
              >
                <img
                  src={pezPicando.imagen.startsWith('/') ? pezPicando.imagen : `/assets/imagenes/peces/${pezPicando.imagen}`}
                  alt={pezPicando.nombre}
                  className="imagen-pez-picando"
                  style={{
                    width: '160px',
                    height: 'auto',
                    opacity: 1,
                    background: 'transparent',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
                  }}
                  onError={e => {
                    if (pezPicando.imagenAlternativa && e.target.src !== pezPicando.imagenAlternativa) {
                      e.target.src = pezPicando.imagenAlternativa;
                    }
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* Pez que pica y se acerca al señuelo */}
        {estadoJuego === 'picando' && pezPicando && (
          <div
            className={`pez-picando rareza-${pezPicando.rareza}`}
            style={{
              left: `${pezPicando.x}%`,
              top: `${pezPicando.y}%`,
              transform: `scale(${0.8 + pezPicando.dificultad * 0.15}) scaleX(${pezPicando.dir})`,
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18)) brightness(1)',
              transition: 'left 0.1s linear, top 0.1s linear, transform 0.2s',
              background: 'none',
              border: 'none'
            }}
          >
            <img
              src={pezPicando.imagen}
              alt={pezPicando.nombre}
              className="imagen-pez-picando"
              style={{
                width: '160px',
                height: 'auto',
                opacity: 1,
                background: 'transparent',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
              }}
            />
            <div style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              width: '160px',
              height: '36px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 100%)',
              opacity: 0.5,
              borderRadius: '0 0 40px 40px',
              pointerEvents: 'none'
            }} />
          </div>
        )}
        
        {/* Pez luchando bajo el agua */}
        {/* Pez luchando bajo el agua */}
        {pezVisible && pezActual && pezActual.imagen && (
          <div
            className={`pez-luchando ${estadoJuego} rareza-${pezActual.rareza}`}
            style={{
              left: `${posicionSedal.x + Math.sin(tiempoLucha * 3) * 8}%`,
              top: `${posicionSedal.y + 25 + Math.cos(tiempoLucha * 2) * 5}%`,
              transform: `scale(${1.1 + pezActual.dificultad * 0.18})`,
              filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.18)) brightness(1)',
              background: 'none',
              border: 'none',
              zIndex: 8
            }}
          >
            <img
              src={pezActual.imagen.startsWith('/') ? pezActual.imagen : `/assets/imagenes/peces/${pezActual.imagen}`}
              alt={pezActual.nombre}
              className="imagen-pez-lucha"
              style={{
                width: '180px',
                height: 'auto',
                opacity: 1,
                background: 'transparent',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                transform: `scaleX(${Math.sin(tiempoLucha * 2) > 0 ? 1 : -1})`
              }}
              onError={e => {
                if (pezActual.imagenAlternativa && e.target.src !== pezActual.imagenAlternativa) {
                  e.target.src = pezActual.imagenAlternativa;
                }
              }}
            />
            <div style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              width: '180px',
              height: '40px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 100%)',
              opacity: 0.5,
              borderRadius: '0 0 40px 40px',
              pointerEvents: 'none'
            }} />
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
        {/* Pez saltando fuera del agua al capturarlo */}
        {pezSaliendoDelAgua && pezActual && pezActual.imagen && (
          <div className="pez-saltando">
            <div
              className={`pez-capturado rareza-${pezActual.rareza}`}
              style={{
                left: `${posicionSedal.x}%`,
                top: `${posicionSedal.y}%`
              }}
            >
              <img
                src={pezActual.imagen.startsWith('/') ? pezActual.imagen : `/assets/imagenes/peces/${pezActual.imagen}`}
                alt={pezActual.nombre}
                className="imagen-pez-salto"
                onError={e => {
                  if (pezActual.imagenAlternativa && e.target.src !== pezActual.imagenAlternativa) {
                    e.target.src = pezActual.imagenAlternativa;
                  }
                }}
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
        {/* Tarjeta pequeña con imagen y datos del pez durante la lucha */}
        {pezActual && estadoJuego === 'luchando' && pezActual.imagen && (
          <div className="info-pez-luchando">
            <img
              src={pezActual.imagen.startsWith('/') ? pezActual.imagen : `/assets/imagenes/peces/${pezActual.imagen}`}
              alt={pezActual.nombre}
              className="imagen-pez-tarjeta"
              style={{ width: '80px', height: 'auto', marginBottom: '8px', borderRadius: '8px' }}
            />
            <div className="nombre-pez">{pezActual.nombre}</div>
            <div className="peso-estimado">~{pezActual.pesoCapturado || pezActual.peso}kg</div>
            <div className={`rareza-indicator rareza-${pezActual.rareza}`}>
              {pezActual.rareza.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Imagen del pez capturado en el centro del área de pesca */}
      {estadoJuego === 'capturado' && pezActual && pezActual.imagen && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <img
            src={pezActual.imagen.startsWith('/') ? pezActual.imagen : `/assets/imagenes/peces/${pezActual.imagen}`}
            alt={pezActual.nombre}
            style={{
              width: 220,
              height: 'auto',
              borderRadius: 18,
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              background: 'rgba(255,255,255,0.05)',
              marginBottom: 12
            }}
            onError={e => {
              if (pezActual.imagenAlternativa && e.target.src !== pezActual.imagenAlternativa) {
                e.target.src = pezActual.imagenAlternativa;
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AreaPesca;