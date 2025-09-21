import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import './App.css'; // Importamos nuestro archivo de estilos CSS

function App() {
  // useRef nos permite crear una referencia a un elemento del DOM, en este caso, el div que usaremos como lienzo.
  const lienzoRef = useRef(null);
  // También creamos una referencia para el motor de física para poder limpiarlo después.
  const motorFisicaRef = useRef(null);

  // useEffect es un hook de React que ejecuta código después de que el componente se renderiza.
  // El array vacío `` al final asegura que este código se ejecute solo una vez, al montar el componente.
  useEffect(() => {
    // --- Desestructuramos los módulos que usaremos de Matter.js para un acceso más fácil ---
    const { Engine, Render, Runner, World, Bodies, Constraint, Composite } = Matter;

    // --- 1. Inicialización del Motor de Física y el Renderizador ---
    
    // Creamos una instancia del motor de física, que manejará toda la simulación.
    const motor = Engine.create();
    motorFisicaRef.current = motor; // Guardamos la referencia para poder acceder a ella más tarde.
    const mundo = motor.world; // El 'mundo' es el contenedor de todos los objetos de nuestra simulación.

    // Creamos el renderizador. Este se encargará de dibujar la simulación en nuestro div (`lienzoRef`).
    const renderizador = Render.create({
      element: lienzoRef.current, // Le decimos que dibuje dentro del div que referenciamos.
      engine: motor, // Lo conectamos a nuestro motor de física.
      options: {
        width: window.innerWidth,   // Ancho del lienzo igual al de la ventana.
        height: window.innerHeight, // Alto del lienzo igual al de la ventana.
        wireframes: false,          // 'false' para que los objetos se vean sólidos y con color, no solo como líneas.
        background: '#3498db'       // Color de fondo azul, simulando agua.
      }
    });

    // --- 2. Creación de los Cuerpos Físicos ---

    // Creamos un suelo estático (invisible) fuera de la pantalla.
    // Esto es para que los objetos tengan un límite y no caigan infinitamente.
    const suelo = Bodies.rectangle(
      window.innerWidth / 2,    // Posición X (centro de la pantalla).
      window.innerHeight + 50,  // Posición Y (debajo de la pantalla).
      window.innerWidth,        // Ancho (toda la pantalla).
      100,                      // Alto.
      { isStatic: true }        // 'isStatic: true' hace que el objeto no se mueva ni sea afectado por la gravedad.
    );

    // --- 3. Simulación del Sedal de Pesca ---

    // Definimos un punto de anclaje fijo en la parte superior de la pantalla.
    // Esto simulará la punta de la caña de pescar.
    const puntoAnclaje = { x: window.innerWidth / 2, y: 50 }; 
    
    // Creamos el señuelo como un cuerpo circular.
    // Le damos 'densidad' para que tenga masa y sea afectado por la física.
    const senuelo = Bodies.circle(puntoAnclaje.x, puntoAnclaje.y + 250, 15, { 
      density: 0.05,
      render: {
        fillStyle: '#e74c3c' // Le damos un color rojo para que sea visible.
      }
    });

    // El sedal se simula con una "restricción" (Constraint).
    // Una restricción crea una conexión elástica entre dos puntos o cuerpos.
    const sedal = Constraint.create({
        pointA: puntoAnclaje, // El primer punto de la conexión es nuestro anclaje.
        bodyB: senuelo,       // El segundo punto es el cuerpo del señuelo.
        stiffness: 0.08,      // Rigidez del sedal (un valor bajo lo hace más elástico).
        length: 250,          // Longitud inicial del sedal.
        render: {
          strokeStyle: '#ffffff', // Color blanco para que el sedal sea visible.
          lineWidth: 2
        }
    });

    // Añadimos todos nuestros cuerpos (suelo, señuelo y sedal) al mundo físico para que formen parte de la simulación. [1]
    Composite.add(mundo, [suelo, senuelo, sedal]);

    // --- 4. Ejecución de la Simulación ---

    // Creamos un 'corredor' (Runner) que se encarga de actualizar el motor de física en cada fotograma.
    const corredor = Runner.create();
    Runner.run(corredor, motor);
    // Iniciamos el renderizador para que empiece a dibujar la escena.
    Render.run(renderizador);

    // --- 5. Función de Limpieza ---
    // Esta función se ejecuta cuando el componente se "desmonta" (por ejemplo, al cambiar de pantalla).
    // Es una buena práctica para liberar recursos y evitar problemas de memoria.
    return () => {
      Render.stop(renderizador);
      World.clear(mundo);
      Engine.clear(motor);
      renderizador.canvas.remove();
      renderizador.textures = {};
      Runner.stop(corredor);
    };
  },); // El array vacío `` asegura que este efecto se ejecute solo una vez.

  // --- Función para la Comunicación con Android ---
  const simularPicada = () => {
    // Primero, comprobamos si el objeto 'AndroidBridge' existe en el objeto 'window'.
    // Este es el nombre que le dimos a la interfaz en MainActivity.java.
    if (window.AndroidBridge && typeof window.AndroidBridge.triggerVibration === 'function') {
      console.log("¡Un pez ha picado! Enviando vibración al dispositivo.");
      // Si existe, llamamos a la función nativa 'triggerVibration' que creamos en Java.
      window.AndroidBridge.triggerVibration(500); // Vibra por 500 milisegundos.
    } else {
      // Si no se detecta el puente, mostramos un mensaje en la consola.
      // Esto es útil para hacer pruebas en el navegador del ordenador.
      console.log("Picada simulada (No se detectó el puente nativo 'AndroidBridge')");
      // Opcional: podemos usar la API de vibración del navegador para pruebas.
      if ('vibrate' in navigator) {
        navigator.vibrate(500);
      }
    }
  };

  return (
    <div className="App">
      {/* Este div será el lienzo para nuestra simulación de física. La referencia 'lienzoRef' lo conecta con Matter.js. */}
      <div ref={lienzoRef} className="lienzo-juego"></div>
      
      {/* Esta es la capa de la interfaz de usuario (UI), que se superpone al lienzo del juego. */}
      <div className="capa-ui">
        <button onClick={simularPicada} className="boton-accion">
          Simular Picada
        </button>
      </div>
    </div>
  );
}

export default App;