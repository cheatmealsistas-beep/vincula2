// Definición de los juegos disponibles

export interface GameDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  available: boolean;
  hidden?: boolean; // No mostrar en la lista
}

export const GAMES: GameDefinition[] = [
  // --- Visibles (en orden) ---
  {
    id: 'sillychallenges',
    name: 'Retos',
    emoji: '🎪',
    description: 'Retos absurdos para reíros juntos',
    color: '#FFF8E1',
    available: true,
  },
  {
    id: 'wouldyourather',
    name: '¿Qué prefieres?',
    emoji: '🤔',
    description: 'Descubrid si pensáis igual con dilemas divertidos',
    color: '#FFD6E5',
    available: true,
  },
  {
    id: 'absurdphrases',
    name: 'Completa la Frase',
    emoji: '💬',
    description: 'Completad frases absurdas y descubrid vuestras respuestas',
    color: '#F3E5F5',
    available: true,
  },
  {
    id: 'spinwheel',
    name: 'Gira y...',
    emoji: '🎡',
    description: 'Girad la ruleta y dejad que el azar decida',
    color: '#FFE4EC',
    available: true,
  },
  {
    id: 'randomplan',
    name: 'Plan Random',
    emoji: '🎲',
    description: 'Tirad los dados y cread un plan sorpresa',
    color: '#E8F5E9',
    available: true,
  },
  {
    id: 'quiz',
    name: 'Quiz de pareja',
    emoji: '🧠',
    description: '¿Cuánto os conocéis realmente?',
    color: '#D4EAFF',
    available: false,
    hidden: true,
  },
  {
    id: 'cards',
    name: 'Cartas',
    emoji: '🎴',
    description: 'Expresad, escuchad y descubríos mutuamente',
    color: '#E8E0FF',
    available: true,
  },
  {
    id: 'timeline',
    name: 'Nuestra Historia',
    emoji: '📖',
    description: 'Viajad por el pasado, presente y futuro de vuestra relación',
    color: '#FFF5E6',
    available: true,
  },
  // --- Ocultos ---
  {
    id: 'draw',
    name: 'Dibuja y adivina',
    emoji: '🎨',
    description: 'Uno dibuja, el otro adivina',
    color: '#FFF0F5',
    available: false,
    hidden: true,
  },
  {
    id: 'adventure',
    name: 'Aventura',
    emoji: '🏃',
    description: 'Explorad juntos con vuestros muñequitos',
    color: '#F0EBFF',
    available: false,
    hidden: true,
  },
  {
    id: 'mirror',
    name: 'Espejo del Alma',
    emoji: '🪞',
    description: 'Descubrid cómo os ve vuestra pareja',
    color: '#E8F4F8',
    available: false,
    hidden: true,
  },
  {
    id: 'timecards',
    name: 'Cartas del Tiempo',
    emoji: '⏳',
    description: 'Reflexionad sobre pasado, presente y futuro',
    color: '#E6F7F5',
    available: false,
    hidden: true,
  },
  {
    id: 'calm',
    name: 'Momento Calma',
    emoji: '🌊',
    description: 'Respirad juntos y regulaos emocionalmente',
    color: '#E6E6FA',
    available: false,
    hidden: true,
  },
  {
    id: 'lovephrases',
    name: 'Te quiero porque...',
    emoji: '💌',
    description: 'Completad frases de amor y leedlas juntos',
    color: '#FFE4EC',
    available: true,
    hidden: true,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}
