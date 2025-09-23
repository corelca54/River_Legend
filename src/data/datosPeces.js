// Base de datos completa de peces colombianos con imágenes reales
export const PECES_COLOMBIANOS = {
  bocachico: {
    id: 'bocachico',
    nombre: 'Bocachico',
    nombreCientifico: 'Prochilodus magdalenae',
  imagen: '/assets/imagenes/peces/Bocachico.png',
  imagenAlternativa: '/assets/imagenes/peces/Bocachico.png',
    rareza: 'común',
    dificultad: 3,
    pesoMin: 0.5,
    pesoMax: 3.0,
    longitudMin: 20,
    longitudMax: 40,
    habitat: 'Río Magdalena',
    region: 'Costa Caribe y Andina',
    puntos: 150,
    descripcion: 'Pez migratorio muy importante en la pesca artesanal colombiana. Su carne es muy apreciada.',
    color: '#C0C0C0',
    colorSecundario: '#E6E6FA',
    velocidadLucha: 1.2,
    resistencia: 0.8,
    sonidoCaptura: 'splash_pequeno',
    movimiento: 'zigzag',
    profundidadOptima: { min: 1, max: 5 },
    carnada: ['lombriz', 'masa', 'maíz'],
    temporadaOptima: 'Diciembre - Abril',
    estadoConservacion: 'Preocupación menor'
  },
  
  bagre_rayado: {
    id: 'bagre_rayado',
    nombre: 'Bagre Rayado',
    nombreCientifico: 'Pseudoplatystoma fasciatum',
  imagen: '/assets/imagenes/peces/Bagre rayado.png',
  imagenAlternativa: '/assets/imagenes/peces/Bagre rayado.png',
    rareza: 'raro',
    dificultad: 6,
    pesoMin: 5.0,
    pesoMax: 25.0,
    longitudMin: 50,
    longitudMax: 120,
    habitat: 'Río Orinoco y Amazonas',
    region: 'Orinoquía y Amazonía',
    puntos: 400,
    descripcion: 'Depredador de gran tamaño con distintivas rayas negras. Muy codiciado por pescadores deportivos.',
    color: '#F4A460',
    colorSecundario: '#DEB887',
    velocidadLucha: 1.8,
    resistencia: 1.5,
    sonidoCaptura: 'splash_grande',
    movimiento: 'violento',
    profundidadOptima: { min: 3, max: 15 },
    carnada: ['pescado vivo', 'camarón', 'carnada artificial'],
    temporadaOptima: 'Junio - Septiembre',
    estadoConservacion: 'Vulnerable'
  },

  arapaima: {
    id: 'arapaima',
    nombre: 'Arapaima',
    nombreCientifico: 'Arapaima gigas',
  imagen: '/assets/imagenes/peces/Arapaima.png',
  imagenAlternativa: '/assets/imagenes/peces/Arapaima.png',
    rareza: 'legendario',
    dificultad: 10,
    pesoMin: 50.0,
    pesoMax: 200.0,
    longitudMin: 150,
    longitudMax: 300,
    habitat: 'Amazonía Colombiana',
    region: 'Amazonía',
    puntos: 1000,
    descripcion: 'El gigante de agua dulce más grande del mundo. Respira aire y puede saltar fuera del agua.',
    color: '#B22222',
    colorSecundario: '#CD5C5C',
    velocidadLucha: 2.5,
    resistencia: 2.0,
    sonidoCaptura: 'splash_epico',
    movimiento: 'salvaje',
    profundidadOptima: { min: 2, max: 10 },
    carnada: ['pez grande', 'carnada viva'],
    temporadaOptima: 'Agosto - Noviembre',
    estadoConservacion: 'En peligro'
  },

  sabalo: {
    id: 'sabalo',
    nombre: 'Sábalo',
    nombreCientifico: 'Brycon moorei',
  imagen: '/assets/imagenes/peces/Sábalo (1).png',
  imagenAlternativa: '/assets/imagenes/peces/Sábalo (1).png',
    rareza: 'común',
    dificultad: 4,
    pesoMin: 1.0,
    pesoMax: 8.0,
    longitudMin: 25,
    longitudMax: 60,
    habitat: 'Ríos Andinos',
    region: 'Región Andina',
    puntos: 200,
    descripcion: 'Pez plateado con aletas de colores brillantes. Excelente para pesca deportiva.',
    color: '#FFD700',
    colorSecundario: '#FFA500',
    velocidadLucha: 1.5,
    resistencia: 1.0,
    sonidoCaptura: 'splash_mediano',
    movimiento: 'rapido',
    profundidadOptima: { min: 1, max: 8 },
    carnada: ['insectos', 'frutas', 'lombriz'],
    temporadaOptima: 'Marzo - Julio',
    estadoConservacion: 'Preocupación menor'
  },

  pavon: {
    id: 'pavon',
    nombre: 'Pavón',
    nombreCientifico: 'Cichla orinocensis',
  imagen: '/assets/imagenes/peces/Pavón.png',
  imagenAlternativa: '/assets/imagenes/peces/Pavón.png',
    rareza: 'épico',
    dificultad: 8,
    pesoMin: 3.0,
    pesoMax: 15.0,
    longitudMin: 40,
    longitudMax: 80,
    habitat: 'Río Orinoco',
    region: 'Orinoquía',
    puntos: 600,
    descripcion: 'Depredador agresivo conocido por sus saltos espectaculares. El rey de la pesca deportiva.',
    color: '#FFD700',
    colorSecundario: '#FF8C00',
    velocidadLucha: 2.0,
    resistencia: 1.8,
    sonidoCaptura: 'splash_grande',
    movimiento: 'agresivo',
    profundidadOptima: { min: 2, max: 12 },
    carnada: ['señuelos artificiales', 'peces pequeños'],
    temporadaOptima: 'Enero - Abril',
    estadoConservacion: 'Preocupación menor'
  },

  cachama: {
    id: 'cachama',
    nombre: 'Cachama',
    nombreCientifico: 'Piaractus brachypomus',
  imagen: '/assets/imagenes/peces/perca.png',
  imagenAlternativa: '/assets/imagenes/peces/perca.png',
    rareza: 'común',
    dificultad: 4,
    pesoMin: 2.0,
    pesoMax: 12.0,
    longitudMin: 30,
    longitudMax: 70,
    habitat: 'Ríos Orinoco y Amazonas',
    region: 'Orinoquía y Amazonía',
    puntos: 250,
    descripción: 'Pez robusto muy importante en la acuicultura colombiana. Omnívoro de gran resistencia.',
    color: '#4682B4',
    colorSecundario: '#87CEEB',
    velocidadLucha: 1.3,
    resistencia: 1.2,
    sonidoCaptura: 'splash_mediano',
    movimiento: 'firme',
    profundidadOptima: { min: 1, max: 6 },
    carnada: ['frutas', 'semillas', 'masa'],
    temporadaOptima: 'Todo el año',
    estadoConservacion: 'Preocupación menor'
  },

  mojarra: {
    id: 'mojarra',
    nombre: 'Mojarra Amarilla',
    nombreCientifico: 'Caquetaia kraussii',
  imagen: '/assets/imagenes/peces/trucha_mariposa.png',
  imagenAlternativa: '/assets/imagenes/peces/trucha_mariposa.png',
    rareza: 'común',
    dificultad: 2,
    pesoMin: 0.3,
    pesoMax: 2.0,
    longitudMin: 15,
    longitudMax: 35,
    habitat: 'Ríos y lagunas',
    region: 'Costa Caribe',
    puntos: 100,
    descripcion: 'Pez pequeño pero combativo. Ideal para principiantes en la pesca deportiva.',
    color: '#FFFF99',
    colorSecundario: '#FFFACD',
    velocidadLucha: 1.0,
    resistencia: 0.6,
    sonidoCaptura: 'splash_pequeno',
    movimiento: 'nervioso',
    profundidadOptima: { min: 0.5, max: 3 },
    carnada: ['lombriz', 'insectos', 'masa pequeña'],
    temporadaOptima: 'Todo el año',
    estadoConservacion: 'Preocupación menor'
  },

  dorado: {
    id: 'dorado',
    nombre: 'Dorado',
    nombreCientifico: 'Brycon sinuensis',
  imagen: '/assets/imagenes/peces/dorado.png',
  imagenAlternativa: '/assets/imagenes/peces/dorado.png',
    rareza: 'raro',
    dificultad: 7,
    pesoMin: 4.0,
    pesoMax: 18.0,
    longitudMin: 45,
    longitudMax: 90,
    habitat: 'Río Magdalena y afluentes',
    region: 'Región Andina',
    puntos: 500,
    descripcion: 'Pez dorado brillante con increíble fuerza. Realiza saltos impresionantes cuando es enganchado.',
    color: '#FFD700',
    colorSecundario: '#FFA500',
    velocidadLucha: 2.2,
    resistencia: 1.7,
    sonidoCaptura: 'splash_grande',
    movimiento: 'saltarin',
    profundidadOptima: { min: 2, max: 10 },
    carnada: ['peces pequeños', 'camarón', 'señuelos brillantes'],
    temporadaOptima: 'Febrero - Mayo',
    estadoConservacion: 'Vulnerable'
  }
};

