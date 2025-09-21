/**
 * calculosPesca.js - Funciones de cálculo para el sistema de pesca
 * Maneja puntuación, experiencia y mecánicas del juego
 */

import { 
  CONFIGURACION_PUNTUACION, 
  CONFIGURACION_EXPERIENCIA,
  CONFIGURACION_RAREZA 
} from '../data/constantesJuego';

/**
 * Calcula los puntos obtenidos por capturar un pez
 * @param {Object} pez - Datos del pez capturado
 * @param {number} tiempoLucha - Tiempo en segundos que duró la lucha
 * @param {number} nivelJugador - Nivel actual del jugador
 * @returns {number} Puntos totales obtenidos
 */
export const calcularPuntosPorCaptura = (pez, tiempoLucha, nivelJugador) => {
  let puntosBase = pez.puntos;
  
  // Bonus por rareza
  const configRareza = CONFIGURACION_RAREZA[pez.rareza];
  if (configRareza) {
    puntosBase *= configRareza.multiplicadorPuntos;
  }
  
  // Bonus por tiempo de lucha (más tiempo = más puntos)
  const bonusTiempo = Math.floor(tiempoLucha * CONFIGURACION_PUNTUACION.MULTIPLICADOR_TIEMPO_LUCHA * puntosBase);
  
  // Bonus por peso del pez
  const bonusPeso = Math.floor(pez.pesoActual * CONFIGURACION_PUNTUACION.MULTIPLICADOR_PESO);
  
  // Bonus por longitud del pez
  const bonusLongitud = Math.floor(pez.longitudActual * CONFIGURACION_PUNTUACION.MULTIPLICADOR_LONGITUD);
  
  // Multiplicador de nivel (jugadores de mayor nivel obtienen más puntos)
  const multiplicadorNivel = 1 + (nivelJugador - 1) * 0.1;
  
  const puntosFinales = Math.floor((puntosBase + bonusTiempo + bonusPeso + bonusLongitud) * multiplicadorNivel);
  
  return Math.max(puntosFinales, pez.puntos); // Mínimo los puntos base del pez
};

/**
 * Calcula la experiencia obtenida por capturar un pez
 * @param {Object} pez - Datos del pez capturado
 * @param {number} tiempoLucha - Tiempo en segundos que duró la lucha
 * @returns {number} Experiencia total obtenida
 */
export const calcularExperienciaPorCaptura = (pez, tiempoLucha) => {
  let experienciaBase = CONFIGURACION_EXPERIENCIA.EXPERIENCIA_BASE_CAPTURA;
  
  // Bonus por dificultad del pez
  const bonusDificultad = pez.dificultad * CONFIGURACION_EXPERIENCIA.BONUS_EXPERIENCIA_DIFICULTAD;
  
  // Bonus por tiempo de lucha
  const bonusTiempo = Math.floor(tiempoLucha * CONFIGURACION_EXPERIENCIA.BONUS_EXPERIENCIA_TIEMPO);
  
  // Bonus por rareza
  const multiplicadoresRareza = {
    común: 1,
    raro: 1.5,
    épico: 2.5,
    legendario: 4
  };
  
  const multiplicadorRareza = multiplicadoresRareza[pez.rareza] || 1;
  
  return Math.floor((experienciaBase + bonusDificultad + bonusTiempo) * multiplicadorRareza);
};

/**
 * Calcula la experiencia requerida para el siguiente nivel
 * @param {number} nivelActual - Nivel actual del jugador
 * @returns {number} Experiencia requerida para el siguiente nivel
 */
export const calcularExperienciaRequerida = (nivelActual) => {
  return Math.floor(
    CONFIGURACION_EXPERIENCIA.EXPERIENCIA_POR_NIVEL * 
    Math.pow(CONFIGURACION_EXPERIENCIA.MULTIPLICADOR_NIVEL, nivelActual - 1)
  );
};

