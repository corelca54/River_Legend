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
    
    // Hacemos el señuelo un poco más pesado para un lanzamiento más realista.
    const senuelo = Bodies.circle(puntoAnclaje.x, puntoAnclaje.y + 150, 15, { 
      density: 0.08, // Aumentamos la densidad
      restitution: 0.5, // Añadimos un poco de rebote
      render: { fillStyle: '#e74c3c' }
    });

    // El sedal ahora será más elástico para simular una "resortera".
    const sedal = Constraint.create({
        pointA: puntoAnclaje,
        bodyB: senuelo,
        stiffness: 0.04, // Hacemos el sedal más elástico
        length: 150,
        render: { strokeStyle: '#ffffff', lineWidth: 2 }
    });

    // --- 4. Añadiendo Interacción con el Ratón ---
    
    // Creamos una instancia del ratón y la asociamos con nuestro lienzo.
    const raton = Mouse.create(renderizador.canvas);
    
    // Creamos una "restricción de ratón" que permite arrastrar objetos.
    const restriccionRaton = MouseConstraint.create(motor, {
      mouse: raton,
      constraint: {
        stiffness: 0.2, // Rigidez con la que el ratón agarra el objeto.
        render: {
          visible: false // No queremos que se vea la línea del agarre.
        }
      }
    });

    // Añadimos todo al mundo: suelo, señuelo, sedal y la restricción del ratón.
    Composite.add(mundo,);

    // --- 5. Eventos del Juego ---

    // Escuchamos el evento 'enddrag' (terminar de arrastrar) en la restricción del ratón.
    Events.on(restriccionRaton, 'enddrag', (evento) => {
      // Si el cuerpo que soltamos es nuestro señuelo...
      if (evento.body === senuelo) {
        setEstaLanzado(true); // Cambiamos el estado a "lanzado".
      }
    });

    // Escuchamos el evento 'afterUpdate' que se dispara después de cada actualización de la física.
    Events.on(motor, 'afterUpdate', () => {
      // Si el señuelo fue lanzado y su velocidad es muy baja (casi quieto)...
      if (estaLanzado && senuelo.velocity.x < 0.1 && senuelo.velocity.y < 0.1) {
        // Lo consideramos "en el agua" y preparamos para el siguiente lanzamiento.
        // Por ahora, simplemente lo reiniciamos.
        // En el futuro, aquí comenzaría la lógica de "esperar picada".
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
  }, [estaLanzado]); // Añadimos 'estaLanzado' a las dependencias para que el efecto se actualice.

  // --- Función para reiniciar la posición del señuelo ---
  const reiniciarLanzamiento = () => {
    // Esta función la implementaremos en el futuro para reiniciar la escena.
    window.location.reload(); // Por ahora, una simple recarga de página funciona.
  };

  return (
    <div className="App">
      <div ref={lienzoRef} className="lienzo-juego"></div>
      <div className="capa-ui">
        {/* Cambiamos el botón para que ahora reinicie el lanzamiento */}
        <button onClick={reiniciarLanzamiento} className="boton-accion">
          Reiniciar Lanzamiento
        </button>
      </div>
    </div>
  );
}

export default App;