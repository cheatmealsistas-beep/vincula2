// Gira y... - Ruleta Sensual
// 3 ruletas: Acción + Zona + Cómo
// 3 niveles de intensidad: suave, medio, picante

export type IntensityLevel = 'soft' | 'medium' | 'spicy';

export interface SpinOption {
  id: string;
  text: string;
  emoji: string;
  level: IntensityLevel; // Nivel mínimo en el que aparece
}

// === ACCIONES ===
// Todas deben funcionar con "X en [zona]" ej: "Besar en el cuello"
export const ACTIONS: SpinOption[] = [
  // Suave
  { id: 'a1', text: 'Acariciar', emoji: '🤚', level: 'soft' },
  { id: 'a2', text: 'Besar', emoji: '💋', level: 'soft' },
  { id: 'a3', text: 'Masajear', emoji: '💆', level: 'soft' },
  { id: 'a4', text: 'Soplar en', emoji: '💨', level: 'soft' },
  { id: 'a5', text: 'Susurrar cerca de', emoji: '🗣️', level: 'soft' },
  { id: 'a6', text: 'Rozar con los labios', emoji: '👄', level: 'soft' },
  { id: 'a7', text: 'Dar besitos en', emoji: '😚', level: 'soft' },
  { id: 'a8', text: 'Hacer cosquillas en', emoji: '🙆', level: 'soft' },

  // Medio
  { id: 'a9', text: 'Morder suavemente', emoji: '😬', level: 'medium' },
  { id: 'a10', text: 'Lamer', emoji: '👅', level: 'medium' },
  { id: 'a11', text: 'Besar intensamente', emoji: '😮', level: 'medium' },
  { id: 'a12', text: 'Recorrer con la lengua', emoji: '😘', level: 'medium' },
  { id: 'a13', text: 'Arañar suavemente', emoji: '💅', level: 'medium' },
  { id: 'a14', text: 'Frotar tu nariz en', emoji: '🫂', level: 'medium' },

  // Picante
  { id: 'a15', text: 'Morder', emoji: '🦷', level: 'spicy' },
  { id: 'a16', text: 'Besar apasionadamente', emoji: '🔥', level: 'spicy' },
  { id: 'a17', text: 'Explorar con las manos', emoji: '🙌', level: 'spicy' },
  { id: 'a18', text: 'Pellizcar suave', emoji: '🤏', level: 'spicy' },
];

// === ZONAS ===
export const ZONES: SpinOption[] = [
  // Suave
  { id: 'z1', text: 'las manos', emoji: '🤲', level: 'soft' },
  { id: 'z2', text: 'la espalda', emoji: '🔙', level: 'soft' },
  { id: 'z3', text: 'el cuello', emoji: '🦒', level: 'soft' },
  { id: 'z4', text: 'la frente', emoji: '😊', level: 'soft' },
  { id: 'z5', text: 'los hombros', emoji: '💪', level: 'soft' },
  { id: 'z6', text: 'los brazos', emoji: '🦾', level: 'soft' },
  { id: 'z7', text: 'el pelo', emoji: '💇', level: 'soft' },
  { id: 'z8', text: 'la mejilla', emoji: '😚', level: 'soft' },

  // Medio
  { id: 'z9', text: 'los labios', emoji: '💋', level: 'medium' },
  { id: 'z10', text: 'las orejas', emoji: '👂', level: 'medium' },
  { id: 'z11', text: 'la nuca', emoji: '✨', level: 'medium' },
  { id: 'z12', text: 'el vientre', emoji: '🌀', level: 'medium' },
  { id: 'z13', text: 'la cintura', emoji: '🎯', level: 'medium' },
  { id: 'z14', text: 'la clavícula', emoji: '💫', level: 'medium' },

  // Picante
  { id: 'z15', text: 'los muslos', emoji: '🦵', level: 'spicy' },
  { id: 'z16', text: 'la cadera', emoji: '🔥', level: 'spicy' },
  { id: 'z17', text: 'el pecho', emoji: '❤️', level: 'spicy' },
  { id: 'z18', text: 'donde tú quieras', emoji: '😏', level: 'spicy' },
];

