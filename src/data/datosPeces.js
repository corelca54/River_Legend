/**
 * datosPeces.js - Base de datos completa de peces colombianos
 * Información científica y características de cada especie
 */

export const PECES_COLOMBIANOS = {
  bocachico: {
    id: 'bocachico',
    nombre: "Bocachico",
    nombreCientifico: "Prochilodus magdalenae",
    familia: "Prochilodontidae",
    peso: { minimo: 0.8, maximo: 2.5 }, // kg
    longitud: { minimo: 25, maximo: 45 }, // cm
    dificultad: 2, // 1-10 escala
    rareza: "común", // común, raro, épico, legendario
    habitat: "Río Magdalena, Río Cauca, Río Sinú",
    descripcion: "Pez migratorio fundamental en la pesca artesanal colombiana. Especie endémica de gran importancia comercial y cultural.",
    puntos: 150,
    color: "#DAA520",
    comportamiento: "activo",
    imagen: "/assets/imagenes/peces/Bocachico.png", // <--- CORREGIDO
    temporadaOptima: "Marzo - Mayo",
    profundidadOptima: { minima: 1, maxima: 8 }, // metros
    carnada: ["lombriz", "maíz", "yuca"],
    estadoConservacion: "Vulnerable"
  },

  arapaima: {
    id: 'arapaima',
    nombre: "Arapaima",
    nombreCientifico: "Arapaima gigas",
    familia: "Arapaimidae",
    peso: { minimo: 15, maximo: 120 },
    longitud: { minimo: 120, maximo: 250 },
    dificultad: 9,
    rareza: "legendario",
    habitat: "Río Amazonas, Río Putumayo, Río Caquetá",
    descripcion: "El gigante de agua dulce más grande de Sudamérica. Conocido como el 'bacalao del Amazonas', puede vivir hasta 20 años.",
    puntos: 2500,
    color: "#8B0000",
    comportamiento: "territorial",
    imagen: "/assets/imagenes/peces/Arapaima.png", // <--- CORREGIDO (y asegúrate de mover la imagen a public/assets/images/peces/)
    temporadaOptima: "Junio - Agosto",
    profundidadOptima: { minima: 3, maxima: 15 },
    carnada: ["pez vivo", "camarón", "rana"],
    estadoConservacion: "En Peligro"
  },

  bagre: {
    id: 'bagre',
    nombre: "Bagre Rayado",
    nombreCientifico: "Pseudoplatystoma fasciatum",
    familia: "Pimelodidae",
    peso: { minimo: 3, maximo: 25 },
    longitud: { minimo: 60, maximo: 140 },
    dificultad: 6,
    rareza: "raro",
    habitat: "Río Magdalena, Río Orinoco, Río Meta",
    descripcion: "Depredador nocturno con distintivas rayas negras. Muy apreciado por su carne y por la lucha que ofrece.",
    puntos: 900,
    color: "#696969",
    comportamiento: "nocturno",
    imagen: "/assets/imagenes/peces/Bagre rayado.png", // <--- CORREGIDO
    temporadaOptima: "Diciembre - Febrero",
    profundidadOptima: { minima: 5, maxima: 20 },
    carnada: ["pescado", "camarón", "lombriz"],
    estadoConservacion: "Preocupación Menor"
  },

  sabalo: {
    id: 'sabalo',
    nombre: "Sábalo",
    nombreCientifico: "Brycon moorei",
    familia: "Bryconidae",
    peso: { minimo: 1.2, maximo: 5 },
    longitud: { minimo: 30, maximo: 70 },
    dificultad: 4,
    rareza: "común",
    habitat: "Río Magdalena, Río Atrato, Río Cauca",
    descripcion: "Pez de aguas rápidas muy valorado comercialmente. Excelente para pesca deportiva por su fuerza y velocidad.",
    puntos: 400,
    color: "#C0C0C0",
    comportamiento: "rápido",
    imagen: "/assets/imagenes/peces/Sábalo.png", // <--- CORREGIDO
    temporadaOptima: "Abril - Junio",
    profundidadOptima: { minima: 2, maxima: 12 },
    carnada: ["insectos", "frutas", "gusanos"],
    estadoConservacion: "Vulnerable"
  },

  sabaleta: {
    id: 'sabaleta',
    nombre: "Sabaleta",
    nombreCientifico: "Brycon henni",
    familia: "Bryconidae",
    peso: { minimo: 0.5, maximo: 2 },
    longitud: { minimo: 20, maximo: 40 },
    dificultad: 3,
    rareza: "común",
    habitat: "Río Cauca, afluentes andinos, quebradas de montaña",
    descripcion: "Pez endémico de Colombia, muy apreciado localmente. Importante en la pesca artesanal de las regiones andinas.",
    puntos: 250,
    color: "#F0E68C",
    comportamiento: "esquivo",
    imagen: "/assets/imagenes/peces/Sabaleta.png", // <--- CORREGIDO
    temporadaOptima: "Septiembre - Noviembre",
    profundidadOptima: { minima: 1, maxima: 6 },
    carnada: ["moscas", "pequeños peces", "larvas"],
    estadoConservacion: "En Peligro Crítico"
  },

  nicuro: {
    id: 'nicuro',
    nombre: "Nicuro",
    nombreCientifico: "Pimelodus grosskopfii",
    familia: "Pimelodidae",
    peso: { minimo: 0.8, maximo: 4 },
    longitud: { minimo: 25, maximo: 60 },
    dificultad: 3,
    rareza: "común",
    habitat: "Río Magdalena, Río Cauca, ciénagas",
    descripcion: "Bagre de tamaño medio, resistente luchador. Muy común en ciénagas y remansos del río Magdalena.",
    puntos: 300,
    color: "#708090",
    comportamiento: "territorial",
    imagen: "/assets/imagenes/peces/dorado.png", // <--- CORREGIDO
    temporadaOptima: "Todo el año",
    profundidadOptima: { minima: 2, maxima: 10 },
    carnada: ["lombriz", "camarón", "masa"],
    estadoConservacion: "Preocupación Menor"
  },

  corroncho: {
    id: 'corroncho',
    nombre: "Corroncho",
    nombreCientifico: "Chaetostoma fischeri",
    familia: "Loricariidae",
    peso: { minimo: 0.3, maximo: 1 },
    longitud: { minimo: 15, maximo: 30 },
    dificultad: 1,
    rareza: "común",
    habitat: "Río Magdalena, tributarios, aguas rocosas",
    descripcion: "Pequeño pez de fondo, limpiador natural. Importante en el ecosistema acuático como controlador de algas.",
    puntos: 150,
    color: "#A0522D",
    comportamiento: "pasivo",
    imagen: "/assets/imagenes/peces/Bocachico.png", // <--- CORREGIDO (usando Bocachico, asegúrate de que sea intencional)
    temporadaOptima: "Julio - Septiembre",
    profundidadOptima: { minima: 0.5, maxima: 5 },
    carnada: ["algas", "materia vegetal", "pequeños invertebrados"],
    estadoConservacion: "Preocupación Menor"
  },

  azulejo: {
    id: 'azulejo',
    nombre: "Azulejo",
    nombreCientifico: "Crenicichla lugubris",
    familia: "Cichlidae",
    peso: { minimo: 0.4, maximo: 1.5 },
    longitud: { minimo: 18, maximo: 35 },
    dificultad: 2,
    rareza: "común",
    habitat: "Río Orinoco, Río Meta, Río Guaviare",
    descripcion: "Cíclido territorial con colores vibrantes. Muy agresivo durante la época reproductiva.",
    puntos: 200,
    color: "#4169E1",
    comportamiento: "agresivo",
    imagen: "/assets/imagenes/peces/Perca.png", // <--- CORREGIDO
    temporadaOptima: "Enero - Marzo",
    profundidadOptima: { minima: 1, maxima: 8 },
    carnada: ["pequeños peces", "insectos", "crustáceos"],
    estadoConservacion: "Preocupación Menor"
  },

  pavon: {
    id: 'pavon',
    nombre: "Pavón",
    nombreCientifico: "Cichla orinocensis",
    familia: "Cichlidae",
    peso: { minimo: 2, maximo: 12 },
    longitud: { minimo: 40, maximo: 90 },
    dificultad: 7,
    rareza: "épico",
    habitat: "Río Orinoco, Río Guaviare, Río Vichada",
    descripcion: "Depredador agresivo muy valorado por pescadores deportivos. Conocido por sus saltos espectaculares.",
    puntos: 1500,
    color: "#FFD700",
    comportamiento: "agresivo",
    imagen: "/assets/imagenes/peces/Pavón.png", // <--- CORREGIDO
    temporadaOptima: "Febrero - Abril",
    profundidadOptima: { minima: 2, maxima: 15 },
    carnada: ["señuelos", "peces vivos", "camarones"],
    estadoConservacion: "Preocupación Menor"
  },

  mojarra: {
    id: 'mojarra',
    nombre: "Mojarra Amarilla",
    nombreCientifico: "Caquetaia kraussii",
    familia: "Cichlidae",
    peso: { minimo: 0.6, maximo: 2.5 },
    longitud: { minimo: 22, maximo: 45 },
    dificultad: 2,
    rareza: "común",
    habitat: "Río Magdalena, Río Cauca, ciénagas costeras",
    descripcion: "Cíclido endémico muy importante en la pesca artesanal. Adaptable a diferentes condiciones de agua.",
    puntos: 280,
    color: "#FFE4B5",
    comportamiento: "territorial",
    imagen: "/assets/imagenes/peces/trucha_mariposa.png", // <--- CORREGIDO (usando trucha_mariposa, asegúrate de que sea intencional)
    temporadaOptima: "Mayo - Julio",
    profundidadOptima: { minima: 1, maxima: 10 },
    carnada: ["lombrices", "masa", "pequeños peces"],
    estadoConservacion: "Vulnerable"
  }
};

