import React, { useState, useEffect } from 'react';
import './ControlesJuego.css';

const ControlesJuego = ({
  estadoJuego,
  onLanzar,
  onRecoger,
  onSoltar,
  onReiniciar,
  onPausar,
  onReanudar,
  efectosSonido,
  onToggleSonido,
  tension
}) => {
  const [pulsandoRecoger, setPulsandoRecoger] = useState(false);
  const [pulsandoSoltar, setPulsandoSoltar] = useState(false);
  const [vibracionDisponible, setVibracionDisponible] = useState(false);

  // Detectar si la vibración está disponible
  useEffect(() => {
    setVibracionDisponible('vibrate' in navigator);
  }, []);

  // Vibración táctil para feedback
  const vibrar = (duracion = 50) => {
    if (vibracionDisponible) {
      navigator.vibrate(duracion);
    }
  };

  // Manejo de botón Lanzar/Reiniciar
  const manejarLanzarReiniciar = () => {
    vibrar(100);
    if (estadoJuego === 'inicial' || estadoJuego === 'perdido' || estadoJuego === 'capturado') {
      if (estadoJuego === 'inicial') {
        onLanzar();
      } else {
        onReiniciar();
      }
    }
  };

  // Manejo de recoger sedal (con presión continua)
  const iniciarRecoger = () => {
    if (estadoJuego === 'luchando') {
      setPulsandoRecoger(true);
      vibrar(30);
      onRecoger();
    }
  };

  const detenerRecoger = () => {
    setPulsandoRecoger(false);
  };

  // Manejo de soltar sedal (con presión continua)
  const iniciarSoltar = () => {
    if (estadoJuego === 'luchando') {
      setPulsandoSoltar(true);
      vibrar(20);
      onSoltar();
    }
  };

  const detenerSoltar = () => {
    setPulsandoSoltar(false);
  };

  // Manejo de pausa/reanudar
  const manejarPausa = () => {
    vibrar(50);
    if (estadoJuego === 'pausado') {
      onReanudar();
    } else if (estadoJuego === 'luchando') {
      onPausar();
    }
  };

  // Toggle de sonido
  const manejarToggleSonido = () => {
    vibrar(30);
    onToggleSonido();
  };

  // Obtener texto del botón principal
  const obtenerTextoBotonPrincipal = () => {
    switch (estadoJuego) {
      case 'inicial':
        return 'LANZAR SEÑUELO';
      case 'lanzando':
        return 'LANZANDO...';
      case 'pescando':
        return 'ESPERANDO...';
      case 'picando':
        return '¡PICA!';
      case 'luchando':
        return 'LUCHANDO';
      case 'capturado':
        return 'NUEVO LANCE';
      case 'perdido':
        return 'INTENTAR OTRA VEZ';
      case 'pausado':
        return 'PAUSADO';
      default:
        return 'LANZAR';
    }
  };

  // Obtener clase CSS del botón principal
  const obtenerClaseBotonPrincipal = () => {
    const clases = ['boton-principal'];
    
    switch (estadoJuego) {
      case 'lanzando':
        clases.push('estado-lanzando');
        break;
      case 'pescando':
        clases.push('estado-esperando');
        break;
      case 'picando':
        clases.push('estado-picando');
        break;
      case 'luchando':
        clases.push('estado-luchando');
        break;
      case 'capturado':
        clases.push('estado-capturado');
        break;
      case 'perdido':
        clases.push('estado-perdido');
        break;
      case 'pausado':
        clases.push('estado-pausado');
        break;
      default:
        clases.push('estado-inicial');
    }
    
    return clases.join(' ');
  };

  // Obtener intensidad de vibración por tensión
  const obtenerIntensidadTension = () => {
    if (tension > 80) return 'critica';
    if (tension > 60) return 'alta';
    if (tension > 30) return 'media';
    return 'baja';
  };

  return (
    <div className="controles-juego">
      {/* Controles principales de lucha (solo durante la lucha) */}
      {estadoJuego === 'luchando' && (
        <div className="controles-lucha">
          <div className="indicador-tension-control">
            <div className="etiqueta-tension">TENSIÓN</div>
            <div className={`barra-tension-mini tension-${obtenerIntensidadTension()}`}>
              <div 
                className="relleno-tension"
                style={{ width: `${tension}%` }}
              />
              <div className="indicador-peligro" style={{ left: '80%' }}>⚠️</div>
            </div>
            <div className="valor-tension">{Math.round(tension)}%</div>
          </div>

          <div className="botones-lucha">
            {/* Botón Recoger */}
            <button
              className={`boton-accion boton-recoger ${pulsandoRecoger ? 'presionado' : ''}`}
              onMouseDown={iniciarRecoger}
              onMouseUp={detenerRecoger}
              onMouseLeave={detenerRecoger}
              onTouchStart={(e) => { e.preventDefault(); iniciarRecoger(); }}
              onTouchEnd={(e) => { e.preventDefault(); detenerRecoger(); }}
            >
              <div className="icono-boton">🎣</div>
              <div className="texto-boton">RECOGER</div>
              <div className="subtexto-boton">Reduce mucho</div>
              <div className="efecto-pulso"></div>
            </button>

            {/* Botón Soltar */}
            <button
              className={`boton-accion boton-soltar ${pulsandoSoltar ? 'presionado' : ''}`}
              onMouseDown={iniciarSoltar}
              onMouseUp={detenerSoltar}
              onMouseLeave={detenerSoltar}
              onTouchStart={(e) => { e.preventDefault(); iniciarSoltar(); }}
              onTouchEnd={(e) => { e.preventDefault(); detenerSoltar(); }}
            >
              <div className="icono-boton">🤲</div>
              <div className="texto-boton">SOLTAR</div>
              <div className="subtexto-boton">Reduce poco</div>
              <div className="efecto-pulso"></div>
            </button>
          </div>

          {/* Consejos dinámicos de lucha */}
          <div className="consejos-dinamicos">
            {tension > 85 && (
              <div className="consejo critico">
                🚨 ¡TENSIÓN CRÍTICA! ¡RECOGER YA!
              </div>
            )}
            {tension > 60 && tension <= 85 && (
              <div className="consejo alerta">
                ⚠️ Tensión alta - Considera recoger
              </div>
            )}
            {tension <= 30 && (
              <div className="consejo optimo">
                ✅ Tensión controlada - Sigue así
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controles generales */}
      <div className="controles-generales">
        {/* Botón principal */}
        <button
          className={obtenerClaseBotonPrincipal()}
          onClick={manejarLanzarReiniciar}
          disabled={estadoJuego === 'lanzando' || estadoJuego === 'pescando' || estadoJuego === 'picando' || estadoJuego === 'luchando'}
        >
          <div className="contenido-boton-principal">
            <div className="icono-principal">
              {estadoJuego === 'inicial' && '🎯'}
              {estadoJuego === 'lanzando' && '🌊'}
              {estadoJuego === 'pescando' && '⏳'}
              {estadoJuego === 'picando' && '🐟'}
              {estadoJuego === 'luchando' && '⚔️'}
              {estadoJuego === 'capturado' && '🎉'}
              {estadoJuego === 'perdido' && '😞'}
              {estadoJuego === 'pausado' && '⏸️'}
            </div>
            <div className="texto-principal">{obtenerTextoBotonPrincipal()}</div>
          </div>
          
          {/* Efectos visuales del botón */}
          <div className="efecto-fondo"></div>
          <div className="efecto-brillo"></div>
        </button>

        {/* Controles secundarios */}
        <div className="controles-secundarios">
          {/* Botón de pausa (solo durante la lucha) */}
          {(estadoJuego === 'luchando' || estadoJuego === 'pausado') && (
            <button
              className={`boton-secundario boton-pausa ${estadoJuego === 'pausado' ? 'activo' : ''}`}
              onClick={manejarPausa}
            >
              <div className="icono-secundario">
                {estadoJuego === 'pausado' ? '▶️' : '⏸️'}
              </div>
              <div className="texto-secundario">
                {estadoJuego === 'pausado' ? 'Reanudar' : 'Pausa'}
              </div>
            </button>
          )}

          {/* Control de sonido */}
          <button
            className={`boton-secundario boton-sonido ${efectosSonido ? 'activo' : 'inactivo'}`}
            onClick={manejarToggleSonido}
          >
            <div className="icono-secundario">
              {efectosSonido ? '🔊' : '🔇'}
            </div>
            <div className="texto-secundario">
              {efectosSonido ? 'Sonido ON' : 'Sonido OFF'}
            </div>
          </button>

          {/* Indicador de vibración */}
          {vibracionDisponible && (
            <div className="indicador-vibracion">
              📳 Vibración disponible
            </div>
          )}
        </div>
      </div>

      {/* Indicadores de estado del juego */}
      <div className="indicadores-estado">
        {estadoJuego === 'lanzando' && (
          <div className="estado-visual lanzando">
            <div className="spinner"></div>
            <span>Señuelo en vuelo...</span>
          </div>
        )}

        {estadoJuego === 'pescando' && (
          <div className="estado-visual pescando">
            <div className="ondas-radar">
              <div className="onda-radar"></div>
              <div className="onda-radar"></div>
              <div className="onda-radar"></div>
            </div>
            <span>Detectando peces...</span>
          </div>
        )}

        {estadoJuego === 'picando' && (
          <div className="estado-visual picando">
            <div className="alerta-picada">❗</div>
            <span>¡Un pez muerde el anzuelo!</span>
          </div>
        )}
      </div>

      {/* Instrucciones contextuales */}
      <div className="instrucciones-contextuales">
        {estadoJuego === 'inicial' && (
          <div className="instruccion">
            👆 Toca "LANZAR SEÑUELO" para comenzar tu aventura de pesca
          </div>
        )}

        {estadoJuego === 'luchando' && (
          <div className="instruccion activa">
            <div className="tip-lucha">
              💡 <strong>MANTÉN PRESIONADO</strong> los botones para acción continua
            </div>
            <div className="tip-lucha">
              🎯 Mantén la tensión <strong>por debajo del 100%</strong> para no perder el pez
            </div>
          </div>
        )}

        {estadoJuego === 'capturado' && (
          <div className="instruccion exito">
            🎊 ¡Excelente captura! Toca "NUEVO LANCE" para continuar pescando
          </div>
        )}

        {estadoJuego === 'perdido' && (
          <div className="instruccion motivacion">
            💪 ¡No te rindas! Cada pescador pierde algunos peces. ¡Intenta de nuevo!
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlesJuego;