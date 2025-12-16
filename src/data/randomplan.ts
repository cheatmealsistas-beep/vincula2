// Plan Random - Dados para crear planes sorpresa colaborativos
// Player 1 tira: Actividad + Comida
// Player 2 tira: Ambiente + Extra

export interface PlanOption {
  id: string;
  text: string;
  emoji: string;
}

export interface PlanCategory {
  id: string;
  name: string;
  emoji: string;
  options: PlanOption[];
}

export const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: 'activity',
    name: 'Actividad',
    emoji: '🎯',
    options: [
      { id: 'act-1', text: 'Paseo', emoji: '🚶' },
      { id: 'act-2', text: 'Peli en casa', emoji: '🎬' },
      { id: 'act-3', text: 'Cocinar juntos', emoji: '👨‍🍳' },
      { id: 'act-4', text: 'Juego de mesa', emoji: '🎲' },
      { id: 'act-5', text: 'Masajes', emoji: '💆' },
      { id: 'act-6', text: 'Bailar', emoji: '💃' },
    ],
  },
  {
    id: 'food',
    name: 'Comida',
    emoji: '🍽️',
    options: [
      { id: 'food-1', text: 'Cena romántica', emoji: '🕯️' },
      { id: 'food-2', text: 'Picnic', emoji: '🧺' },
      { id: 'food-3', text: 'Desayuno en la cama', emoji: '🥐' },
      { id: 'food-4', text: 'Helado', emoji: '🍦' },
      { id: 'food-5', text: 'Pizza casera', emoji: '🍕' },
      { id: 'food-6', text: 'Brunch', emoji: '🥞' },
    ],
  },
  {
    id: 'mood',
    name: 'Ambiente',
    emoji: '✨',
    options: [
      { id: 'mood-1', text: 'Velas y música', emoji: '🕯️' },
      { id: 'mood-2', text: 'Bajo las estrellas', emoji: '⭐' },
      { id: 'mood-3', text: 'En pijama', emoji: '😴' },
      { id: 'mood-4', text: 'Elegantes', emoji: '👗' },
      { id: 'mood-5', text: 'Modo aventura', emoji: '🏕️' },
      { id: 'mood-6', text: 'Modo relax', emoji: '🧘' },
    ],
  },
  {
    id: 'extra',
    name: 'Extra',
    emoji: '🎁',
    options: [
      { id: 'extra-1', text: 'Sin móviles', emoji: '📵' },
      { id: 'extra-2', text: 'Fotos juntos', emoji: '📸' },
      { id: 'extra-3', text: 'Carta de amor', emoji: '💌' },
      { id: 'extra-4', text: 'Momento sexy', emoji: '🔥' },
      { id: 'extra-5', text: 'Sorpresa', emoji: '🎉' },
      { id: 'extra-6', text: 'Música en vivo', emoji: '🎸' },
    ],
  },
];

// Qué categorías tira cada jugador
export const PLAYER1_CATEGORIES = ['activity', 'food'] as const;
export const PLAYER2_CATEGORIES = ['mood', 'extra'] as const;

export interface HalfPlanResult {
  option1: PlanOption;
  option2: PlanOption;
}

export interface FullPlanResult {
  activity: PlanOption;
  food: PlanOption;
  mood: PlanOption;
  extra: PlanOption;
}

export function rollHalfPlan(playerNumber: 1 | 2): HalfPlanResult {
  const categories = playerNumber === 1 ? PLAYER1_CATEGORIES : PLAYER2_CATEGORIES;

  const getRandomOption = (categoryId: string): PlanOption => {
    const category = PLAN_CATEGORIES.find(c => c.id === categoryId);
    if (!category) throw new Error(`Category ${categoryId} not found`);
    const randomIndex = Math.floor(Math.random() * category.options.length);
    return category.options[randomIndex];
  };

  return {
    option1: getRandomOption(categories[0]),
    option2: getRandomOption(categories[1]),
  };
}

export function getPlanOptionById(id: string): PlanOption | undefined {
  for (const category of PLAN_CATEGORIES) {
    const option = category.options.find(o => o.id === id);
    if (option) return option;
  }
  return undefined;
}

export function encodeHalfPlan(plan: HalfPlanResult): string {
  return `${plan.option1.id}|${plan.option2.id}`;
}

export function decodeHalfPlan(encoded: string): HalfPlanResult | null {
  const parts = encoded.split('|');
  if (parts.length !== 2) return null;

  const option1 = getPlanOptionById(parts[0]);
  const option2 = getPlanOptionById(parts[1]);

  if (!option1 || !option2) return null;

  return { option1, option2 };
}

export function combineHalfPlans(player1Plan: HalfPlanResult, player2Plan: HalfPlanResult): FullPlanResult {
  return {
    activity: player1Plan.option1,
    food: player1Plan.option2,
    mood: player2Plan.option1,
    extra: player2Plan.option2,
  };
}

export function getCategoryById(id: string): PlanCategory | undefined {
  return PLAN_CATEGORIES.find(c => c.id === id);
}
