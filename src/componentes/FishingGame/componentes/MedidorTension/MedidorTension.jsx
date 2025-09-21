/**
 * MedidorTension.jsx - Componente del medidor de tensión del sedal
 * Muestra visualmente la tensión actual y alertas de peligro
 */

import React, { useEffect, useState } from 'react';
import './MedidorTension.css';

/**
 * Componente del medidor de tensión
 * @param {Object} props - Propiedades del componente
 * @param {number} props.tension - Valor actual de tensión (0-100)
 * @param {boolean} props.tensionCritica - Si la tensión está en nivel crítico
 * @param {string} props.colorTension - Color actual de la tensión
 */
const MedidorTension = ({ 
  tension, 
  tensionCritica, 
  colorTension 
}) => {
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [historialTension, setHistorialTension] = useState([]);
  const [vibracion, setVibracion] = useState(false);

  // Efecto para mostrar alerta cuando la tensión es crítica
  useEffect(() => {
    if (tensionCritica) {
      setAlertaVisible(true);
      setVibracion(true);
      
      // Vibración táctil en dispositivos compatibles
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      const timeout = setTimeout(() => {
        setVibracion(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    } else {
      setAlertaVisible(false);
      setVibracion(false);
    }
  }, [tensionCritica]);

  // Mantener historial de tensión para el gráfico
  useEffect(() => {
    setHistorialTension(prev => {
      const nuevoHistorial = [...prev, tension].slice(-20); // Últimos 20 valores
      return nuevoHistorial;
    });
  }, [tension]);

  // Determinar el icono según el nivel de tensión
  const obtenerIconoTension = () => {
    if (tension >= 80) return '🚨';
    if (tension >= 60) return '⚠️';
    if (tension >= 30) return '🎣';
    return '✅';
  };

  // Determinar el mensaje según el nivel de tensión
  const obtenerMensajeTension = () => {
    if (tension >= 90) return '¡PELIGRO! ¡Suelta el sedal!';
    if (tension >= 70) return 'Tensión muy alta - Ten cuidado';
    if (tension >= 50) return 'Tensión alta - Controla la situación';
    if (tension >= 30) return 'Tensión moderada';
    return 'Tensión baja - Todo bajo control';
  };

  // Calcular el ángulo para el medidor circular
  const anguloMedidor = (tension / 100) * 270; // 270 grados máximo

  return (
    <div className={`medidor-tension ${vibracion ? 'vibrando' : ''}`}>
      {/* Título del medidor */}
      <div className="titulo-medidor">
        <span className="icono-sedal">🎣</span>
        <span className="texto-titulo">Tensión del Sedal</span>
      </div>

      {/* Medidor circular principal */}
      <div className="contenedor-medidor-circular">
        <svg className="medidor-circular" viewBox="0 0 200 200">
          {/* Fondo del arco */}
          <path
            d="M 40 160 A 80 80 0 1 1 160 160"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Marcas de escala */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angulo = -135 + (i * 27); // De -135° a +135°
            const radianes = (angulo * Math.PI) / 180;
            const x1 = 100 + 70 * Math.cos(radianes);
            const y1 = 100 + 70 * Math.sin(radianes);
            const x2 = 100 + 80 * Math.cos(radianes);
            const y2 = 100 + 80 * Math.sin(radianes);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Arco de tensión con gradiente */}
          <defs>
            <linearGradient id="gradienteTension" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="50%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#F44336" />
            </linearGradient>
          </defs>
          
          <path
            d="M 40 160 A 80 80 0 1 1 160 160"
            fill="none"
            stroke="url(#gradienteTension)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="340"
            strokeDashoffset={340 - (tension / 100) * 340}
            className="arco-tension"
          />
          
          {/* Aguja del medidor */}
          <g transform={`rotate(${anguloMedidor - 135} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={colorTension}
              strokeWidth="3"
              strokeLinecap="round"
              className="aguja-medidor"
            />
            <circle
              cx="100"
              cy="100"
              r="8"
              fill={colorTension}
              stroke="white"
              strokeWidth="2"
            />
          </g>
          
          {/* Zona de peligro */}
          {tension >= 80 && (
            <path
              d="M 40 160 A 80 80 0 1 1 160 160"
              fill="none"
              stroke="#FF4444"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="340"
              strokeDashoffset={340 - (tension / 100) * 340}
              className="zona-peligro"
            />
          )}
        </svg>
        
        {/* Valor numérico central */}
        <div className="valor-central">
          <div className="numero-tension" style={{ color: colorTension }}>
            {Math.round(tension)}
          </div>
          <div className="unidad-tension">%</div>
        </div>
      </div>

      {/* Barra lineal de tensión */}
      <div className="barra-tension-lineal">
        <div className="etiquetas-barra">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="contenedor-barra">
          <div 
            className="relleno-barra"
            style={{ 
              width: `${tension}%`,
              backgroundColor: colorTension
            }}
          />
          {/* Marcadores de zona */}
          <div className="marcador-zona" style={{ left: '30%' }} />
          <div className="marcador-zona" style={{ left: '60%' }} />
          <div className="marcador-zona critico" style={{ left: '80%' }} />
        </div>
      </div>

      {/* Mensaje de estado */}
      <div className={`mensaje-tension ${tensionCritica ? 'critico' : ''}`}>
        <span className="icono-mensaje">{obtenerIconoTension()}</span>
        <span className="texto-mensaje">{obtenerMensajeTension()}</span>
      </div>

      {/* Gráfico de historial */}
      <div className="grafico-historial">
        <div className="titulo-grafico">Historial de Tensión</div>
        <div className="contenedor-grafico">
          <svg className="svg-grafico" viewBox="0 0 200 60">
            {/* Líneas de referencia */}
            <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            
            {/* Línea del gráfico */}
            {historialTension.length > 1 && (
              <polyline
                points={historialTension.map((valor, index) => {
                  const x = (index / (historialTension.length - 1)) * 200;
                  const y = 50 - (valor / 100) * 40;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke={colorTension}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            
            {/* Puntos del gráfico */}
            {historialTension.map((valor, index) => {
              if (index < historialTension.length - 1) return null;
              const x = (index / Math.max(historialTension.length - 1, 1)) * 200;
              const y = 50 - (valor / 100) * 40;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={colorTension}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Alerta crítica */}
      {alertaVisible && (
        <div className="alerta-critica">
          <div className="contenido-alerta">
            <div className="icono-alerta">⚠️</div>
            <div className="texto-alerta">¡TENSIÓN CRÍTICA!</div>
            <div className="subtexto-alerta">Suelta el sedal inmediatamente</div>
          </div>
        </div>
      )}

      {/* Botones de acción rápida */}
      <div className="acciones-rapidas">
        <div className="indicador-accion recoger">
          <div className="icono-accion">⬆️</div>
          <div className="texto-accion">Recoger</div>
          <div className="efecto-tension">-15%</div>
        </div>
        <div className="indicador-accion soltar">
          <div className="icono-accion">⬇️</div>
          <div className="texto-accion">Soltar</div>
          <div className="efecto-tension">-25%</div>
        </div>
      </div>
    </div>
  );
};

export default MedidorTension;