/**
 * Calcula la resistencia base de un pez según su dificultad y peso
 * @param {Object} datosPez - Información del pez
 * @returns {number} Resistencia calculada
 */
export const calcularResistenciaPez = (datosPez) => {
  const resistenciaBase = datosPez.dificultad * 8;
  const factorPeso = datosPez.pesoActual * 2;
  const factorComportamiento = {
    pasivo: 0.7,
    activo: 1.0,
    agresivo: 1.3,
    territorial: 1.1,
    nocturno: 1.2,
    rápido: 1.4,
    esquivo: 0.9
  };
  
  const multiplicador = factorComportamiento[datosPez.comportamiento] || 1.0;
  const variacionAleatoria = 0.8 + Math.random() * 0.4; // ±20% de variación
  
  return Math.floor((resistenciaBase + factorPeso) * multiplicador * variacionAleatoria);
};

/**
 * Calcula la fuerza de lucha de un pez
 * @param {Object} datosPez - Información del pez
 * @returns {number} Fuerza de lucha
 */
export const calcularFuerzaPez = (datosPez) => {
  const fuerzaBase = datosPez.dificultad * 0.5;
  const factorTamaño = Math.sqrt(datosPez.pesoActual) * 0.3;
  const variacionAleatoria = 0.7 + Math.random() * 0.6; // ±30% de variación
  
  return Math.max(0.5, (fuerzaBase + factorTamaño) * variacionAleatoria);
};

/**
 * Calcula la probabilidad de que un pez pique según diversos factores
 * @param {Object} parametros - Parámetros de la pesca
 * @returns {number} Probabilidad entre 0 y 1
 */
export const calcularProbabilidadPique = (parametros) => {
  const {
    profundidad,
    tiempoEspera,
    nivelJugador,
    tipoCarnada,
    horaDelDia,
    climaActual
  } = parametros;
  
  let probabilidadBase = 0.3; // 30% base
  
  // Factor profundidad (cada especie tiene su profundidad óptima)
  if (profundidad >= 50 && profundidad <= 80) {
    probabilidadBase += 0.2; // +20% en zona óptima
  }
  
  // Factor tiempo de espera (más tiempo = mayor probabilidad)
  const bonusTiempo = Math.min(tiempoEspera / 10000, 0.3); // Máximo 30% bonus
  probabilidadBase += bonusTiempo;
  
  // Factor nivel del jugador (experiencia mejora la pesca)
  const bonusNivel = Math.min(nivelJugador * 0.02, 0.2); // Máximo 20% bonus
  probabilidadBase += bonusNivel;
  
  // Factor carnada (cada pez prefiere cierta carnada)
  // Esto se calcularía según la efectividad de la carnada para cada especie
  if (tipoCarnada) {
    probabilidadBase += 0.1; // +10% por usar carnada adecuada
  }
  
  // Factor hora del día
  const factoresHora = {
    amanecer: 1.2,   // 6-8 AM
    mañana: 0.9,     // 8-12 PM
    mediodia: 0.7,   // 12-2 PM
    tarde: 1.0,      // 2-6 PM
    atardecer: 1.3,  // 6-8 PM
    noche: 1.1       // 8 PM-6 AM
  };
  
  probabilidadBase *= factoresHora[horaDelDia] || 1.0;
  
  // Factor clima
  const factoresClima = {
    soleado: 0.9,
    nublado: 1.1,
    lluvia: 1.2,
    tormenta: 0.6
  };
  
  probabilidadBase *= factoresClima[climaActual] || 1.0;
  
  return Math.min(Math.max(probabilidadBase, 0.1), 0.8); // Entre 10% y 80%
};

/**
 * Calcula el valor en dinero virtual de un pez capturado
 * @param {Object} pez - Datos del pez capturado
 * @returns {number} Valor en monedas del juego
 */
