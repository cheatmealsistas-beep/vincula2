// Preguntas para el Quiz de pareja
// Cada uno responde SOBRE SÍ MISMO y luego comparan

export interface QuizQuestion {
  id: string;
  question: string; // Pregunta para uno mismo
  partnerQuestion: string; // Lo que ve el otro (adivina sobre ti)
  category: 'basics' | 'preferences' | 'memories' | 'dreams';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Básicos - Cada uno responde sobre sí mismo
  {
    id: 'quiz-1',
    question: '¿Cuál es tu comida favorita?',
    partnerQuestion: '¿Cuál crees que es su comida favorita?',
    category: 'basics',
  },
  {
    id: 'quiz-2',
    question: '¿Cuál es tu película favorita?',
    partnerQuestion: '¿Cuál crees que es su película favorita?',
    category: 'basics',
  },
  {
    id: 'quiz-3',
    question: '¿Qué es lo que más te relaja?',
    partnerQuestion: '¿Qué crees que le relaja más?',
    category: 'basics',
  },
  {
    id: 'quiz-4',
    question: '¿Cuál es tu mayor miedo?',
    partnerQuestion: '¿Cuál crees que es su mayor miedo?',
    category: 'basics',
  },
  {
    id: 'quiz-5',
    question: '¿Qué canción te pone de buen humor?',
    partnerQuestion: '¿Qué canción crees que le pone de buen humor?',
    category: 'basics',
  },

  // Preferencias
  {
    id: 'quiz-6',
    question: '¿Prefieres playa o montaña?',
    partnerQuestion: '¿Crees que prefiere playa o montaña?',
    category: 'preferences',
  },
  {
    id: 'quiz-7',
    question: '¿Prefieres madrugar o trasnochar?',
    partnerQuestion: '¿Crees que prefiere madrugar o trasnochar?',
    category: 'preferences',
  },
  {
    id: 'quiz-8',
    question: '¿Prefieres dulce o salado?',
    partnerQuestion: '¿Crees que prefiere dulce o salado?',
    category: 'preferences',
  },
  {
    id: 'quiz-9',
    question: '¿Prefieres sorpresas o planes?',
    partnerQuestion: '¿Crees que prefiere sorpresas o planes?',
    category: 'preferences',
  },
  {
    id: 'quiz-10',
    question: '¿Cómo te gusta que te demuestren cariño?',
    partnerQuestion: '¿Cómo crees que le gusta que le demuestren cariño?',
    category: 'preferences',
  },

  // Recuerdos - Ambos responden su perspectiva del mismo momento
  {
    id: 'quiz-11',
    question: '¿Dónde fue vuestro primer beso?',
    partnerQuestion: '¿Dónde fue vuestro primer beso?',
    category: 'memories',
  },
  {
    id: 'quiz-12',
    question: '¿Qué es lo primero que te atrajo de tu pareja?',
    partnerQuestion: '¿Qué crees que fue lo primero que le atrajo de ti?',
    category: 'memories',
  },
  {
    id: 'quiz-13',
    question: '¿Cuál ha sido vuestra mejor cita?',
    partnerQuestion: '¿Cuál ha sido vuestra mejor cita?',
    category: 'memories',
  },
  {
    id: 'quiz-14',
    question: '¿Cuándo supiste que estabas enamorado/a?',
    partnerQuestion: '¿Cuándo crees que supo que estaba enamorado/a?',
    category: 'memories',
  },
  {
    id: 'quiz-15',
    question: '¿Cuál es el momento más gracioso que habéis vivido?',
    partnerQuestion: '¿Cuál es el momento más gracioso que habéis vivido?',
    category: 'memories',
  },

  // Sueños
  {
    id: 'quiz-16',
    question: '¿Cuál es tu sueño más grande?',
    partnerQuestion: '¿Cuál crees que es su sueño más grande?',
    category: 'dreams',
  },
  {
    id: 'quiz-17',
    question: '¿Dónde te gustaría vivir?',
    partnerQuestion: '¿Dónde crees que le gustaría vivir?',
    category: 'dreams',
  },
  {
    id: 'quiz-18',
    question: '¿Qué harías si te tocara la lotería?',
    partnerQuestion: '¿Qué crees que haría si le tocara la lotería?',
    category: 'dreams',
  },
  {
    id: 'quiz-19',
    question: '¿Cuál es el viaje de tus sueños?',
    partnerQuestion: '¿Cuál crees que es el viaje de sus sueños?',
    category: 'dreams',
  },
  {
    id: 'quiz-20',
    question: '¿Cómo te imaginas vuestra vida dentro de 10 años?',
    partnerQuestion: '¿Cómo crees que se imagina vuestra vida dentro de 10 años?',
    category: 'dreams',
  },
];

// Mezclar y seleccionar preguntas aleatorias
export function getRandomQuizQuestions(count: number = 5): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuizQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === id);
}
