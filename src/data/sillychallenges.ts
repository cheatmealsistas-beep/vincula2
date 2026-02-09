// Retos tontos y divertidos para parejas

export interface SillyChallenge {
  id: number;
  challenge: string;
  category: 'voice' | 'face' | 'body' | 'mixed';
}

export const SILLY_CHALLENGES: SillyChallenge[] = [
  // Voz
  { id: 1, challenge: 'Di "te quiero" con voz de robot', category: 'voice' },
  { id: 2, challenge: 'Canta el cumpleaños feliz como si fueras ópera', category: 'voice' },
  { id: 3, challenge: 'Di tu nombre completo como un presentador de televisión', category: 'voice' },
  { id: 4, challenge: 'Cuenta hasta 10 con acento italiano', category: 'voice' },
  { id: 5, challenge: 'Di "buenos días" como si estuvieras muy enfadado/a', category: 'voice' },
  { id: 6, challenge: 'Canta cualquier canción pero susurrando', category: 'voice' },
  { id: 7, challenge: 'Di "me encanta la pizza" como si fuera un secreto muy importante', category: 'voice' },
  { id: 8, challenge: 'Imita el sonido de una moto arrancando', category: 'voice' },
  { id: 9, challenge: 'Di tu plato favorito con voz de villano de película', category: 'voice' },
  { id: 10, challenge: 'Cuenta una mentira obvia con voz muy seria', category: 'voice' },
  { id: 41, challenge: 'Haz el sonido de un alien intentando comunicarse', category: 'voice' },
  { id: 42, challenge: 'Di "hola cariño" con 5 acentos diferentes seguidos', category: 'voice' },
  { id: 43, challenge: 'Narra lo que hace tu pareja como un documental de naturaleza', category: 'voice' },
  { id: 44, challenge: 'Canta tu canción favorita pero solo con "la la la"', category: 'voice' },
  { id: 45, challenge: 'Di trabalenguas "tres tristes tigres" 3 veces rápido', category: 'voice' },
  { id: 46, challenge: 'Imita a tu pareja diciendo "te quiero"', category: 'voice' },
  { id: 47, challenge: 'Haz beatbox durante 10 segundos', category: 'voice' },
  { id: 48, challenge: 'Di tu comida favorita como si fuera un conjuro mágico', category: 'voice' },

  // Caras
  { id: 11, challenge: 'Pon tu mejor cara de enamorado/a', category: 'face' },
  { id: 12, challenge: 'Haz la cara que pones cuando algo huele mal', category: 'face' },
  { id: 13, challenge: 'Pon cara de sorpresa extrema', category: 'face' },
  { id: 14, challenge: 'Haz tu mejor guiño seductor', category: 'face' },
  { id: 15, challenge: 'Pon la cara que haces cuando te despiertas', category: 'face' },
  { id: 16, challenge: 'Imita la cara de un pez', category: 'face' },
  { id: 17, challenge: 'Pon cara de "no he sido yo"', category: 'face' },
  { id: 18, challenge: 'Haz tu mejor cara de modelo de revista', category: 'face' },
  { id: 19, challenge: 'Pon la cara que haces cuando comes limón', category: 'face' },
  { id: 20, challenge: 'Haz la cara de "estoy pensando algo muy profundo"', category: 'face' },
  { id: 49, challenge: 'Haz 5 caras diferentes en 5 segundos', category: 'face' },
  { id: 50, challenge: 'Pon la cara que pones cuando te pillan comiendo a escondidas', category: 'face' },
  { id: 51, challenge: 'Imita la cara de tu emoji favorito', category: 'face' },
  { id: 52, challenge: 'Haz cara de bebé enfadado', category: 'face' },
  { id: 53, challenge: 'Pon tu mejor cara de "no entiendo nada"', category: 'face' },
  { id: 54, challenge: 'Haz la cara que pones cuando ves algo muy tierno', category: 'face' },
  { id: 55, challenge: 'Imita la cara de un gato enfadado', category: 'face' },
  { id: 56, challenge: 'Pon cara de película de terror (pero sin gritar)', category: 'face' },

  // Cuerpo
  { id: 21, challenge: 'Baila 5 segundos como robot', category: 'body' },
  { id: 22, challenge: 'Camina a cámara lenta hasta la otra punta de la habitación', category: 'body' },
  { id: 23, challenge: 'Haz como que nadas en el aire', category: 'body' },
  { id: 24, challenge: 'Imita a un pingüino durante 10 segundos', category: 'body' },
  { id: 25, challenge: 'Haz tu mejor reverencia de rey/reina', category: 'body' },
  { id: 26, challenge: 'Baila flamenco (aunque no sepas)', category: 'body' },
  { id: 27, challenge: 'Imita que estás atrapado/a en una caja invisible', category: 'body' },
  { id: 28, challenge: 'Haz el moonwalk (o inténtalo)', category: 'body' },
  { id: 29, challenge: 'Salta como una rana 3 veces', category: 'body' },
  { id: 30, challenge: 'Haz como que escalas una montaña imaginaria', category: 'body' },
  { id: 57, challenge: 'Haz 10 sentadillas mientras dices "te quiero" en cada una', category: 'body' },
  { id: 58, challenge: 'Baila como si nadie te estuviera mirando (pero sí miran)', category: 'body' },
  { id: 59, challenge: 'Imita a un T-Rex intentando aplaudir', category: 'body' },
  { id: 60, challenge: 'Haz el baile del pollo durante 10 segundos', category: 'body' },
  { id: 61, challenge: 'Finge que pisas un suelo de lava', category: 'body' },
  { id: 62, challenge: 'Camina como un modelo de pasarela', category: 'body' },
  { id: 63, challenge: 'Haz un abrazo de oso a tu pareja', category: 'body' },
  { id: 64, challenge: 'Imita a un astronauta en gravedad cero', category: 'body' },

  // Mixtos
  { id: 31, challenge: 'Declara tu amor a un objeto de la habitación', category: 'mixed' },
  { id: 32, challenge: 'Haz de presentador/a del tiempo por 10 segundos', category: 'mixed' },
  { id: 33, challenge: 'Finge que ganas un Oscar y da tu discurso', category: 'mixed' },
  { id: 34, challenge: 'Haz una entrevista imaginaria a tu pareja como periodista', category: 'mixed' },
  { id: 35, challenge: 'Actúa como si acabaras de ver un fantasma', category: 'mixed' },
  { id: 36, challenge: 'Haz de comentarista deportivo narrando algo que hace tu pareja', category: 'mixed' },
  { id: 37, challenge: 'Finge que eres un chef explicando una receta absurda', category: 'mixed' },
  { id: 38, challenge: 'Imita a un DJ poniendo música imaginaria', category: 'mixed' },
  { id: 39, challenge: 'Haz como que vendes un producto absurdo en la teletienda', category: 'mixed' },
  { id: 40, challenge: 'Baila y canta a la vez tu canción favorita (10 segundos)', category: 'mixed' },
  { id: 65, challenge: 'Cuenta un chiste malo con cara seria', category: 'mixed' },
  { id: 66, challenge: 'Haz una declaración de amor dramática (de rodillas)', category: 'mixed' },
  { id: 67, challenge: 'Imita a tu personaje de serie favorito', category: 'mixed' },
  { id: 68, challenge: 'Di 3 piropos muy cursis a tu pareja', category: 'mixed' },
  { id: 69, challenge: 'Haz de mago/a con un truco imaginario', category: 'mixed' },
  { id: 70, challenge: 'Finge que eres un mimo atrapado en una caja', category: 'mixed' },
  { id: 71, challenge: 'Crea un rap de 10 segundos sobre tu pareja', category: 'mixed' },
  { id: 72, challenge: 'Haz como si fueras un/a superhéroe presentándote', category: 'mixed' },
  { id: 73, challenge: 'Di el abecedario con movimientos de baile', category: 'mixed' },
  { id: 74, challenge: 'Imita a un influencer grabando un story', category: 'mixed' },
  { id: 75, challenge: 'Haz una serenata inventada a tu pareja', category: 'mixed' },
  { id: 76, challenge: 'Finge que eres un/a presentador/a de concurso muy emocionado/a', category: 'mixed' },
];

// Obtener retos aleatorios
export function getRandomChallenges(count: number = 5): SillyChallenge[] {
  const shuffled = [...SILLY_CHALLENGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
