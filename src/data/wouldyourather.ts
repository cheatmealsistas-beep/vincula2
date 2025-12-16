// Dilemas para el juego "¿Qué prefieres?"

export interface WouldYouRatherCard {
  id: string;
  optionA: string;
  optionB: string;
  category: 'fun' | 'deep' | 'couple' | 'future';
}

export const WOULD_YOU_RATHER_CARDS: WouldYouRatherCard[] = [
  // Divertidos
  {
    id: 'wyr-1',
    optionA: 'Tener siempre la casa perfectamente limpia',
    optionB: 'Tener siempre la nevera llena de tu comida favorita',
    category: 'fun',
  },
  {
    id: 'wyr-2',
    optionA: 'Poder teletransportarte',
    optionB: 'Poder leer la mente (solo de tu pareja)',
    category: 'fun',
  },
  {
    id: 'wyr-3',
    optionA: 'Vivir en la playa',
    optionB: 'Vivir en la montaña',
    category: 'fun',
  },
  {
    id: 'wyr-4',
    optionA: 'Ser invisible por un día',
    optionB: 'Poder volar por un día',
    category: 'fun',
  },
  {
    id: 'wyr-5',
    optionA: 'No poder usar el móvil por una semana',
    optionB: 'No poder ver series/películas por un mes',
    category: 'fun',
  },

  // Profundos
  {
    id: 'wyr-6',
    optionA: 'Saber siempre lo que siente tu pareja',
    optionB: 'Que tu pareja siempre sepa lo que sientes tú',
    category: 'deep',
  },
  {
    id: 'wyr-7',
    optionA: 'Revivir vuestro primer beso',
    optionB: 'Ver un momento de vuestro futuro juntos',
    category: 'deep',
  },
  {
    id: 'wyr-8',
    optionA: 'Tener razón siempre en las discusiones',
    optionB: 'Que las discusiones se resuelvan siempre en 5 minutos',
    category: 'deep',
  },
  {
    id: 'wyr-9',
    optionA: 'Poder borrar un momento difícil de vuestra relación',
    optionB: 'Poder revivir el momento más feliz juntos',
    category: 'deep',
  },
  {
    id: 'wyr-10',
    optionA: 'Que tu pareja te sorprenda siempre',
    optionB: 'Poder sorprender siempre a tu pareja',
    category: 'deep',
  },

  // De pareja
  {
    id: 'wyr-11',
    optionA: 'Desayuno en la cama todos los domingos',
    optionB: 'Cena romántica todos los viernes',
    category: 'couple',
  },
  {
    id: 'wyr-12',
    optionA: 'Recibir más abrazos',
    optionB: 'Recibir más besos',
    category: 'couple',
  },
  {
    id: 'wyr-13',
    optionA: 'Pasar un finde sin planes, solo vosotros',
    optionB: 'Una aventura espontánea cada mes',
    category: 'couple',
  },
  {
    id: 'wyr-14',
    optionA: 'Dormir abrazados aunque haga calor',
    optionB: 'Dormir cómodos aunque sea separados',
    category: 'couple',
  },
  {
    id: 'wyr-15',
    optionA: 'Que te preparen tu comida favorita',
    optionB: 'Cocinar juntos algo nuevo',
    category: 'couple',
  },

  // Futuro
  {
    id: 'wyr-16',
    optionA: 'Vivir en una gran ciudad',
    optionB: 'Vivir en un pueblo tranquilo',
    category: 'future',
  },
  {
    id: 'wyr-17',
    optionA: 'Tener muchos viajes cortos al año',
    optionB: 'Tener un viaje largo y especial',
    category: 'future',
  },
  {
    id: 'wyr-18',
    optionA: 'Una casa grande con jardín',
    optionB: 'Un piso céntrico y acogedor',
    category: 'future',
  },
  {
    id: 'wyr-19',
    optionA: 'Trabajar desde casa juntos',
    optionB: 'Tener trabajos separados para extrañaros',
    category: 'future',
  },
  {
    id: 'wyr-20',
    optionA: 'Jubilarse pronto con poco dinero',
    optionB: 'Trabajar más años pero con más comodidades',
    category: 'future',
  },
];

// Mezclar y seleccionar cartas aleatorias
export function getRandomWouldYouRatherCards(count: number = 5): WouldYouRatherCard[] {
  const shuffled = [...WOULD_YOU_RATHER_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getWouldYouRatherCardById(id: string): WouldYouRatherCard | undefined {
  return WOULD_YOU_RATHER_CARDS.find((c) => c.id === id);
}
