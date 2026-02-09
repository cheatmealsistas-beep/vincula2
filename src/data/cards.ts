import type { Card } from '../types';

// Mazo de cartas fusionado: Cartas originales + Espejo del Alma
// Siguiendo los valores: cariño, honestidad, apoyo, sinceridad, humor

export const CARDS: Card[] = [
  // === EXPRESAR - Para decir lo que necesitas ===
  {
    id: 'express-1',
    type: 'express',
    prompt: 'Hoy necesito...',
    placeholder: 'un abrazo, silencio, que me escuches...',
  },
  {
    id: 'express-2',
    type: 'express',
    prompt: 'Me ayudaría mucho que...',
    placeholder: 'me preguntaras cómo estoy...',
  },
  {
    id: 'express-3',
    type: 'express',
    prompt: 'Algo que no he dicho es que...',
    placeholder: 'a veces me siento...',
  },
  {
    id: 'express-4',
    type: 'express',
    prompt: 'Últimamente me siento...',
    placeholder: 'agotado/a, feliz, confundido/a...',
  },
  {
    id: 'express-5',
    type: 'express',
    prompt: 'Me cuesta decirte que...',
    placeholder: 'necesito más espacio, te echo de menos...',
  },

  // === ESCUCHAR - Para observar al otro ===
  {
    id: 'listen-1',
    type: 'listen',
    prompt: 'Algo que noté de ti últimamente...',
    placeholder: 'te veo cansado/a, estás más callado/a...',
  },
  {
    id: 'listen-2',
    type: 'listen',
    prompt: 'Creo que necesitas...',
    placeholder: 'descanso, un respiro, hablar...',
  },
  {
    id: 'listen-3',
    type: 'listen',
    prompt: 'Me gusta cuando tú...',
    placeholder: 'me miras así, cocinas, ríes...',
  },
  {
    id: 'listen-4',
    type: 'listen',
    prompt: 'Te noto diferente cuando...',
    placeholder: 'hablas de trabajo, ves a tu familia...',
  },

  // === REPARAR - Para cuidar mejor ===
  {
    id: 'repair-1',
    type: 'repair',
    prompt: 'Algo que quiero cuidar mejor es...',
    placeholder: 'cómo te hablo cuando estoy estresado/a...',
  },
  {
    id: 'repair-2',
    type: 'repair',
    prompt: 'La próxima vez intentaré...',
    placeholder: 'escuchar antes de responder...',
  },
  {
    id: 'repair-3',
    type: 'repair',
    prompt: 'Gracias por...',
    placeholder: 'tu paciencia, estar ahí, entenderme...',
  },
  {
    id: 'repair-4',
    type: 'repair',
    prompt: 'Perdona si a veces...',
    placeholder: 'no te escucho bien, me cierro...',
  },

  // === ESPEJO - Sobre tu pareja (ambos responden sobre la misma persona) ===
  {
    id: 'mirror-1',
    type: 'mirror',
    prompt: 'Tu mayor fortaleza es...',
    placeholder: 'tu paciencia, tu creatividad, tu corazón...',
    aboutPartner: true,
  },
  {
    id: 'mirror-2',
    type: 'mirror',
    prompt: 'Lo que más admiro de ti es...',
    placeholder: 'cómo enfrentas los problemas, tu bondad...',
    aboutPartner: true,
  },
  {
    id: 'mirror-3',
    type: 'mirror',
    prompt: 'Creo que secretamente sueñas con...',
    placeholder: 'viajar, tener un negocio, vivir en la playa...',
    aboutPartner: true,
  },
  {
    id: 'mirror-4',
    type: 'mirror',
    prompt: 'Tu manía más adorable es...',
    placeholder: 'cómo ordenas todo, tus rituales...',
    aboutPartner: true,
  },
  {
    id: 'mirror-5',
    type: 'mirror',
    prompt: 'Me encanta cuando haces eso de...',
    placeholder: 'cantar bajito, acariciarme el pelo...',
    aboutPartner: true,
  },
  {
    id: 'mirror-6',
    type: 'mirror',
    prompt: 'Creo que a veces te preocupa...',
    placeholder: 'no ser suficiente, el futuro...',
    aboutPartner: true,
  },
  {
    id: 'mirror-7',
    type: 'mirror',
    prompt: 'Contigo me siento...',
    placeholder: 'en casa, seguro/a, libre...',
    aboutPartner: false, // Esta es sobre uno mismo
  },
  {
    id: 'mirror-8',
    type: 'mirror',
    prompt: 'Me enamoré de ti porque...',
    placeholder: 'tu risa, cómo me miras, tu forma de ser...',
    aboutPartner: true,
  },
];

// Función para obtener cartas aleatorias para una partida
export function getRandomCards(count: number = 5): Card[] {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Función para obtener cartas balanceadas (una de cada tipo)
export function getBalancedCards(count: number = 5): Card[] {
  const express = CARDS.filter(c => c.type === 'express');
  const listen = CARDS.filter(c => c.type === 'listen');
  const repair = CARDS.filter(c => c.type === 'repair');
  const mirror = CARDS.filter(c => c.type === 'mirror');

  const allTypes = [express, listen, repair, mirror];
  const selected: Card[] = [];

  // Rotar por tipos para tener variedad
  let typeIndex = 0;
  while (selected.length < count) {
    const typeCards = allTypes[typeIndex % allTypes.length];
    const available = typeCards.filter(c => !selected.includes(c));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      selected.push(random);
    }
    typeIndex++;
    // Safety check para evitar bucle infinito
    if (typeIndex > count * 4) break;
  }

  return selected.sort(() => Math.random() - 0.5);
}

// Colores por tipo de carta
export const CARD_TYPE_COLORS = {
  express: '#FFDAB9', // Peach
  listen: '#B2E0D6',  // Mint
  repair: '#E6E0F8',  // Lavender
  mirror: '#FFE4EC',  // Pink suave
  pause: '#E8E4DF',   // Gris cálido
} as const;

export const CARD_TYPE_LABELS = {
  express: 'Expresar',
  listen: 'Escuchar',
  repair: 'Reparar',
  mirror: 'Espejo',
  pause: 'Pausa',
} as const;
