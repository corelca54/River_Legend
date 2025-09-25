/**
 * constantesJuego.js - Constantes y configuración del juego
 * Centraliza todos los valores configurables del sistema de pesca
 */

// Estados del juego
export const ESTADOS_JUEGO = {
  ESPERANDO: 'esperando',
  LANZANDO: 'lanzando',
  PESCANDO: 'pescando',
  LUCHANDO: 'luchando',
  CAPTURADO: 'capturado',
  PERDIDO: 'perdido',
  PAUSA: 'pausa'
};

// Configuración de mecánicas de pesca
export const CONFIGURACION_PESCA = {
  // Tensión del sedal
  TENSION_MAXIMA: 100,
  TENSION_CRITICA: 85,
  REDUCCION_TENSION_RECOGER: 15,
  REDUCCION_TENSION_SOLTAR: 25,
  INCREMENTO_TENSION_BASE: 2,
  
  // Profundidad
  PROFUNDIDAD_MAXIMA: 100,
  VELOCIDAD_HUNDIMIENTO: 2,
  VELOCIDAD_RECOGIDA: 5,
  
  // Tiempo de lanzamiento
  TIEMPO_LANZAMIENTO: 500, // 0.5 segundos (para testing rápido)
  TIEMPO_ESPERA_MINIMO: 500, // 0.5 segundos (para testing rápido)
  TIEMPO_ESPERA_MAXIMO: 1500, // 1.5 segundos (para testing rápido)
  
  // Lucha con peces
  RESISTENCIA_BASE_PEZ: 150,
  FACTOR_CANSANCIO: 0.15,
  PROBABILIDAD_LUCHA: 0.3,
  
  // Animaciones
  VELOCIDAD_ANIMACION_PEZ: 200, // ms
  ROTACION_MAXIMA_PEZ: 20, // grados
  ESCALA_LUCHA_PEZ: 0.2
};

// Sistema de experiencia y niveles
export const CONFIGURACION_EXPERIENCIA = {
  EXPERIENCIA_POR_NIVEL: 100,
  MULTIPLICADOR_NIVEL: 1.2,
  EXPERIENCIA_BASE_CAPTURA: 10,
  BONUS_EXPERIENCIA_TIEMPO: 1, // por segundo de lucha
  BONUS_EXPERIENCIA_DIFICULTAD: 5 // por punto de dificultad
};

// Sistema de puntuación
export const CONFIGURACION_PUNTUACION = {
  MULTIPLICADOR_TIEMPO_LUCHA: 0.1,
  MULTIPLICADOR_PESO: 10,
  MULTIPLICADOR_LONGITUD: 2,
  BONUS_PRIMERA_CAPTURA: 500,
  BONUS_RACHA_CAPTURAS: 50 // por captura consecutiva
};

// Configuración de interfaz
export const CONFIGURACION_UI = {
  TIEMPO_MOSTRAR_INFO_PEZ: 5000, // 5 segundos
  TIEMPO_MENSAJE_ESTADO: 2000, // 2 segundos
  INTERVALO_ACTUALIZACION: 100, // 100ms
  
  // Colores de tensión
  COLORES_TENSION: {
    BAJA: '#4CAF50', // Verde
    MEDIA: '#FF9800', // Naranja
    ALTA: '#F44336'  // Rojo
  },
  
  // Umbrales de tensión
  UMBRAL_TENSION_MEDIA: 30,
  UMBRAL_TENSION_ALTA: 60
};

// Sonidos del juego (rutas)
export const RUTAS_SONIDOS = {
  LANZAMIENTO: '/sonidos/lanzamiento.mp3',
  AGUA_CHAPUZÓN: '/sonidos/agua_chapuzon.mp3',
  PEZ_LUCHA: '/sonidos/pez_lucha.mp3',
  CARRETE_RECOGIDA: '/sonidos/carrete_recogida.mp3',
  CAPTURA_EXITOSA: '/sonidos/captura_exitosa.mp3',
  SEDAL_ROTO: '/sonidos/sedal_roto.mp3',
  INTERFAZ_CLICK: '/sonidos/click_interfaz.mp3',
  MUSICA_FONDO: '/sonidos/musica_ambiente.mp3'
};

// Configuración de ríos/escenarios
export const ESCENARIOS_PESCA = {
  magdalena: {
    nombre: "Río Magdalena",
    descripcion: "El río más importante de Colombia",
    dificultad: "media",
    pecesPredominantes: ["bocachico", "bagre", "nicuro", "mojarra"],
    multiplicadorPuntos: 1.0,
    colorAgua: "#4682B4"
  },
  amazonas: {
    nombre: "Río Amazonas",
    descripcion: "El río más caudaloso del mundo",
    dificultad: "alta",
  pecesPredominantes: ["bagre", "pavon"],
    multiplicadorPuntos: 1.5,
    colorAgua: "#2F4F4F"
  },
  orinoco: {
    nombre: "Río Orinoco",
    descripcion: "Cuenca rica en biodiversidad",
    dificultad: "alta",
    pecesPredominantes: ["pavon", "azulejo", "bagre"],
    multiplicadorPuntos: 1.3,
    colorAgua: "#556B2F"
  },
  cauca: {
    nombre: "Río Cauca",
    descripcion: "Importante afluente del Magdalena",
    dificultad: "media",
    pecesPredominantes: ["sabaleta", "sabalo", "mojarra"],
    multiplicadorPuntos: 1.1,
    colorAgua: "#4682B4"
  }
};

