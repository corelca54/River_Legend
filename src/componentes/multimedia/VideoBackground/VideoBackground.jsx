/**
 * VideoBackground.jsx - Componente de video de fondo
 * Maneja la reproducción del video ambiente del río con optimizaciones
 */

import React, { useEffect, useRef, useState } from 'react';
import './VideoBackground.css';

/**
 * Componente de video de fondo optimizado para móviles
 * Incluye fallback de imagen y controles de calidad
 */
const VideoFondo = ({ 
  // =========================================================================
  // RUTAS CORREGIDAS SEGÚN TU ESTRUCTURA DE CARPETAS (public/assets/imagenes/fondos/)
  // =========================================================================
  src = '/assets/imagenes/fondos/Video_bucle.mp4', // <--- CORREGIDO para tu estructura
  poster = '/assets/imagenes/fondos/Fondo_rio.jpg', // <--- CORREGIDO para tu estructura
  // =========================================================================
  calidad = 'auto' // 'low', 'medium', 'high', 'auto'
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Detectar modo de bajo consumo (iOS y algunos Android)
    const detectarLowPowerMode = () => {
      // Método 1: Detectar iOS Low Power Mode
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          if (battery.level < 0.2) {
            setLowPowerMode(true);
          }
        });
      }

      // Método 2: Detectar por performance
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
        setLowPowerMode(true);
      }

      // Método 3: Detectar dispositivos de gama baja
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setLowPowerMode(true);
      }
    };

    detectarLowPowerMode();

    // Configurar calidad según dispositivo
    const configurarCalidadVideo = () => {
      if (lowPowerMode || calidad === 'low') {
        video.style.filter = 'blur(1px)'; // Reducir calidad visual
      } else if (calidad === 'high') {
        video.style.filter = 'contrast(1.1) brightness(0.9)'; // Mejorar calidad
      }
    };

    // Event listeners
    const onCanPlay = () => {
      setVideoReady(true);
      configurarCalidadVideo();
      console.log('Video cargado correctamente desde:', src); // Debug mejorado
    };

    const onError = (e) => {
      console.warn('Error al cargar video de fondo:', e);
      console.log('Intentando cargar desde:', src);
      setVideoError(true);
    };

    const onLoadedData = () => {
      // Reproducir automáticamente si es posible
      video.play().catch((error) => {
        console.warn('Reproducción automática bloqueada:', error);
        // En algunos móviles necesita interacción del usuario
      });
    };

    const onPlay = () => {
      video.style.willChange = 'auto';
    };

    const onPause = () => {
      video.style.willChange = 'auto';
    };

    // Agregar listeners
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    // Cleanup
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [calidad, lowPowerMode, src]);

  // Manejo de visibilidad de página para optimizar rendimiento
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Silenciar error si no se puede reproducir
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Renderizar imagen de fallback si hay error o dispositivo de baja potencia
  if (videoError || lowPowerMode) {
    return (
      <>
        <div 
          className="video-fondo-fallback"
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -10
          }}
        />
        {videoError && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(200,0,0,0.85)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: 1000,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            Error: No se pudo cargar el video de fondo.<br />
            Verifica que <code>public/assets/imagenes/fondos/Video_bucle.mp4</code> exista y no esté corrupto.
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className={`video-fondo ${videoReady ? 'video-ready' : ''}`}
        autoPlay
        loop
        muted
        playsInline // Importante para iOS
        preload="metadata" // Optimizar carga inicial
        poster={poster}
        disablePictureInPicture
        disableRemotePlayback
        x-webkit-airplay="deny"
      >
        <source src={src} type="video/mp4" />
        
        {/* Fallback para navegadores muy antiguos */}
        <div 
          className="video-fondo-fallback"
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </video>

      {/* Overlay sutil para mejorar legibilidad del contenido */}
      <div className="video-overlay" />
    </>
  );
};

export default VideoFondo;