// === CÓMO ===
// Zonas donde NO se puede mirar a los ojos (están detrás o requieren cerrar ojos)
const ZONES_NO_EYE_CONTACT = ['z7', 'z11']; // pelo, nuca

export const HOW: SpinOption[] = [
  // Suave
  { id: 'h1', text: 'muy despacio', emoji: '🐢', level: 'soft' },
  { id: 'h2', text: 'con los ojos cerrados', emoji: '😌', level: 'soft' },
  { id: 'h3', text: 'mientras susurras algo bonito', emoji: '💬', level: 'soft' },
  { id: 'h4', text: 'con mucha ternura', emoji: '🥰', level: 'soft' },
  { id: 'h5', text: 'mirándose a los ojos', emoji: '👀', level: 'soft' },
  { id: 'h6', text: 'en silencio', emoji: '🤫', level: 'soft' },

  // Medio
  { id: 'h7', text: 'con un hielo en la boca', emoji: '🧊', level: 'medium' },
  { id: 'h8', text: 'a oscuras', emoji: '🌑', level: 'medium' },
  { id: 'h9', text: 'alternando suave y fuerte', emoji: '🎭', level: 'medium' },
  { id: 'h10', text: 'con música de fondo', emoji: '🎵', level: 'medium' },
  { id: 'h11', text: 'por encima de la ropa', emoji: '👕', level: 'medium' },
  { id: 'h12', text: 'por debajo de la ropa', emoji: '🔥', level: 'medium' },

  // Picante
  { id: 'h13', text: 'hasta que pida más', emoji: '😈', level: 'spicy' },
  { id: 'h14', text: 'mientras describe lo que siente', emoji: '🗣️', level: 'spicy' },
  { id: 'h15', text: 'sin usar las manos', emoji: '🙅', level: 'spicy' },
  { id: 'h16', text: 'como si fuera la última vez', emoji: '💥', level: 'spicy' },
];

// Obtener opciones filtradas por nivel
export function getOptionsByLevel(options: SpinOption[], level: IntensityLevel): SpinOption[] {
  const levels: IntensityLevel[] = ['soft', 'medium', 'spicy'];
  const levelIndex = levels.indexOf(level);

  return options.filter(opt => {
    const optLevel = levels.indexOf(opt.level);
    return optLevel <= levelIndex;
  });
}

// Obtener combinación aleatoria con validación de compatibilidad
export function getRandomSpin(level: IntensityLevel): {
  action: SpinOption;
  zone: SpinOption;
  how: SpinOption;
} {
  const actions = getOptionsByLevel(ACTIONS, level);
  const zones = getOptionsByLevel(ZONES, level);
  const hows = getOptionsByLevel(HOW, level);

  const action = actions[Math.floor(Math.random() * actions.length)];
  const zone = zones[Math.floor(Math.random() * zones.length)];

  // Filtrar "cómos" incompatibles con la zona elegida
  let compatibleHows = hows;

  // Si la zona es nuca o pelo, no se puede "mirándose a los ojos"
  if (ZONES_NO_EYE_CONTACT.includes(zone.id)) {
    compatibleHows = hows.filter(h => h.id !== 'h5');
  }

  const how = compatibleHows[Math.floor(Math.random() * compatibleHows.length)];

  return { action, zone, how };
}

// Labels de niveles
export const LEVEL_LABELS: Record<IntensityLevel, string> = {
  soft: 'Suave',
  medium: 'Medio',
  spicy: 'Picante',
};

export const LEVEL_EMOJIS: Record<IntensityLevel, string> = {
  soft: '🌸',
  medium: '🔥',
  spicy: '🌶️',
};

export const LEVEL_COLORS: Record<IntensityLevel, string> = {
  soft: '#FFB5E8',
  medium: '#FFB347',
  spicy: '#FF6B6B',
};
