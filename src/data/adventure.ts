// Datos para el juego de Aventura - Estilo Pixel Art

// Avatares pixel art (referencian a los personajes en PixelCharacter.tsx)
export interface Avatar {
  id: string;
  name: string;
  color: string;
}

export const AVATARS: Avatar[] = [
  { id: 'luna', name: 'Luna', color: '#FF6B9D' },
  { id: 'sol', name: 'Sol', color: '#4A90D9' },
  { id: 'coral', name: 'Coral', color: '#FF4081' },
  { id: 'marino', name: 'Marino', color: '#00BCD4' },
  { id: 'violeta', name: 'Violeta', color: '#9D8DF1' },
  { id: 'olivo', name: 'Olivo', color: '#7BC67B' },
  { id: 'alba', name: 'Alba', color: '#FFD700' },
  { id: 'noche', name: 'Noche', color: '#483D8B' },
];

// Tipos de eventos
export type EventType = 'story' | 'choice' | 'minigame' | 'reallife' | 'treasure';

export interface MapEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  // Nuevo: escenario pixel art
  sceneId: string;
  // Nuevo: diálogo para bocadillo
  dialog?: string;
  // Nuevo: NPC en la escena
  npc?: string;
  // Para decisiones
  choices?: {
    text: string;
    result: string;
    points?: number;
  }[];
  // Para minijuegos
  minigame?: 'tap' | 'sync' | 'memory';
  // Para retos vida real
  challenge?: string;
}

// Paleta de colores por aventura
export interface AdventurePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

// Historias/Aventuras disponibles
export interface Adventure {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: string;
  palette: AdventurePalette;
  events: MapEvent[];
  duration: number;
}

