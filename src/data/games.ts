// Definición de los juegos disponibles

export interface GameDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  available: boolean;
}

export const GAMES: GameDefinition[] = [
  {
    id: 'cards',
    name: 'Cartas',
    emoji: '🎴',
    description: 'Expresad lo que sentís con preguntas guiadas',
    color: '#E8E0FF',
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
    id: 'quiz',
    name: 'Quiz de pareja',
    emoji: '🧠',
    description: '¿Cuánto os conocéis realmente?',
    color: '#D4EAFF',
    available: true,
  },
  {
    id: 'draw',
    name: 'Dibuja y adivina',
    emoji: '🎨',
    description: 'Uno dibuja, el otro adivina',
    color: '#FFF0F5',
    available: true,
  },
  {
    id: 'adventure',
    name: 'Aventura',
    emoji: '🏃',
    description: 'Explorad juntos con vuestros muñequitos',
    color: '#F0EBFF',
    available: true,
  },
  {
    id: 'mirror',
    name: 'Espejo del Alma',
    emoji: '🪞',
    description: 'Descubrid cómo os ve vuestra pareja',
    color: '#E8F4F8',
    available: true,
  },
  {
    id: 'timeline',
    name: 'Nuestra Historia',
    emoji: '📖',
    description: 'Construid la línea temporal de vuestra relación',
    color: '#FFF5E6',
    available: true,
  },
  {
    id: 'timecards',
    name: 'Cartas del Tiempo',
    emoji: '⏳',
    description: 'Reflexionad sobre pasado, presente y futuro',
    color: '#E6F7F5',
    available: true,
  },
  {
    id: 'calm',
    name: 'Momento Calma',
    emoji: '🌊',
    description: 'Respirad juntos y regulaos emocionalmente',
    color: '#E6E6FA',
    available: true,
  },
  {
    id: 'lovephrases',
    name: 'Te quiero porque...',
    emoji: '💌',
    description: 'Completad frases de amor y leedlas juntos',
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
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}