// Función para obtener peces por rareza
export const obtenerPecesPorRareza = (rareza) => {
  return Object.values(PECES_COLOMBIANOS).filter(pez => pez.rareza === rareza);
};

// Función para obtener pez aleatorio
export const obtenerPezAleatorio = (nivelJugador = 1) => {
  const peces = Object.keys(PECES_COLOMBIANOS);
  const factorNivel = Math.min(nivelJugador / 10, 1);
  
  // Configuración de rareza local (evitar importación circular)
  const probabilidades = {
    común: 0.6,
    raro: 0.25,
    épico: 0.12,
    legendario: 0.03
  };
  
  // Ajustar probabilidades según nivel
  probabilidades.raro += factorNivel * 0.1;
  probabilidades.épico += factorNivel * 0.05;
  probabilidades.legendario += factorNivel * 0.02;
  
  const numeroAleatorio = Math.random();
  let acumulado = 0;
  
  for (const [rareza, prob] of Object.entries(probabilidades)) {
    acumulado += prob;
    if (numeroAleatorio <= acumulado) {
      const pecesTipo = obtenerPecesPorRareza(rareza);
      if (pecesTipo.length > 0) {
        const pezSeleccionado = pecesTipo[Math.floor(Math.random() * pecesTipo.length)];
        return generarInstanciaPez(pezSeleccionado);
      }
    }
  }
  
  // Fallback: pez común aleatorio
  const pezId = peces[Math.floor(Math.random() * peces.length)];
  return generarInstanciaPez(PECES_COLOMBIANOS[pezId]);
};

// Función para generar una instancia específica de un pez con valores aleatorios
export const generarInstanciaPez = (datosPez) => {
  const pesoActual = (
    Math.random() * (datosPez.peso.maximo - datosPez.peso.minimo) + 
    datosPez.peso.minimo
  ).toFixed(1);
  
  const longitudActual = Math.floor(
    Math.random() * (datosPez.longitud.maximo - datosPez.longitud.minimo) + 
    datosPez.longitud.minimo
  );
  
  return {
    ...datosPez,
    pesoActual: parseFloat(pesoActual),
    longitudActual,
    resistencia: datosPez.dificultad * 8 + Math.random() * 25,
    fuerza: Math.random() * datosPez.dificultad + 0.5,
    tiempoCaptura: Date.now(),
    id: `${datosPez.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};