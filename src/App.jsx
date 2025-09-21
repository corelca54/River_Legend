/**
 * App.jsx - Componente principal de la aplicación
 * Punto de entrada para el juego de pesca colombiano
 */

import React from 'react';
import FishingGame from './componentes/FishingGame/FishingGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <FishingGame />
    </div>
  );
}

export default App;