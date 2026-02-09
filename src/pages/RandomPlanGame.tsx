import { useState, useEffect } from 'react';
import { Button } from '../components';
import type { HalfPlanResult, FullPlanResult } from '../data/randomplan';
import { getCategoryById } from '../data/randomplan';
import { celebrateFinish } from '../utils/celebrations';

interface RandomPlanGameProps {
  myHalfPlan: HalfPlanResult | null;
  partnerHalfPlan: HalfPlanResult | null;
  fullPlan: FullPlanResult | null;
  hasRolled: boolean;
  partnerHasRolled: boolean;
  bothRevealed: boolean;
  myCategories: readonly string[];
  myLocked: boolean;
  partnerLocked: boolean;
  canReroll: boolean;
  onRollDice: () => void;
  onRerollOption: (optionNumber: 1 | 2) => void;
  onLock: () => void;
  onFinish: () => void;
}

function DiceAnimation({ rolling }: { rolling: boolean }) {
  return (
    <div className={`text-6xl ${rolling ? 'animate-bounce' : ''}`}>
      🎲
    </div>
  );
}

function HalfPlanCard({
  halfPlan,
  categories,
  title,
  highlight = false,
  showReroll = false,
  onRerollOption,
}: {
  halfPlan: HalfPlanResult;
  categories: readonly string[];
  title: string;
  highlight?: boolean;
  showReroll?: boolean;
  onRerollOption?: (optionNumber: 1 | 2) => void;
}) {
  const cat1 = getCategoryById(categories[0]);
  const cat2 = getCategoryById(categories[1]);

  return (
    <div className={`rounded-2xl p-4 shadow-soft ${highlight ? 'bg-[var(--color-coral)]/10 border-2 border-[var(--color-coral)]/20' : 'bg-white'}`}>
      <p className="text-xs text-[var(--color-text)] opacity-60 mb-3 text-center">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-white/50 rounded-xl">
          <span className="text-3xl block mb-1">{halfPlan.option1.emoji}</span>
          <p className="text-xs text-[var(--color-text)] opacity-50">{cat1?.name}</p>
          <p className="text-sm font-medium text-[var(--color-text)]">{halfPlan.option1.text}</p>
          {showReroll && onRerollOption && (
            <button
              onClick={() => onRerollOption(1)}
              className="mt-2 text-xs text-[var(--color-coral)] font-medium py-1 px-2 hover:bg-[var(--color-coral)]/10 rounded-lg transition-colors"
            >
              🎲 Cambiar
            </button>
          )}
        </div>
        <div className="text-center p-3 bg-white/50 rounded-xl">
          <span className="text-3xl block mb-1">{halfPlan.option2.emoji}</span>
          <p className="text-xs text-[var(--color-text)] opacity-50">{cat2?.name}</p>
          <p className="text-sm font-medium text-[var(--color-text)]">{halfPlan.option2.text}</p>
          {showReroll && onRerollOption && (
            <button
              onClick={() => onRerollOption(2)}
              className="mt-2 text-xs text-[var(--color-coral)] font-medium py-1 px-2 hover:bg-[var(--color-coral)]/10 rounded-lg transition-colors"
            >
              🎲 Cambiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FullPlanDisplay({ plan }: { plan: FullPlanResult }) {
  return (
    <div className="bg-gradient-to-br from-[var(--color-coral)]/20 to-[var(--color-cream)] rounded-2xl p-5 shadow-soft border-2 border-[var(--color-coral)]/30">
      <div className="text-center mb-4">
        <span className="text-3xl">✨</span>
        <p className="text-lg font-bold text-[var(--color-text)] mt-1">
          Vuestro Plan
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
          <span className="text-2xl">{plan.activity.emoji}</span>
          <div>
            <p className="text-xs text-[var(--color-text)] opacity-50">Actividad</p>
            <p className="font-medium text-[var(--color-text)]">{plan.activity.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
          <span className="text-2xl">{plan.food.emoji}</span>
          <div>
            <p className="text-xs text-[var(--color-text)] opacity-50">Comida</p>
            <p className="font-medium text-[var(--color-text)]">{plan.food.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
          <span className="text-2xl">{plan.mood.emoji}</span>
          <div>
            <p className="text-xs text-[var(--color-text)] opacity-50">Ambiente</p>
            <p className="font-medium text-[var(--color-text)]">{plan.mood.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
          <span className="text-2xl">{plan.extra.emoji}</span>
          <div>
            <p className="text-xs text-[var(--color-text)] opacity-50">Extra</p>
            <p className="font-medium text-[var(--color-text)]">{plan.extra.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RandomPlanGame({
  myHalfPlan,
  partnerHalfPlan,
  fullPlan,
  hasRolled,
  partnerHasRolled,
  bothRevealed,
  myCategories,
  myLocked,
  partnerLocked,
  canReroll,
  onRollDice,
  onRerollOption,
  onLock,
  onFinish,
}: RandomPlanGameProps) {
  const [rolling, setRolling] = useState(false);

  // Confetti cuando se revela el plan completo
  useEffect(() => {
    if (bothRevealed && fullPlan) {
      celebrateFinish();
    }
  }, [bothRevealed, fullPlan]);

  const handleRoll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
      onRollDice();
    }, 1000);
  };

  // Nombres de las categorías que me tocan
  const cat1 = getCategoryById(myCategories[0]);
  const cat2 = getCategoryById(myCategories[1]);
  const myCategoriesText = `${cat1?.name} + ${cat2?.name}`;

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">🎲</span>
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Plan Random
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Cada uno aporta la mitad del plan
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {!hasRolled ? (
          // Antes de tirar
          <div className="flex-1 flex flex-col items-center justify-center">
            <DiceAnimation rolling={rolling} />
            <p className="text-[var(--color-text)] mt-6 mb-2 text-center font-medium">
              Te toca elegir:
            </p>
            <p className="text-[var(--color-coral)] mb-8 text-center text-lg font-bold">
              {myCategoriesText}
            </p>
            <Button onClick={handleRoll} disabled={rolling}>
              {rolling ? 'Tirando...' : '¡Tirar dados!'}
            </Button>
          </div>
        ) : !bothRevealed ? (
          // Esperando al otro
          <div className="flex-1 flex flex-col">
            <HalfPlanCard
              halfPlan={myHalfPlan!}
              categories={myCategories}
              title={myLocked ? "Tu aportación (bloqueada)" : "Tu aportación al plan"}
              highlight={myLocked}
              showReroll={canReroll}
              onRerollOption={onRerollOption}
            />

            {/* Botón para bloquear mi parte */}
            {hasRolled && !myLocked && (
              <div className="mt-4">
                <Button onClick={onLock}>
                  {partnerLocked ? '¡Listo! Ver plan' : 'Me gusta, ¡bloquear!'}
                </Button>
                <p className="text-xs text-center text-[var(--color-text)] opacity-50 mt-2">
                  {partnerLocked
                    ? 'Tu pareja ya aceptó. Bloquea para ver el plan completo.'
                    : 'Puedes seguir tirando hasta que estés contento'}
                </p>
              </div>
            )}

            {/* Estado de espera */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                {myLocked && !partnerHasRolled ? (
                  <>
                    <div className="text-3xl mb-3">🔒</div>
                    <p className="text-[var(--color-text)] opacity-70">
                      Tu parte está bloqueada
                    </p>
                    <p className="text-xs text-[var(--color-text)] opacity-50 mt-2">
                      Tu pareja está tirando...
                    </p>
                  </>
                ) : myLocked && partnerHasRolled && !partnerLocked ? (
                  <>
                    <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[var(--color-text)] opacity-70">
                      Tu pareja ya tiró
                    </p>
                    <p className="text-xs text-[var(--color-text)] opacity-50 mt-2">
                      Tu pareja está decidiendo...
                    </p>
                  </>
                ) : !myLocked && partnerHasRolled ? (
                  <>
                    <div className="text-3xl mb-3">✨</div>
                    <p className="text-[var(--color-text)] opacity-70">
                      {partnerLocked ? 'Tu pareja ya bloqueó su parte' : 'Tu pareja ya tiró sus dados'}
                    </p>
                    <p className="text-xs text-[var(--color-text)] opacity-50 mt-2">
                      {partnerLocked ? 'Bloquea la tuya para ver el plan completo' : 'Cada uno puede seguir tirando hasta estar contento'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[var(--color-text)] opacity-70">
                      Le toca a tu pareja...
                    </p>
                    <p className="text-xs text-[var(--color-text)] opacity-50 mt-2">
                      Le toca elegir la otra mitad
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Ambos han tirado - mostrar plan completo
          <div className="space-y-4">
            {/* Plan completo */}
            {fullPlan && <FullPlanDisplay plan={fullPlan} />}

            {/* Desglose de quién aportó qué */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/60 rounded-xl p-3 text-center">
                <p className="text-xs text-[var(--color-text)] opacity-50 mb-1">Tú elegiste</p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {myHalfPlan?.option1.emoji} {myHalfPlan?.option2.emoji}
                </p>
              </div>
              <div className="bg-[var(--color-coral)]/10 rounded-xl p-3 text-center">
                <p className="text-xs text-[var(--color-text)] opacity-50 mb-1">Tu pareja eligió</p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {partnerHalfPlan?.option1.emoji} {partnerHalfPlan?.option2.emoji}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Botón terminar */}
      {bothRevealed && (
        <div className="mt-6">
          <Button onClick={onFinish}>
            ¡A planear!
          </Button>
        </div>
      )}
    </div>
  );
}