export const calcularValorPez = (pez) => {
  const valorBase = pez.puntos * 0.5; // 50% de los puntos como valor base
  const bonusPeso = pez.pesoActual * 10;
  const bonusRareza = {
    común: 1,
    raro: 2,
    épico: 4,
    legendario: 8
  };
  
  const multiplicador = bonusRareza[pez.rareza] || 1;
  
  return Math.floor((valorBase + bonusPeso) * multiplicador);
};

/**
 * Determina si un pez es un récord personal
 * @param {Object} pezActual - Pez recién capturado
 * @param {Array} historialPeces - Array de peces previamente capturados
 * @returns {Object} Información sobre récords batidos
 */
export const verificarRecords = (pezActual, historialPeces) => {
  const pezesDeEspecie = historialPeces.filter(p => p.id === pezActual.id);
  
  const records = {
    primerEspecie: pezesDeEspecie.length === 0,
    mayorPeso: true,
    mayorLongitud: true,
    menorTiempoLucha: true
  };
  
  if (pezesDeEspecie.length > 0) {
    const pesoMaximo = Math.max(...pezesDeEspecie.map(p => p.pesoActual));
    const longitudMaxima = Math.max(...pezesDeEspecie.map(p => p.longitudActual));
    const menorTiempo = Math.min(...pezesDeEspecie.map(p => p.tiempoLucha));
    
    records.mayorPeso = pezActual.pesoActual > pesoMaximo;
    records.mayorLongitud = pezActual.longitudActual > longitudMaxima;
    records.menorTiempoLucha = pezActual.tiempoLucha < menorTiempo;
  }
  
  return records;
};

/**
 * Calcula estadísticas detalladas del jugador
 * @param {Array} pezesCapturados - Array de todos los peces capturados
 * @returns {Object} Estadísticas completas
 */
export const calcularEstadisticasCompletas = (pezesCapturados) => {
  if (pezesCapturados.length === 0) {
    return {
      totalCapturas: 0,
      pesoTotal: 0,
      promedioTiempoLucha: 0,
      especiesUnicas: 0,
      pezMasGrande: null,
      pezMasPequeno: null,
      especiesMasCapturada: null,
      rarezaDistribucion: {}
    };
  }
  
  const totalCapturas = pezesCapturados.length;
  const pesoTotal = pezesCapturados.reduce((sum, pez) => sum + pez.pesoActual, 0);
  const tiempoTotalLucha = pezesCapturados.reduce((sum, pez) => sum + pez.tiempoLucha, 0);
  
  const especiesUnicas = [...new Set(pezesCapturados.map(pez => pez.id))].length;
  
  const pezMasGrande = pezesCapturados.reduce((mayor, pez) => 
    pez.pesoActual > mayor.pesoActual ? pez : mayor
  );
  
  const pezMasPequeno = pezesCapturados.reduce((menor, pez) => 
    pez.pesoActual < menor.pesoActual ? pez : menor
  );
  
  // Especie más capturada
  const conteoEspecies = {};
  pezesCapturados.forEach(pez => {
    conteoEspecies[pez.id] = (conteoEspecies[pez.id] || 0) + 1;
  });
  
  const especiesMasCapturada = Object.entries(conteoEspecies)
    .reduce((a, b) => conteoEspecies[a[0]] > conteoEspecies[b[0]] ? a : b)[0];
  
  // Distribución de rareza
  const rarezaDistribucion = {};
  pezesCapturados.forEach(pez => {
    rarezaDistribucion[pez.rareza] = (rarezaDistribucion[pez.rareza] || 0) + 1;
  });
  
  return {
    totalCapturas,
    pesoTotal: parseFloat(pesoTotal.toFixed(1)),
    promedioTiempoLucha: parseFloat((tiempoTotalLucha / totalCapturas).toFixed(1)),
    especiesUnicas,
    pezMasGrande,
    pezMasPequeno,
    especiesMasCapturada,
    rarezaDistribucion,
    promedioTamano: parseFloat((pesoTotal / totalCapturas).toFixed(1))
  };
};