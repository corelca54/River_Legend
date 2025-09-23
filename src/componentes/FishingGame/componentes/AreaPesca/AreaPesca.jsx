import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './AreaPesca.css';

const AreaPesca = ({ 
  pezActual, 
  posicionSedal, 
  estadoJuego, 
  tension,
  onPezSale 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const pezMeshRef = useRef(null);
  const animationIdRef = useRef(null);

  // Estado para el pez 3D
  const [pez3DVisible, setPez3DVisible] = useState(false);
  const [animacionPez, setAnimacionPez] = useState('nadando');

  useEffect(() => {
    if (!mountRef.current) return;

    // Configurar Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });

    renderer.setSize(300, 200);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Luz direccional para dar volumen
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Posicionar cámara
    camera.position.z = 5;

    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Crear pez 3D cuando hay captura
  useEffect(() => {
    if (!pezActual || !sceneRef.current) return;

    // Limpiar pez anterior
    if (pezMeshRef.current) {
      sceneRef.current.remove(pezMeshRef.current);
    }

    // Crear geometría del pez basada en sus características
    const crearGeometriaPez = () => {
      const group = new THREE.Group();
      
      // Cuerpo principal del pez
      const cuerpoGeometry = new THREE.CylinderGeometry(
        0.3, 0.8, 2, 8
      );
      
      // Color basado en el pez capturado
      const colorPez = new THREE.Color(pezActual.color || '#C0C0C0');
      const cuerpoMaterial = new THREE.MeshPhongMaterial({ 
        color: colorPez,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      
      const cuerpoMesh = new THREE.Mesh(cuerpoGeometry, cuerpoMaterial);
      cuerpoMesh.rotation.z = Math.PI / 2; // Horizontal
      group.add(cuerpoMesh);

      // Cola del pez
      const colaGeometry = new THREE.ConeGeometry(0.6, 1, 6);
      const colaMaterial = new THREE.MeshPhongMaterial({ 
        color: colorPez.clone().multiplyScalar(0.8),
        transparent: true,
        opacity: 0.8
      });
      const colaMesh = new THREE.Mesh(colaGeometry, colaMaterial);
      colaMesh.position.x = -1.5;
      colaMesh.rotation.z = Math.PI / 2;
      group.add(colaMesh);

      // Aletas
      const aletaGeometry = new THREE.ConeGeometry(0.2, 0.6, 4);
      const aletaMaterial = new THREE.MeshPhongMaterial({ 
        color: pezActual.colorSecundario || '#FFD700',
        transparent: true,
        opacity: 0.7
      });
      
      // Aleta dorsal
      const aletaDorsal = new THREE.Mesh(aletaGeometry, aletaMaterial);
      aletaDorsal.position.set(0, 0.6, 0);
      aletaDorsal.rotation.x = Math.PI;
      group.add(aletaDorsal);

      // Aletas laterales
      const aletaIzq = new THREE.Mesh(aletaGeometry, aletaMaterial);
      aletaIzq.position.set(0.3, 0, 0.4);
      aletaIzq.rotation.z = Math.PI / 4;
      group.add(aletaIzq);

      const aletaDer = new THREE.Mesh(aletaGeometry, aletaMaterial);
      aletaDer.position.set(0.3, 0, -0.4);
      aletaDer.rotation.z = -Math.PI / 4;
      group.add(aletaDer);

      // Escalar basado en el tamaño del pez
      const escala = Math.max(0.5, Math.min(2, pezActual.peso / 10));
      group.scale.setScalar(escala);

      return group;
    };

    const pezMesh = crearGeometriaPez();
    pezMesh.position.set(0, 0, 0);
    
    sceneRef.current.add(pezMesh);
    pezMeshRef.current = pezMesh;

    setPez3DVisible(true);
    setAnimacionPez('luchando');

  }, [pezActual]);

  // Animación del pez 3D
  useEffect(() => {
    if (!pezMeshRef.current || !rendererRef.current || !sceneRef.current) return;

    const animate = () => {
      const pezMesh = pezMeshRef.current;
      const time = Date.now() * 0.001;

      if (animacionPez === 'luchando') {
        // Movimiento de lucha violento
        pezMesh.rotation.y = Math.sin(time * 8) * 0.5;
        pezMesh.rotation.z = Math.cos(time * 6) * 0.3;
        pezMesh.position.y = Math.sin(time * 10) * 0.3;
        pezMesh.position.x = Math.cos(time * 7) * 0.2;
        
        // Intensificar con la tensión
        const intensidad = (tension || 0) / 100;
        pezMesh.rotation.x = Math.sin(time * 12) * 0.4 * intensidad;
        
      } else if (animacionPez === 'capturado') {
        // Movimiento más suave cuando es capturado
        pezMesh.rotation.y = Math.sin(time * 2) * 0.2;
        pezMesh.position.y = Math.sin(time * 3) * 0.1;
        
      } else if (animacionPez === 'saliendo') {
        // Animación de salida del agua
        pezMesh.position.y += 0.05;
        pezMesh.rotation.y += 0.1;
        pezMesh.rotation.z = Math.sin(time * 5) * 0.8;
        
        // Llamar callback cuando el pez sale completamente
        if (pezMesh.position.y > 3) {
          onPezSale && onPezSale();
          setAnimacionPez('capturado');
          pezMesh.position.y = 0;
        }
      }

      rendererRef.current.render(sceneRef.current, { 
        position: { z: 5 }
      });
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animacionPez, tension, onPezSale]);

  // Cambiar animación según el estado del juego
  useEffect(() => {
    if (estadoJuego === 'luchando') {
      setAnimacionPez('luchando');
    } else if (estadoJuego === 'capturado') {
      setAnimacionPez('saliendo');
    }
  }, [estadoJuego]);

  return (
    <div className="area-pesca-container">
      {/* Caña de pescar mejorada */}
      <div className="cana-pesca-realista">
        <div className="mango-cana">
          <div className="grip-goma"></div>
          <div className="carrete-container">
            <div className={`carrete-metalico ${estadoJuego === 'luchando' ? 'girando' : ''}`}>
              <div className="carrete-bobina"></div>
              <div className="carrete-manija"></div>
            </div>
          </div>
        </div>
        
        <div className="vara-cana">
          <div className="segmento-vara segmento-1"></div>
          <div className="segmento-vara segmento-2"></div>
          <div className="segmento-vara segmento-3"></div>
          <div className="punta-vara"></div>
          <div className="guia-sedal guia-1"></div>
          <div className="guia-sedal guia-2"></div>
          <div className="guia-sedal guia-3"></div>
          <div className="guia-sedal guia-4"></div>
        </div>
      </div>

      {/* Sedal dinámico */}
      <svg className="sedal-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sedalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F2F2F" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>
        </defs>
        <path
          d={`M 85 8 Q ${(posicionSedal?.x ?? 50)} ${(posicionSedal?.y ? posicionSedal.y / 2 : 10)} ${(posicionSedal?.x ?? 50)} ${(posicionSedal?.y ?? 20)}`}
          stroke="url(#sedalGradient)"
          strokeWidth={tension > 70 ? "0.8" : "0.4"}
          fill="none"
          className={`sedal ${estadoJuego === 'luchando' ? `tension-${Math.floor(tension / 25)}` : ''}`}
          filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.5))"
        />
      </svg>

      {/* Anzuelo y señuelo */}
      <div 
        className={`anzuelo-container ${pez3DVisible ? 'con-pez' : ''}`}
        style={{ 
          left: `${posicionSedal?.x ?? 50}%`, 
          top: `${posicionSedal?.y ?? 20}%`
        }}
      >
        <div className="anzuelo-realista">
          <div className="anzuelo-cuerpo"></div>
          <div className="anzuelo-punta"></div>
          <div className="anzuelo-ojo"></div>
        </div>
        
        <div className="señuelo">
          <div className="señuelo-cuerpo"></div>
          <div className="señuelo-reflejo"></div>
        </div>

        {/* Burbujas cuando hay pez */}
        {pez3DVisible && (
          <div className="burbujas-pez">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`burbuja-pez burbuja-${i + 1}`}
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Área del pez 3D */}
      {pez3DVisible && (
        <div 
          className="pez-3d-container"
          style={{ 
            left: `${posicionSedal.x}%`, 
            top: `${posicionSedal.y + 5}%`
          }}
        >
          <div ref={mountRef} className="threejs-mount" />
          
          {/* Efectos de agua alrededor del pez */}
          <div className="efectos-agua-pez">
            <div className="ondas-agua onda-1"></div>
            <div className="ondas-agua onda-2"></div>
            <div className="ondas-agua onda-3"></div>
          </div>

          {/* Salpicaduras cuando el pez lucha */}
          {animacionPez === 'luchando' && (
            <div className="salpicaduras">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`gota-agua gota-${i + 1}`}
                  style={{
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Efectos de superficie del agua */}
      <div className="superficie-agua">
        <div className="ondas-superficie">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`onda-superficie onda-${i + 1}`}
              style={{
                left: `${posicionSedal?.x ?? 50}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Indicador de profundidad */}
      <div className="indicador-profundidad">
        <div className="escala-profundidad">
          {[1, 2, 3, 4, 5].map(depth => (
            <div 
              key={depth} 
              className={`marca-profundidad ${(posicionSedal?.y ?? 20) > depth * 15 ? 'activa' : ''}`}
            >
              <span>{depth}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Efectos ambientales */}
      <div className="efectos-ambientales">
        {/* Rayos de sol bajo el agua */}
        <div className="rayos-sol">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`rayo-sol rayo-${i + 1}`}
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>

        {/* Partículas flotantes en el agua */}
        <div className="particulas-agua">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`particula-flotante particula-${i + 1}`}
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

export default AreaPesca;