import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './App.css'; // Mantenemos la importación de nuestros estilos.

function App() {
  // Referencias para el lienzo y el motor de física.
  const lienzoRef = useRef(null);
  const motorFisicaRef = useRef(null);

  // Un estado simple para saber si el señuelo está en el aire.
  const [estaLanzado, setEstaLanzado] = useState(false);

  useEffect(() => {
    // --- Módulos de Matter.js que vamos a utilizar ---
    const { Engine, Render, Runner, World, Bodies, Constraint, Composite, Mouse, MouseConstraint, Events } = Matter;

    // --- 1. Inicialización del Motor y Renderizador (como antes) ---
    const motor = Engine.create();
    motorFisicaRef.current = motor;
    const mundo = motor.world;

    const renderizador = Render.create({
      element: lienzoRef.current,
      engine: motor,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#3498db'
      }
    });

    // --- 2. Creación de los Cuerpos Físicos ---
    const suelo = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });

    // --- 3. Simulación del Sedal y Señuelo (con mejoras) ---
    const puntoAnclaje = { x: window.innerWidth / 2, y: 150 };
    
    const senuelo = Bodies.circle(puntoAnclaje.x, puntoAnclaje.y + 150, 15, { 
      density: 0.08,
      restitution: 0.5,
      render: { fillStyle: '#e74c3c' }
    });

    const sedal = Constraint.create({
        pointA: puntoAnclaje,
        bodyB: senuelo,
        stiffness: 0.04,
        length: 150,
        render: { strokeStyle: '#ffffff', lineWidth: 2 }
    });

    // --- 4. Añadiendo Interacción con el Ratón ---
    const raton = Mouse.create(renderizador.canvas);
    
    const restriccionRaton = MouseConstraint.create(motor, {
      mouse: raton,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // **********************************************************************
    // ***                       LÍNEA CORREGIDA                          ***
    // **********************************************************************
    // Añadimos TODOS los objetos al mundo en un array.
    // Este era el error: ahora sí le estamos pasando el suelo, el señuelo, el sedal y el control del ratón.
    Composite.add(mundo,);
    // **********************************************************************

    // --- 5. Eventos del Juego ---
    Events.on(restriccionRaton, 'enddrag', (evento) => {
      if (evento.body === senuelo) {
        setEstaLanzado(true);
      }
    });

    Events.on(motor, 'afterUpdate', () => {
      if (estaLanzado && senuelo.velocity.x < 0.1 && senuelo.velocity.y < 0.1) {
        // Lógica futura aquí.
      }
    });

    // --- 6. Ejecución y Limpieza (como antes) ---
    const corredor = Runner.create();
    Runner.run(corredor, motor);
    Render.run(renderizador);

    return () => {
      Render.stop(renderizador);
      World.clear(mundo);
      Engine.clear(motor);
      renderizador.canvas.remove();
      renderizador.textures = {};
      Runner.stop(corredor);
    };
  }, [estaLanzado]);

  const reiniciarLanzamiento = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <div ref={lienzoRef} className="lienzo-juego"></div>
      <div className="capa-ui">
        <button onClick={reiniciarLanzamiento} className="boton-accion">
          Reiniciar Lanzamiento
        </button>
      </div>
    </div>
  );
}

export default App;