import React, { useState, useRef, useEffect } from 'react';
import './VideoBackground.css';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      video.play().catch(err => {
        console.log('Error playing video:', err);
        // Intentar reproducir con mute si falla
        video.muted = true;
        video.play().catch(e => {
          console.log('Error playing muted video:', e);
          setVideoError(true);
        });
      });
    };

    const handleError = () => {
      console.log('Error loading video');
      setVideoError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="video-background-container">
      {!videoError ? (
        <video
          ref={videoRef}
          className={`background-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/imagenes/fondos/Video_bucle.mp4" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
      ) : (
        // Fallback con imagen estática si el video no carga
        <div 
          className="background-image-fallback"
          style={{
            backgroundImage: 'url(/assets/imagenes/fondos/fondo_rio.png)',
          }}
        />
      )}
      
      {/* Overlay para dar efecto de agua turbia */}
      <div className="water-overlay">
        <div className="turbidity-layer"></div>
        <div className="surface-ripples">
          <div className="ripple ripple-1"></div>
          <div className="ripple ripple-2"></div>
          <div className="ripple ripple-3"></div>
        </div>
        
        {/* Partículas flotantes para simular sedimento */}
        <div className="sediment-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`particle particle-${i + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;