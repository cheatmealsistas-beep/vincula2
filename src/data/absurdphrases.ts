// Frases absurdas para completar - diseñadas para respuestas graciosas

export interface AbsurdPhrase {
  id: number;
  phrase: string;
  category: 'random' | 'couple' | 'fantasy' | 'confession';
}

export const ABSURD_PHRASES: AbsurdPhrase[] = [
  // Random total
  { id: 1, phrase: 'Si fueras un electrodoméstico serías...', category: 'random' },
  { id: 2, phrase: 'Tu superpoder secreto debería ser...', category: 'random' },
  { id: 3, phrase: 'Si tu vida fuera una película se llamaría...', category: 'random' },
  { id: 4, phrase: 'El animal que mejor te representa es...', category: 'random' },
  { id: 5, phrase: 'Si fueras una comida serías...', category: 'random' },
  { id: 6, phrase: 'Tu nombre de superhéroe sería...', category: 'random' },
  { id: 7, phrase: 'Si fueras un emoji serías...', category: 'random' },
  { id: 8, phrase: 'Tu canción tema personal sería...', category: 'random' },
  { id: 9, phrase: 'Si tuvieras un lema de vida sería...', category: 'random' },
  { id: 10, phrase: 'El objeto que mejor te define es...', category: 'random' },

  // Pareja absurda
  { id: 11, phrase: 'Lo más raro que haces cuando nadie te ve es...', category: 'couple' },
  { id: 12, phrase: 'Lo que más te sorprende de vivir conmigo es...', category: 'couple' },
  { id: 13, phrase: 'Si tuviéramos un restaurante se llamaría...', category: 'couple' },
  { id: 14, phrase: 'Nuestra serie de TV juntos sería sobre...', category: 'couple' },
  { id: 15, phrase: 'Si fuéramos un dúo musical seríamos...', category: 'couple' },
  { id: 16, phrase: 'Lo más absurdo que hemos hecho juntos es...', category: 'couple' },
  { id: 17, phrase: 'Si tuviéramos un negocio juntos venderíamos...', category: 'couple' },
  { id: 18, phrase: 'Nuestra mascota ideal sería un/a...', category: 'couple' },
  { id: 19, phrase: 'Si pudiéramos inventar algo juntos sería...', category: 'couple' },
  { id: 20, phrase: 'Nuestro baile característico se llama...', category: 'couple' },

  // Fantasía
  { id: 21, phrase: 'Si pudieras vivir en cualquier época sería...', category: 'fantasy' },
  { id: 22, phrase: 'Tu trabajo ideal en un mundo de fantasía sería...', category: 'fantasy' },
  { id: 23, phrase: 'Si pudieras cenar con cualquier persona (viva o muerta) sería...', category: 'fantasy' },
  { id: 24, phrase: 'Si te despertaras mañana siendo famoso/a sería por...', category: 'fantasy' },
  { id: 25, phrase: 'Si pudieras tener cualquier habilidad mágica sería...', category: 'fantasy' },
  { id: 26, phrase: 'El planeta donde te gustaría vivir se llama...', category: 'fantasy' },
  { id: 27, phrase: 'Si fueras presidente/a por un día harías...', category: 'fantasy' },
  { id: 28, phrase: 'Tu casa de ensueño estaría en...', category: 'fantasy' },
  { id: 29, phrase: 'Si pudieras ser invisible por un día harías...', category: 'fantasy' },
  { id: 30, phrase: 'El talento oculto que desearías tener es...', category: 'fantasy' },

  // Confesiones absurdas
  { id: 31, phrase: 'Mi mayor talento inútil es...', category: 'confession' },
  { id: 32, phrase: 'Lo más vergonzoso que me ha pasado es...', category: 'confession' },
  { id: 33, phrase: 'Algo que nadie sabe de mí es...', category: 'confession' },
  { id: 34, phrase: 'Mi peor hábito secreto es...', category: 'confession' },
  { id: 35, phrase: 'Lo más raro que he comido es...', category: 'confession' },
  { id: 36, phrase: 'Mi miedo más absurdo es...', category: 'confession' },
  { id: 37, phrase: 'La cosa más tonta por la que he llorado es...', category: 'confession' },
  { id: 38, phrase: 'Mi guilty pleasure es...', category: 'confession' },
  { id: 39, phrase: 'Algo que hago cuando estoy solo/a es...', category: 'confession' },
  { id: 40, phrase: 'Mi obsesión secreta es...', category: 'confession' },
];

// Obtener frases aleatorias
export function getRandomPhrases(count: number = 5): AbsurdPhrase[] {
  const shuffled = [...ABSURD_PHRASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
