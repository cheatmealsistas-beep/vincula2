// Nuestra Historia - Fusión de Timeline + Cartas del Tiempo
// Viaje temporal: comienzos, crecimiento, desafíos, alegría, presente, futuro

export interface TimelinePrompt {
  id: string;
  prompt: string;
  category: 'beginning' | 'growth' | 'challenges' | 'joy' | 'present' | 'future';
  emoji: string;
}

export const TIMELINE_PROMPTS: TimelinePrompt[] = [
  // === COMIENZOS ===
  {
    id: 'tl-1',
    prompt: '¿Cuál fue tu primera impresión de mí?',
    category: 'beginning',
    emoji: '👀',
  },
  {
    id: 'tl-2',
    prompt: '¿En qué momento supiste que esto era especial?',
    category: 'beginning',
    emoji: '✨',
  },
  {
    id: 'tl-3',
    prompt: '¿Cuál fue nuestra primera cita o momento a solas?',
    category: 'beginning',
    emoji: '💕',
  },
  {
    id: 'tl-4',
    prompt: '¿Qué momento de nuestros inicios te gustaría revivir?',
    category: 'beginning',
    emoji: '⏮️',
  },

  // === CRECIMIENTO ===
  {
    id: 'tl-5',
    prompt: '¿Qué hemos aprendido juntos que no habríamos aprendido solos?',
    category: 'growth',
    emoji: '🌱',
  },
  {
    id: 'tl-6',
    prompt: '¿En qué momento sentiste que nuestra relación se hizo más profunda?',
    category: 'growth',
    emoji: '🔗',
  },
  {
    id: 'tl-7',
    prompt: '¿Qué costumbre o tradición hemos creado juntos?',
    category: 'growth',
    emoji: '🏠',
  },
  {
    id: 'tl-8',
    prompt: '¿En qué sientes que hemos crecido como pareja?',
    category: 'growth',
    emoji: '🌳',
  },

  // === DESAFÍOS SUPERADOS ===
  {
    id: 'tl-9',
    prompt: '¿Qué obstáculo superamos juntos que nos hizo más fuertes?',
    category: 'challenges',
    emoji: '💪',
  },
  {
    id: 'tl-10',
    prompt: '¿Qué discusión o momento difícil nos hizo crecer?',
    category: 'challenges',
    emoji: '🌧️',
  },
  {
    id: 'tl-11',
    prompt: '¿Cuándo sentiste que realmente me necesitabas?',
    category: 'challenges',
    emoji: '🤝',
  },
  {
    id: 'tl-12',
    prompt: '¿Qué harías diferente si pudieras volver atrás?',
    category: 'challenges',
    emoji: '🔄',
  },

  // === MOMENTOS DE ALEGRÍA ===
  {
    id: 'tl-13',
    prompt: '¿Cuál es el momento más divertido que hemos vivido?',
    category: 'joy',
    emoji: '😂',
  },
  {
    id: 'tl-14',
    prompt: '¿Qué viaje o aventura nunca olvidarás?',
    category: 'joy',
    emoji: '✈️',
  },
  {
    id: 'tl-15',
    prompt: '¿Cuándo te has sentido más orgulloso/a de nosotros?',
    category: 'joy',
    emoji: '🏆',
  },
  {
    id: 'tl-16',
    prompt: '¿Cuál es tu recuerdo más tierno de nosotros?',
    category: 'joy',
    emoji: '🥹',
  },

  // === PRESENTE ===
  {
    id: 'tl-17',
    prompt: '¿Qué es lo que más valoras de nuestra relación hoy?',
    category: 'present',
    emoji: '💝',
  },
  {
    id: 'tl-18',
    prompt: '¿Qué pequeño detalle del día a día te hace feliz?',
    category: 'present',
    emoji: '☀️',
  },
  {
    id: 'tl-19',
    prompt: '¿En qué área de nuestra relación podemos mejorar?',
    category: 'present',
    emoji: '🌱',
  },
  {
    id: 'tl-20',
    prompt: '¿Qué palabra define lo que sientes ahora mismo?',
    category: 'present',
    emoji: '💭',
  },

  // === FUTURO ===
  {
    id: 'tl-21',
    prompt: '¿Dónde nos ves dentro de 5 años?',
    category: 'future',
    emoji: '🔮',
  },
  {
    id: 'tl-22',
    prompt: '¿Qué aventura te gustaría vivir conmigo?',
    category: 'future',
    emoji: '🗺️',
  },
  {
    id: 'tl-23',
    prompt: '¿Qué tradición te gustaría que creáramos juntos?',
    category: 'future',
    emoji: '🎄',
  },
  {
    id: 'tl-24',
    prompt: '¿Cuál es tu mayor sueño para nosotros?',
    category: 'future',
    emoji: '⭐',
  },
  {
    id: 'tl-25',
    prompt: '¿Qué promesa te gustaría hacerme para el futuro?',
    category: 'future',
    emoji: '🤞',
  },
];

// Obtener prompts balanceados por categoría
export function getRandomTimelinePrompts(count: number = 5): TimelinePrompt[] {
  const categories: TimelinePrompt['category'][] = ['beginning', 'growth', 'challenges', 'joy', 'present', 'future'];
  const selected: TimelinePrompt[] = [];

  // Primero uno de cada categoría (si hay espacio)
  for (const cat of categories) {
    if (selected.length >= count) break;
    const catPrompts = TIMELINE_PROMPTS.filter(p => p.category === cat);
    const random = catPrompts[Math.floor(Math.random() * catPrompts.length)];
    if (random) selected.push(random);
  }

  // Si necesitamos más, añadir aleatorios
  while (selected.length < count) {
    const remaining = TIMELINE_PROMPTS.filter(p => !selected.includes(p));
    if (remaining.length === 0) break;
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    selected.push(random);
  }

  return selected.sort(() => Math.random() - 0.5).slice(0, count);
}

// Colores por categoría
export const CATEGORY_COLORS = {
  beginning: '#FFB5E8',  // Rosa suave
  growth: '#B5DEFF',     // Azul cielo
  challenges: '#9D8DF1', // Lavanda
  joy: '#FFD700',        // Dorado
  present: '#FF4081',    // Coral
  future: '#4ECDC4',     // Turquesa
} as const;

export const CATEGORY_LABELS = {
  beginning: 'Comienzos',
  growth: 'Crecimiento',
  challenges: 'Desafíos',
  joy: 'Alegría',
  present: 'Presente',
  future: 'Futuro',
} as const;

export const CATEGORY_EMOJIS = {
  beginning: '💫',
  growth: '🌱',
  challenges: '💪',
  joy: '😊',
  present: '💝',
  future: '🔮',
} as const;
