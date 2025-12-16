// Te quiero porque... - Frases para completar y expresar amor

export interface LovePhrase {
  id: string;
  prompt: string;
  category: 'love' | 'moments' | 'future' | 'feelings' | 'gratitude';
  emoji: string;
}

export const LOVE_PHRASES: LovePhrase[] = [
  // Amor
  {
    id: 'love-1',
    prompt: 'Te quiero porque...',
    category: 'love',
    emoji: '❤️',
  },
  {
    id: 'love-2',
    prompt: 'Me enamoré de ti cuando...',
    category: 'love',
    emoji: '💕',
  },
  {
    id: 'love-3',
    prompt: 'Cada día te quiero más porque...',
    category: 'love',
    emoji: '💗',
  },

  // Momentos
  {
    id: 'love-4',
    prompt: 'Nunca olvidaré el día que...',
    category: 'moments',
    emoji: '✨',
  },
  {
    id: 'love-5',
    prompt: 'Mi momento favorito contigo fue...',
    category: 'moments',
    emoji: '🌟',
  },
  {
    id: 'love-6',
    prompt: 'Siempre me hace sonreír cuando recuerdo...',
    category: 'moments',
    emoji: '😊',
  },

  // Futuro
  {
    id: 'love-7',
    prompt: 'Sueño con que un día juntos...',
    category: 'future',
    emoji: '🌙',
  },
  {
    id: 'love-8',
    prompt: 'Contigo quiero...',
    category: 'future',
    emoji: '🦋',
  },
  {
    id: 'love-9',
    prompt: 'En 10 años nos veo...',
    category: 'future',
    emoji: '🔮',
  },

  // Sentimientos
  {
    id: 'love-10',
    prompt: 'Contigo me siento...',
    category: 'feelings',
    emoji: '🏠',
  },
  {
    id: 'love-11',
    prompt: 'Lo que más me gusta de ti es...',
    category: 'feelings',
    emoji: '💫',
  },
  {
    id: 'love-12',
    prompt: 'Cuando estoy contigo siento...',
    category: 'feelings',
    emoji: '🥰',
  },

  // Gratitud
  {
    id: 'love-13',
    prompt: 'Gracias por...',
    category: 'gratitude',
    emoji: '🙏',
  },
  {
    id: 'love-14',
    prompt: 'Eres especial porque...',
    category: 'gratitude',
    emoji: '💎',
  },
  {
    id: 'love-15',
    prompt: 'Me haces mejor persona porque...',
    category: 'gratitude',
    emoji: '🌈',
  },
];

export function getRandomLovePhrases(count: number = 5): LovePhrase[] {
  const categories = ['love', 'moments', 'future', 'feelings', 'gratitude'];
  const selected: LovePhrase[] = [];

  for (const cat of categories) {
    if (selected.length >= count) break;
    const fromCat = LOVE_PHRASES.filter(p => p.category === cat);
    const random = fromCat[Math.floor(Math.random() * fromCat.length)];
    if (random && !selected.includes(random)) {
      selected.push(random);
    }
  }

  return selected.slice(0, count);
}

export function getLovePhraseById(id: string): LovePhrase | undefined {
  return LOVE_PHRASES.find(p => p.id === id);
}
