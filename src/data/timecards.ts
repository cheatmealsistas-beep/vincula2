// Cartas del Tiempo - Reflexiones sobre pasado, presente y futuro como pareja

export interface TimeCard {
  id: string;
  prompt: string;
  timeframe: 'past' | 'present' | 'future';
  emoji: string;
}

export const TIME_CARDS: TimeCard[] = [
  // Pasado - Reflexiones sobre el camino recorrido
  {
    id: 'tc-1',
    prompt: '¿Qué momento de nuestra relación te gustaría revivir?',
    timeframe: 'past',
    emoji: '⏮️',
  },
  {
    id: 'tc-2',
    prompt: '¿Cuál fue el momento en que supiste que esto era especial?',
    timeframe: 'past',
    emoji: '✨',
  },
  {
    id: 'tc-3',
    prompt: '¿Qué obstáculo superamos juntos que nos hizo más fuertes?',
    timeframe: 'past',
    emoji: '💪',
  },
  {
    id: 'tc-4',
    prompt: '¿Cuál es tu recuerdo más tierno de nosotros?',
    timeframe: 'past',
    emoji: '🥹',
  },
  {
    id: 'tc-5',
    prompt: '¿Qué harías diferente si pudieras volver atrás?',
    timeframe: 'past',
    emoji: '🔄',
  },

  // Presente - El aquí y ahora
  {
    id: 'tc-6',
    prompt: '¿Qué es lo que más valoras de nuestra relación hoy?',
    timeframe: 'present',
    emoji: '💝',
  },
  {
    id: 'tc-7',
    prompt: '¿Qué pequeño detalle del día a día te hace feliz?',
    timeframe: 'present',
    emoji: '☀️',
  },
  {
    id: 'tc-8',
    prompt: '¿En qué área de nuestra relación podemos mejorar?',
    timeframe: 'present',
    emoji: '🌱',
  },
  {
    id: 'tc-9',
    prompt: '¿Qué palabra define lo que sientes ahora mismo por mí?',
    timeframe: 'present',
    emoji: '💭',
  },
  {
    id: 'tc-10',
    prompt: '¿Qué es lo que más te gusta de cómo somos juntos?',
    timeframe: 'present',
    emoji: '🤝',
  },

  // Futuro - Sueños y proyecciones
  {
    id: 'tc-11',
    prompt: '¿Dónde nos ves dentro de 5 años?',
    timeframe: 'future',
    emoji: '🔮',
  },
  {
    id: 'tc-12',
    prompt: '¿Qué aventura te gustaría vivir conmigo?',
    timeframe: 'future',
    emoji: '🗺️',
  },
  {
    id: 'tc-13',
    prompt: '¿Qué tradición te gustaría que creáramos juntos?',
    timeframe: 'future',
    emoji: '🎄',
  },
  {
    id: 'tc-14',
    prompt: '¿Cuál es tu mayor sueño para nosotros?',
    timeframe: 'future',
    emoji: '⭐',
  },
  {
    id: 'tc-15',
    prompt: '¿Qué promesa te gustaría hacerme para el futuro?',
    timeframe: 'future',
    emoji: '🤞',
  },
];

// Obtener cartas aleatorias balanceadas (pasado, presente, futuro)
export function getRandomTimeCards(count: number = 6): TimeCard[] {
  const perTimeframe = Math.ceil(count / 3);

  const past = TIME_CARDS.filter(c => c.timeframe === 'past')
    .sort(() => Math.random() - 0.5)
    .slice(0, perTimeframe);

  const present = TIME_CARDS.filter(c => c.timeframe === 'present')
    .sort(() => Math.random() - 0.5)
    .slice(0, perTimeframe);

  const future = TIME_CARDS.filter(c => c.timeframe === 'future')
    .sort(() => Math.random() - 0.5)
    .slice(0, perTimeframe);

  // Mezclar y devolver el número solicitado
  return [...past, ...present, ...future]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function getTimeCardById(id: string): TimeCard | undefined {
  return TIME_CARDS.find(c => c.id === id);
}

// Colores por timeframe
export const TIMEFRAME_COLORS = {
  past: '#9D8DF1',    // Lavanda
  present: '#FF4081', // Coral
  future: '#4ECDC4',  // Turquesa
} as const;

export const TIMEFRAME_LABELS = {
  past: 'Pasado',
  present: 'Presente',
  future: 'Futuro',
} as const;
