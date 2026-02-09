import { useState, useEffect } from 'react';
import { Button } from '../components';
import { WouldYouRatherIcon } from '../components/icons/GameIcons';
import type { WouldYouRatherCard } from '../data/wouldyourather';
import { celebrateMatch, triggerOops } from '../utils/celebrations';

interface WouldYouRatherGameProps {
  cards: WouldYouRatherCard[];
  currentRound: number;
  totalRounds: number;
  myChoice: 'A' | 'B' | null;
  partnerChoice: 'A' | 'B' | null;
  bothRevealed: boolean;
  onSubmitChoice: (choice: 'A' | 'B') => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function WouldYouRatherGame({
  cards,
  currentRound,
  totalRounds,
  myChoice,
  partnerChoice,
  bothRevealed,
  onSubmitChoice,
  onNextRound,
  onFinish,
}: WouldYouRatherGameProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [oopsData, setOopsData] = useState<{ emoji: string; message: string } | null>(null);
  const currentCard = cards[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  // Animaciones cuando se revelan las respuestas
  useEffect(() => {
    if (bothRevealed && myChoice && partnerChoice) {
      if (myChoice === partnerChoice) {
        celebrateMatch();
        setOopsData(null);
      } else {
        setOopsData(triggerOops());
      }
    }
  }, [bothRevealed, myChoice, partnerChoice]);

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text)]">Preparando dilemas...</p>
        </div>
      </div>
    );
  }

  const handleSelect = (option: 'A' | 'B') => {
    if (!myChoice) {
      setSelectedOption(option);
    }
  };

  const handleConfirm = () => {
    if (selectedOption && !myChoice) {
      onSubmitChoice(selectedOption);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setOopsData(null);
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  // Determinar si coincidieron
  const matched = bothRevealed && myChoice === partnerChoice;

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <WouldYouRatherIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            ¿Qué prefieres?
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Ronda {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Opciones */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Opción A */}
        <button
          onClick={() => handleSelect('A')}
          disabled={!!myChoice}
          className={`
            p-6 rounded-2xl text-left transition-all duration-300
            ${myChoice
              ? bothRevealed
                ? myChoice === 'A' && partnerChoice === 'A'
                  ? 'bg-green-100 ring-4 ring-green-400'
                  : myChoice === 'A'
                    ? 'bg-[var(--color-coral)]/20 ring-2 ring-[var(--color-coral)]'
                    : partnerChoice === 'A'
                      ? 'bg-blue-100 ring-2 ring-blue-400'
                      : 'bg-white/50'
                : myChoice === 'A'
                  ? 'bg-[var(--color-coral)]/20 ring-2 ring-[var(--color-coral)]'
                  : 'bg-white/50'
              : selectedOption === 'A'
                ? 'bg-white ring-2 ring-[var(--color-coral)] scale-[1.02]'
                : 'bg-white/80 active:scale-[0.98]'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🅰️</span>
            <p className="text-[var(--color-text)] font-medium leading-snug">
              {currentCard.optionA}
            </p>
          </div>
          {bothRevealed && (
            <div className="mt-3 flex gap-2">
              {myChoice === 'A' && (
                <span className="text-xs bg-[var(--color-coral)]/30 px-2 py-1 rounded-full">
                  Tú
                </span>
              )}
              {partnerChoice === 'A' && (
                <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">
                  Tu pareja
                </span>
              )}
            </div>
          )}
        </button>

        {/* VS */}
        <div className="text-center">
          <span className="text-lg font-bold text-[var(--color-text)] opacity-50">
            VS
          </span>
        </div>

        {/* Opción B */}
        <button
          onClick={() => handleSelect('B')}
          disabled={!!myChoice}
          className={`
            p-6 rounded-2xl text-left transition-all duration-300
            ${myChoice
              ? bothRevealed
                ? myChoice === 'B' && partnerChoice === 'B'
                  ? 'bg-green-100 ring-4 ring-green-400'
                  : myChoice === 'B'
                    ? 'bg-[var(--color-coral)]/20 ring-2 ring-[var(--color-coral)]'
                    : partnerChoice === 'B'
                      ? 'bg-blue-100 ring-2 ring-blue-400'
                      : 'bg-white/50'
                : myChoice === 'B'
                  ? 'bg-[var(--color-coral)]/20 ring-2 ring-[var(--color-coral)]'
                  : 'bg-white/50'
              : selectedOption === 'B'
                ? 'bg-white ring-2 ring-[var(--color-coral)] scale-[1.02]'
                : 'bg-white/80 active:scale-[0.98]'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🅱️</span>
            <p className="text-[var(--color-text)] font-medium leading-snug">
              {currentCard.optionB}
            </p>
          </div>
          {bothRevealed && (
            <div className="mt-3 flex gap-2">
              {myChoice === 'B' && (
                <span className="text-xs bg-[var(--color-coral)]/30 px-2 py-1 rounded-full">
                  Tú
                </span>
              )}
              {partnerChoice === 'B' && (
                <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">
                  Tu pareja
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Feedback de coincidencia */}
      {bothRevealed && (
        <div className={`
          text-center py-4 px-6 rounded-2xl mb-4 animate-fade-up
          ${matched ? 'bg-green-100' : 'bg-yellow-50'}
          ${!matched ? 'animate-shake' : ''}
        `}>
          {matched ? (
            <>
              <span className="text-3xl">❤️</span>
              <p className="font-semibold text-green-700 mt-1">
                ¡Pensáis igual!
              </p>
            </>
          ) : (
            <>
              <span className="text-3xl">{oopsData?.emoji || '🙈'}</span>
              <p className="font-semibold text-yellow-700 mt-1">
                {oopsData?.message || '¡Ups! Pensáis diferente'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-3">
        {!myChoice ? (
          <Button
            onClick={handleConfirm}
            disabled={!selectedOption}
          >
            Confirmar elección
          </Button>
        ) : !bothRevealed ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[var(--color-text)] opacity-70">
              Tu pareja está pensando...
            </p>
          </div>
        ) : (
          <Button onClick={handleNext}>
            {isLastRound ? '¡Listo!' : 'Siguiente dilema'}
          </Button>
        )}
      </div>
    </div>
  );
}