// Función para obtener pez aleatorio con probabilidades por rareza
export const obtenerPezAleatorio = (nivelJugador = 1) => {
  const probabilidades = {
    común: 0.5,
    raro: 0.3,
    épico: 0.15,
    legendario: Math.min(0.05, nivelJugador * 0.01)
  };

  const random = Math.random();
  let acumulado = 0;
  let rarezaSeleccionada = 'común';

  for (const [rareza, prob] of Object.entries(probabilidades)) {
    acumulado += prob;
    if (random <= acumulado) {
      rarezaSeleccionada = rareza;
      break;
    }
  }

  // Filtrar peces por rareza
  const pecesPorRareza = Object.values(PECES_COLOMBIANOS).filter(
    pez => pez.rareza === rarezaSeleccionada
  );

  if (pecesPorRareza.length === 0) {
    // Fallback a común si no hay peces de esa rareza
    const pecesComunes = Object.values(PECES_COLOMBIANOS).filter(
      pez => pez.rareza === 'común'
    );
    return pecesComunes[Math.floor(Math.random() * pecesComunes.length)];
  }

  const pezSeleccionado = pecesPorRareza[Math.floor(Math.random() * pecesPorRareza.length)];
  
  // Generar características aleatorias del pez individual
  const peso = (
    Math.random() * (pezSeleccionado.pesoMax - pezSeleccionado.pesoMin) + 
    pezSeleccionado.pesoMin
  ).toFixed(2);
  
  const longitud = Math.floor(
    Math.random() * (pezSeleccionado.longitudMax - pezSeleccionado.longitudMin) + 
    pezSeleccionado.longitudMin
  );

  return {
    ...pezSeleccionado,
    peso: parseFloat(peso),
    longitud,
    fechaCaptura: new Date().toISOString(),
    multiplicadorTamaño: 0.8 + (Math.random() * 0.4), // 0.8 - 1.2
    id: `${pezSeleccionado.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// Configuración de colores por rareza
export const COLORES_RAREZA = {
  común: {
    background: '#90EE90',
    border: '#32CD32',
    text: '#006400'
  },
  raro: {
    background: '#87CEEB',
    border: '#4682B4',
    text: '#000080'
  },
  épico: {
    background: '#DDA0DD',
    border: '#9370DB',
    text: '#4B0082'
  },
  legendario: {
    background: '#FFD700',
    border: '#FFA500',
    text: '#B8860B'
  }
};

export default PECES_COLOMBIANOS;