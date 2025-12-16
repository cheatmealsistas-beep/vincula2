import { useState, useEffect } from 'react';

interface BreathingCircleProps {
  isActive: boolean;
  partnerJoined?: boolean;
  onComplete?: () => void;
  cycles?: number; // Número de ciclos de respiración
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_DURATION = {
  inhale: 4000,  // 4 segundos inhalar
  hold: 4000,    // 4 segundos aguantar
  exhale: 4000,  // 4 segundos exhalar
  rest: 2000,    // 2 segundos descanso
};

const PHASE_TEXT = {
  inhale: 'Inhala...',
  hold: 'Aguanta...',
  exhale: 'Exhala...',
  rest: 'Relájate...',
};

const PHASE_SCALE = {
  inhale: 1.4,
  hold: 1.4,
  exhale: 1,
  rest: 1,
};

export function BreathingCircle({
  isActive,
  partnerJoined = false,
  onComplete,
  cycles = 4,
}: BreathingCircleProps) {
  const [phase, setPhase] = useState<BreathPhase>('rest');
  const [cycleCount, setCycleCount] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) {
      setPhase('rest');
      setCycleCount(0);
      setScale(1);
      return;
    }

    const phases: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
    let currentPhaseIndex = 0;
    let currentCycle = 0;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase);
      setScale(PHASE_SCALE[currentPhase]);

      const timeout = setTimeout(() => {
        currentPhaseIndex++;

        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0;
          currentCycle++;
          setCycleCount(currentCycle);

          if (currentCycle >= cycles) {
            onComplete?.();
            return;
          }
        }

        runPhase();
      }, PHASE_DURATION[currentPhase]);

      return timeout;
    };

    const timeout = runPhase();

    return () => clearTimeout(timeout);
  }, [isActive, cycles, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Círculo principal */}
      <div className="relative">
        {/* Anillo exterior decorativo */}
        <div
          className="absolute inset-0 rounded-full border-4 border-[var(--color-lavender)]/30"
          style={{
            width: '220px',
            height: '220px',
            left: '-10px',
            top: '-10px',
          }}
        />

        {/* Círculo de respiración */}
        <div
          className="w-[200px] h-[200px] rounded-full flex items-center justify-center transition-all"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: phase === 'inhale' ? '4s' : phase === 'exhale' ? '4s' : '0.3s',
            transitionTimingFunction: 'ease-in-out',
            background: `radial-gradient(circle, var(--color-lavender) 0%, var(--color-coral) 100%)`,
            boxShadow: `0 0 ${scale * 30}px var(--color-lavender)`,
          }}
        >
          {/* Indicador de pareja */}
          {partnerJoined && (
            <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse" />
          )}

          {/* Texto de fase */}
          <span className="text-white font-medium text-lg drop-shadow-md">
            {PHASE_TEXT[phase]}
          </span>
        </div>

        {/* Indicadores de presencia */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-lavender)]" title="Tú" />
          {partnerJoined && (
            <div className="w-3 h-3 rounded-full bg-[var(--color-coral)]" title="Tu pareja" />
          )}
        </div>
      </div>

      {/* Contador de ciclos */}
      <div className="text-center">
        <p className="text-sm text-[var(--color-text)]/60">
          Ciclo {cycleCount + 1} de {cycles}
        </p>
        {partnerJoined && (
          <p className="text-xs text-[var(--color-coral)] mt-1">
            Respirando juntos
          </p>
        )}
      </div>

      {/* Guía visual de fases */}
      <div className="flex gap-2">
        {['inhale', 'hold', 'exhale', 'rest'].map((p) => (
          <div
            key={p}
            className={`w-2 h-2 rounded-full transition-all ${
              phase === p
                ? 'bg-[var(--color-coral)] scale-125'
                : 'bg-[var(--color-text)]/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
