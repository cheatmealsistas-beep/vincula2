import type { Card } from '../types';

// Mazo de cartas para el MVP
// Siguiendo los valores: cariño, honestidad, apoyo, sinceridad, humor

export const CARDS: Card[] = [
  // Cartas de Expresar - para decir lo que necesitas
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

  // Cartas de Escuchar - para observar al otro
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

  // Cartas de Reparar - para cuidar mejor
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
];

// Función para obtener cartas aleatorias para una partida
export function getRandomCards(count: number = 3): Card[] {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Función para obtener una carta de cada tipo
export function getBalancedCards(): Card[] {
  const express = CARDS.filter(c => c.type === 'express');
  const listen = CARDS.filter(c => c.type === 'listen');
  const repair = CARDS.filter(c => c.type === 'repair');

  return [
    express[Math.floor(Math.random() * express.length)],
    listen[Math.floor(Math.random() * listen.length)],
    repair[Math.floor(Math.random() * repair.length)],
  ];
}
