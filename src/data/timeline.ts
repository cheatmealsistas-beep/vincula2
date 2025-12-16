// Nuestra Historia - Línea temporal de momentos de la relación

export interface TimelinePrompt {
  id: string;
  prompt: string;
  category: 'beginning' | 'growth' | 'challenges' | 'joy' | 'dreams';
  emoji: string;
}

export const TIMELINE_PROMPTS: TimelinePrompt[] = [
  // Comienzos
  {
    id: 'tl-1',
    prompt: '¿Cuál fue tu primera impresión de mí?',
    category: 'beginning',
    emoji: '👀',
  },
  {
    id: 'tl-2',
    prompt: '¿Qué momento supiste que éramos algo especial?',
    category: 'beginning',
    emoji: '✨',
  },
  {
    id: 'tl-3',
    prompt: '¿Cuál fue nuestra primera cita o momento a solas?',
    category: 'beginning',
    emoji: '💕',
  },

  // Crecimiento
  {
    id: 'tl-4',
    prompt: '¿Qué hemos aprendido juntos que no habríamos aprendido solos?',
    category: 'growth',
    emoji: '🌱',
  },
  {
    id: 'tl-5',
    prompt: '¿En qué momento sentiste que nuestra relación se hizo más profunda?',
    category: 'growth',
    emoji: '🔗',
  },
  {
    id: 'tl-6',
    prompt: '¿Qué costumbre o tradición hemos creado juntos?',
    category: 'growth',
    emoji: '🏠',
  },

  // Desafíos
  {
    id: 'tl-7',
    prompt: '¿Cuál fue un momento difícil que superamos juntos?',
    category: 'challenges',
    emoji: '💪',
  },
  {
    id: 'tl-8',
    prompt: '¿Qué discusión nos hizo crecer como pareja?',
    category: 'challenges',
    emoji: '🌧️',
  },
  {
    id: 'tl-9',
    prompt: '¿Cuándo sentiste que necesitabas apoyarme más?',
    category: 'challenges',
    emoji: '🤝',
  },

  // Alegría
  {
    id: 'tl-10',
    prompt: '¿Cuál es el momento más divertido que hemos vivido?',
    category: 'joy',
    emoji: '😂',
  },
  {
    id: 'tl-11',
    prompt: '¿Qué viaje o aventura nunca olvidarás?',
    category: 'joy',
    emoji: '✈️',
  },
  {
    id: 'tl-12',
    prompt: '¿Cuándo te has sentido más orgulloso/a de nosotros?',
    category: 'joy',
    emoji: '🏆',
  },

  // Sueños
  {
    id: 'tl-13',
    prompt: '¿Qué momento futuro imaginas con nosotros?',
    category: 'dreams',
    emoji: '🔮',
  },
  {
    id: 'tl-14',
    prompt: '¿Qué sueño queremos cumplir juntos?',
    category: 'dreams',
    emoji: '⭐',
  },
  {
    id: 'tl-15',
    prompt: '¿Cómo nos ves dentro de 10 años?',
    category: 'dreams',
    emoji: '🌅',
  },
];

export function getRandomTimelinePrompts(count: number = 5): TimelinePrompt[] {
  // Elegir uno de cada categoría para variedad
  const categories: TimelinePrompt['category'][] = ['beginning', 'growth', 'challenges', 'joy', 'dreams'];
  const selected: TimelinePrompt[] = [];

  for (const cat of categories) {
    const catPrompts = TIMELINE_PROMPTS.filter(p => p.category === cat);
    const random = catPrompts[Math.floor(Math.random() * catPrompts.length)];
    selected.push(random);
    if (selected.length >= count) break;
  }

  return selected;
}