// Tipos de carnada/cebo
export const TIPOS_CARNADA = {
  lombriz: {
    nombre: "Lombriz de Tierra",
    efectividad: {
      bocachico: 0.9,
      nicuro: 0.8,
      mojarra: 0.7,
      corroncho: 0.6
    },
    precio: 50,
    descripcion: "Carnada universal, efectiva para peces de fondo"
  },
  maiz: {
    nombre: "Maíz Amarillo",
    efectividad: {
      bocachico: 0.8,
      sabalo: 0.7,
      sabaleta: 0.6
    },
    precio: 30,
    descripcion: "Ideal para peces herbívoros y omnívoros"
  },
  pezVivo: {
    nombre: "Pez Vivo",
    efectividad: {
  // arapaima: 0.9, (eliminado porque ya no existe)
      pavon: 0.8,
      bagre: 0.7,
      azulejo: 0.6
    },
    precio: 200,
    descripcion: "La mejor opción para grandes depredadores"
  },
  camaron: {
    nombre: "Camarón de Río",
    efectividad: {
      bagre: 0.8,
      nicuro: 0.7,
      mojarra: 0.6,
      sabalo: 0.5
    },
    precio: 100,
    descripcion: "Excelente para bagres y peces de tamaño medio"
  }
};

// Configuración de rareza y probabilidades
export const CONFIGURACION_RAREZA = {
  común: {
    probabilidad: 0.6,
    multiplicadorPuntos: 1,
    colorRareza: "#90EE90"
  },
  raro: {
    probabilidad: 0.25,
    multiplicadorPuntos: 1.5,
    colorRareza: "#87CEEB"
  },
  épico: {
    probabilidad: 0.12,
    multiplicadorPuntos: 2.5,
    colorRareza: "#DDA0DD"
  },
  legendario: {
    probabilidad: 0.03,
    multiplicadorPuntos: 5,
    colorRareza: "#FFD700"
  }
};

// Configuración de logros
export const LOGROS_JUEGO = {
  primerCaptura: {
    id: "primer_captura",
    nombre: "Primera Captura",
    descripcion: "Captura tu primer pez",
    recompensa: 100,
    tipo: "bronze"
  },
  maestroPescador: {
    id: "maestro_pescador",
    nombre: "Maestro Pescador",
    descripcion: "Captura 100 peces",
    recompensa: 1000,
    tipo: "gold"
  },
  // Eliminado logro de Arapaima
  coleccionistaCompleto: {
    id: "coleccionista_completo",
    nombre: "Coleccionista Completo",
    descripcion: "Captura al menos un pez de cada especie",
    recompensa: 2000,
    tipo: "legendary"
  }
};

// Configuración de dificultad
export const NIVELES_DIFICULTAD = {
  principiante: {
    nombre: "Principiante",
    multiplicadorTension: 0.7,
    tiempoEsperaExtra: 2000,
    ayudaVisual: true
  },
  intermedio: {
    nombre: "Intermedio",
    multiplicadorTension: 1.0,
    tiempoEsperaExtra: 0,
    ayudaVisual: false
  },
  experto: {
    nombre: "Experto",
    multiplicadorTension: 1.3,
    tiempoEsperaExtra: -1000,
    ayudaVisual: false
  },
  maestro: {
    nombre: "Maestro",
    multiplicadorTension: 1.5,
    tiempoEsperaExtra: -2000,
    ayudaVisual: false
  }
};

// Configuración responsiva
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1440
};

// Configuración de almacenamiento local
export const CLAVES_STORAGE = {
  PROGRESO_JUGADOR: 'pesca_colombia_progreso',
  CONFIGURACIONES: 'pesca_colombia_config',
  PECES_CAPTURADOS: 'pesca_colombia_peces',
  LOGROS: 'pesca_colombia_logros',
  ESTADISTICAS: 'pesca_colombia_stats'
};

// Mensajes del juego
export const MENSAJES_JUEGO = {
  LANZANDO: "Lanzando señuelo al río...",
  ESPERANDO: "Esperando que pique un pez... 🎣",
  LUCHANDO: "¡Un pez está luchando!",
  CAPTURADO: "¡Excelente captura!",
  PERDIDO: "¡El pez se escapó! 💔",
  SEDAL_ROTO: "¡Se rompió el sedal! 💔",
  NIVEL_SUBIDO: "¡Felicidades! Has subido de nivel",
  NUEVO_LOGRO: "¡Nuevo logro desbloqueado!"
};