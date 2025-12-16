// Espejo del Alma - Preguntas para verse a través del otro

export interface MirrorPrompt {
  id: string;
  prompt: string;
  category: 'strengths' | 'dreams' | 'fears' | 'quirks' | 'love';
  emoji: string;
}

export const MIRROR_PROMPTS: MirrorPrompt[] = [
  // Fortalezas
  {
    id: 'mirror-1',
    prompt: 'Tu mayor fortaleza es...',
    category: 'strengths',
    emoji: '💪',
  },
  {
    id: 'mirror-2',
    prompt: 'Lo que más admiro de ti es...',
    category: 'strengths',
    emoji: '✨',
  },
  {
    id: 'mirror-3',
    prompt: 'Eres increíblemente bueno/a en...',
    category: 'strengths',
    emoji: '🌟',
  },

  // Sueños
  {
    id: 'mirror-4',
    prompt: 'Creo que secretamente sueñas con...',
    category: 'dreams',
    emoji: '🌙',
  },
  {
    id: 'mirror-5',
    prompt: 'Sé que serías muy feliz si...',
    category: 'dreams',
    emoji: '🦋',
  },
  {
    id: 'mirror-6',
    prompt: 'Tu pasión oculta es...',
    category: 'dreams',
    emoji: '🔥',
  },

  // Miedos
  {
    id: 'mirror-7',
    prompt: 'Creo que a veces te preocupa...',
    category: 'fears',
    emoji: '🫂',
  },
  {
    id: 'mirror-8',
    prompt: 'Sé que te cuesta mostrar cuando...',
    category: 'fears',
    emoji: '💭',
  },
  {
    id: 'mirror-9',
    prompt: 'Noto que te proteges de...',
    category: 'fears',
    emoji: '🛡️',
  },

  // Peculiaridades
  {
    id: 'mirror-10',
    prompt: 'Me encanta cuando haces eso de...',
    category: 'quirks',
    emoji: '🥰',
  },
  {
    id: 'mirror-11',
    prompt: 'Tu manía más adorable es...',
    category: 'quirks',
    emoji: '😊',
  },
  {
    id: 'mirror-12',
    prompt: 'Siempre me hace sonreír cuando...',
    category: 'quirks',
    emoji: '😄',
  },

  // Amor
  {
    id: 'mirror-13',
    prompt: 'Me enamoré de ti porque...',
    category: 'love',
    emoji: '💕',
  },
  {
    id: 'mirror-14',
    prompt: 'Contigo me siento...',
    category: 'love',
    emoji: '🏠',
  },
  {
    id: 'mirror-15',
    prompt: 'Lo que hace única nuestra relación es...',
    category: 'love',
    emoji: '💫',
  },
];

export function getRandomMirrorPrompts(count: number = 5): MirrorPrompt[] {
  // Intentar incluir variedad de categorías
  const categories = ['strengths', 'dreams', 'fears', 'quirks', 'love'];
  const selected: MirrorPrompt[] = [];

  // Uno de cada categoría primero
  for (const cat of categories) {
    if (selected.length >= count) break;
    const fromCat = MIRROR_PROMPTS.filter(p => p.category === cat);
    const random = fromCat[Math.floor(Math.random() * fromCat.length)];
    if (random && !selected.includes(random)) {
      selected.push(random);
    }
  }

  return selected.slice(0, count);
}

export function getMirrorPromptById(id: string): MirrorPrompt | undefined {
  return MIRROR_PROMPTS.find(p => p.id === id);
}
