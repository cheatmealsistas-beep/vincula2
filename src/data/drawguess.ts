// Palabras para el juego de Dibuja y Adivina

export interface DrawWord {
  id: string;
  word: string;
  category: 'animals' | 'food' | 'objects' | 'places' | 'actions' | 'love';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DRAW_WORDS: DrawWord[] = [
  // Animales - Fácil
  { id: 'draw-1', word: 'Gato', category: 'animals', difficulty: 'easy' },
  { id: 'draw-2', word: 'Perro', category: 'animals', difficulty: 'easy' },
  { id: 'draw-3', word: 'Pájaro', category: 'animals', difficulty: 'easy' },
  { id: 'draw-4', word: 'Pez', category: 'animals', difficulty: 'easy' },
  { id: 'draw-5', word: 'Mariposa', category: 'animals', difficulty: 'medium' },

  // Comida - Fácil
  { id: 'draw-6', word: 'Pizza', category: 'food', difficulty: 'easy' },
  { id: 'draw-7', word: 'Helado', category: 'food', difficulty: 'easy' },
  { id: 'draw-8', word: 'Manzana', category: 'food', difficulty: 'easy' },
  { id: 'draw-9', word: 'Pastel', category: 'food', difficulty: 'easy' },
  { id: 'draw-10', word: 'Hamburguesa', category: 'food', difficulty: 'medium' },

  // Objetos
  { id: 'draw-11', word: 'Casa', category: 'objects', difficulty: 'easy' },
  { id: 'draw-12', word: 'Coche', category: 'objects', difficulty: 'easy' },
  { id: 'draw-13', word: 'Teléfono', category: 'objects', difficulty: 'easy' },
  { id: 'draw-14', word: 'Libro', category: 'objects', difficulty: 'easy' },
  { id: 'draw-15', word: 'Paraguas', category: 'objects', difficulty: 'medium' },

  // Lugares
  { id: 'draw-16', word: 'Playa', category: 'places', difficulty: 'easy' },
  { id: 'draw-17', word: 'Montaña', category: 'places', difficulty: 'easy' },
  { id: 'draw-18', word: 'Parque', category: 'places', difficulty: 'medium' },
  { id: 'draw-19', word: 'Cine', category: 'places', difficulty: 'medium' },
  { id: 'draw-20', word: 'Restaurante', category: 'places', difficulty: 'medium' },

  // Acciones/Conceptos
  { id: 'draw-21', word: 'Bailar', category: 'actions', difficulty: 'medium' },
  { id: 'draw-22', word: 'Dormir', category: 'actions', difficulty: 'easy' },
  { id: 'draw-23', word: 'Correr', category: 'actions', difficulty: 'medium' },
  { id: 'draw-24', word: 'Nadar', category: 'actions', difficulty: 'medium' },
  { id: 'draw-25', word: 'Cantar', category: 'actions', difficulty: 'medium' },

  // Temática de amor/pareja
  { id: 'draw-26', word: 'Corazón', category: 'love', difficulty: 'easy' },
  { id: 'draw-27', word: 'Beso', category: 'love', difficulty: 'medium' },
  { id: 'draw-28', word: 'Abrazo', category: 'love', difficulty: 'medium' },
  { id: 'draw-29', word: 'Flores', category: 'love', difficulty: 'easy' },
  { id: 'draw-30', word: 'Anillo', category: 'love', difficulty: 'easy' },
  { id: 'draw-31', word: 'Cita romántica', category: 'love', difficulty: 'hard' },
  { id: 'draw-32', word: 'Luna de miel', category: 'love', difficulty: 'hard' },
  { id: 'draw-33', word: 'Cena con velas', category: 'love', difficulty: 'hard' },
  { id: 'draw-34', word: 'Película juntos', category: 'love', difficulty: 'hard' },
  { id: 'draw-35', word: 'Paseo romántico', category: 'love', difficulty: 'hard' },
];

// Mezclar y seleccionar palabras aleatorias
export function getRandomDrawWords(count: number = 5): DrawWord[] {
  const shuffled = [...DRAW_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getDrawWordById(id: string): DrawWord | undefined {
  return DRAW_WORDS.find((w) => w.id === id);
}