export const ADVENTURES: Adventure[] = [
  {
    id: 'enchanted-supermarket',
    name: 'El Súper Encantado',
    description: 'Ir a comprar... pero el supermercado está embrujado',
    emoji: '🛒',
    theme: 'shopping-fantasy',
    palette: {
      primary: '#4A90D9',
      secondary: '#7BC67B',
      accent: '#FFD700',
      background: '#E8F4F8',
    },
    duration: 3,
    events: [
      {
        id: 'entrance',
        type: 'story',
        title: '¡Bienvenidos!',
        description: 'Entráis al supermercado y las puertas se cierran mágicamente detrás de vosotros. Un carrito cobra vida y os saluda.',
        sceneId: 'supermarket-entrance',
        dialog: '¡Mira, las puertas se cerraron solas!',
      },
      {
        id: 'frozen-aisle',
        type: 'choice',
        title: 'Pasillo Congelado',
        description: 'El pasillo de congelados está cubierto de nieve real. Un pingüino os mira expectante.',
        sceneId: 'frozen-aisle',
        dialog: '¡Un pingüino! ¿Qué hacemos?',
        npc: 'penguin',
        choices: [
          { text: 'Hacerle una reverencia', result: 'El pingüino os da un helado mágico. ¡Delicioso!', points: 10 },
          { text: 'Lanzarle una bola de nieve', result: 'Empieza una guerra de bolas de nieve épica.', points: 15 },
        ],
      },
      {
        id: 'fruit-forest',
        type: 'minigame',
        title: 'Bosque de Frutas',
        description: 'Las frutas flotan en el aire. ¡Tocad juntos las que brillan!',
        sceneId: 'fruit-section',
        dialog: '¡Las frutas vuelan! ¡Atrápemoslas!',
        minigame: 'tap',
      },
      {
        id: 'bakery-dragon',
        type: 'choice',
        title: 'El Dragón Pastelero',
        description: 'Un pequeño dragón hornea pan con su fuego. Os ofrece una barra recién hecha.',
        sceneId: 'bakery-dragon',
        dialog: '¡Qué olor a pan recién hecho!',
        npc: 'dragon',
        choices: [
          { text: 'Aceptar el pan', result: 'El pan está calentito y huele increíble. El dragón sonríe.', points: 10 },
          { text: 'Pedirle que os enseñe', result: 'El dragón os enseña a hornear con fuego mágico.', points: 20 },
        ],
      },
      {
        id: 'kiss-aisle',
        type: 'reallife',
        title: 'Pasillo del Amor',
        description: 'Este pasillo tiene un hechizo especial...',
        sceneId: 'love-aisle',
        dialog: 'Siento algo mágico aquí...',
        challenge: 'Daos un beso para romper el hechizo',
      },
      {
        id: 'checkout',
        type: 'story',
        title: 'La Caja Mágica',
        description: 'La cajera es una bruja amable que os despide con un "¡Volved pronto, parejita!"',
        sceneId: 'magic-checkout',
        dialog: '¡Gracias por venir!',
        npc: 'witch',
      },
      {
        id: 'treasure',
        type: 'treasure',
        title: '¡Aventura Completada!',
        description: '¡Habéis completado la aventura del Súper Encantado!',
        sceneId: 'magic-checkout',
        dialog: '¡Lo conseguimos juntos!',
      },
    ],
  },
  {
    id: 'cooking-potion',
    name: 'La Poción de Amor',
    description: 'Cocinar juntos... pero es una poción mágica',
    emoji: '🧪',
    theme: 'cooking-fantasy',
    palette: {
      primary: '#9D4EDD',
      secondary: '#FF6B9D',
      accent: '#00D9C0',
      background: '#F0E8F8',
    },
    duration: 3,
    events: [
      {
        id: 'recipe',
        type: 'story',
        title: 'La Receta Secreta',
        description: 'Encontráis un libro de pociones antiguo. La página de "Amor Eterno" brilla suavemente.',
        sceneId: 'potion-kitchen',
        dialog: '¡Mira este libro antiguo!',
      },
      {
        id: 'ingredients',
        type: 'choice',
        title: 'Los Ingredientes',
        description: 'Necesitáis el ingrediente secreto. ¿Cuál elegís?',
        sceneId: 'potion-pantry',
        dialog: '¿Qué ingrediente ponemos?',
        choices: [
          { text: 'Pétalos de rosa', result: 'La poción huele a jardín de primavera.', points: 10 },
          { text: 'Chocolate', result: 'La poción sabe a los mejores recuerdos juntos.', points: 15 },
          { text: 'Lágrimas de risa', result: 'Os hacéis cosquillas hasta llorar de risa.', points: 20 },
        ],
      },
      {
        id: 'stir',
        type: 'minigame',
        title: '¡A Remover!',
        description: 'Tocad al mismo tiempo para remover la poción en sincronía.',
        sceneId: 'potion-cauldron',
        dialog: '¡Hay que removerla juntos!',
        minigame: 'sync',
      },
      {
        id: 'taste',
        type: 'reallife',
        title: 'Probar la Poción',
        description: 'La poción está lista...',
        sceneId: 'potion-table',
        dialog: 'Es hora de brindar...',
        challenge: 'Brindad con vuestras bebidas favoritas',
      },
      {
        id: 'magic',
        type: 'treasure',
        title: '¡Magia!',
        description: 'La poción brilla y llena la habitación de corazones flotantes.',
        sceneId: 'potion-magic',
        dialog: '¡Funcionó! ¡Es mágico!',
      },
    ],
  },
  {
    id: 'movie-night',
    name: 'Cine Interdimensional',
    description: 'Ver una peli... pero os metéis dentro',
    emoji: '🎬',
    theme: 'movie-fantasy',
    palette: {
      primary: '#1A1A2E',
      secondary: '#E94560',
      accent: '#FFD93D',
      background: '#16213E',
    },
    duration: 3,
    events: [
      {
        id: 'portal',
        type: 'story',
        title: 'El Portal',
        description: 'La pantalla del televisor empieza a brillar... ¡Os absorbe dentro de la película!',
        sceneId: 'cinema-living',
        dialog: '¡La tele brilla! ¿Qué pasa?',
      },
      {
        id: 'genre',
        type: 'choice',
        title: '¿Qué Película?',
        description: 'Aparecen tres puertas brillantes. ¿A qué género entráis?',
        sceneId: 'cinema-doors',
        dialog: '¿Qué puerta elegimos?',
        choices: [
          { text: 'Romántica', result: 'Aparecéis en París bajo la lluvia, con un solo paraguas.', points: 15 },
          { text: 'Aventuras', result: 'Estáis en una selva con un mapa del tesoro.', points: 15 },
          { text: 'Comedia', result: 'Todo lo que decís sale al revés y os hace reír.', points: 15 },
        ],
      },
      {
        id: 'scene',
        type: 'minigame',
        title: 'La Escena Clave',
        description: '¡Tenéis que actuar la escena! Tocad cuando el corazón aparezca.',
        sceneId: 'cinema-stage',
        dialog: '¡Es nuestra escena!',
        minigame: 'tap',
      },
      {
        id: 'romantic-scene',
        type: 'reallife',
        title: 'Momento Estelar',
        description: 'Es vuestra escena romántica...',
        sceneId: 'cinema-romantic',
        dialog: 'Este momento es nuestro...',
        challenge: 'Abrazaos durante 10 segundos',
      },
      {
        id: 'credits',
        type: 'treasure',
        title: '¡Créditos!',
        description: 'Aparecéis en los créditos como "La Mejor Pareja del Universo".',
        sceneId: 'cinema-credits',
        dialog: '¡Somos estrellas de cine!',
      },
    ],
  },
];

export function getRandomAdventure(): Adventure {
  return ADVENTURES[Math.floor(Math.random() * ADVENTURES.length)];
}

export function getAdventureById(id: string): Adventure | undefined {
  return ADVENTURES.find((a) => a.id === id);
}

export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id);
}
