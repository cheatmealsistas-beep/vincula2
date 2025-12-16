import { useState } from 'react';
import { Button } from '../components';
import type { LovePhrase } from '../data/lovephrases';

interface LovePhrasesGameProps {
  phrases: LovePhrase[];
  currentRound: number;
  totalRounds: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  onSubmitAnswer: (answer: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function LovePhrasesGame({
  phrases,
  currentRound,
  totalRounds,
  myAnswer,
  partnerAnswer,
  bothRevealed,
  onSubmitAnswer,
  onNextRound,
  onFinish,
}: LovePhrasesGameProps) {
  const [inputValue, setInputValue] = useState('');
  const currentPhrase = phrases[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  if (!currentPhrase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p>Cargando...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !myAnswer) {
      onSubmitAnswer(inputValue.trim());
      setInputValue('');
    }
  };

  const handleNext = () => {
    setInputValue('');
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">💌</span>
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Te quiero porque...
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Frase {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Prompt */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/90 rounded-3xl p-6 mb-6 shadow-soft text-center">
          <span className="text-4xl mb-3 block">{currentPhrase.emoji}</span>
          <p className="text-xl font-medium text-[var(--color-text)]">
            {currentPhrase.prompt}
          </p>
        </div>

        {/* Input */}
        {!myAnswer ? (
          <div className="space-y-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Completa la frase..."
              className="w-full p-4 rounded-2xl bg-white/80 text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 resize-none outline-none text-base min-h-[120px]"
              maxLength={300}
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
              Enviar
            </Button>
          </div>
        ) : !bothRevealed ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[var(--color-text)] opacity-70">
              Esperando a tu pareja...
            </p>
            <div className="mt-4 bg-white/50 rounded-2xl p-4">
              <p className="text-sm text-[var(--color-text)] opacity-60">Tu respuesta:</p>
              <p className="text-[var(--color-text)] font-medium mt-1 italic">"{myAnswer}"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Revelación */}
            <div className="text-center mb-4">
              <span className="text-3xl">💕</span>
              <p className="text-sm text-[var(--color-text)] opacity-70 mt-1">
                Vuestras respuestas
              </p>
            </div>

            {/* Mi respuesta */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-2">
                Tú escribiste:
              </p>
              <p className="text-[var(--color-text)] italic">"{myAnswer}"</p>
            </div>

            {/* Respuesta del partner */}
            <div className="bg-[var(--color-coral)]/10 rounded-2xl p-4 shadow-soft border-2 border-[var(--color-coral)]/20">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-2">
                Tu pareja escribió:
              </p>
              <p className="text-[var(--color-text)] font-medium italic">"{partnerAnswer}"</p>
            </div>

            {/* Momento de conexión */}
            <div className="text-center py-4">
              <span className="text-2xl">❤️</span>
              <p className="text-sm text-[var(--color-text)] opacity-70 mt-2">
                Leed en voz alta las respuestas del otro
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón siguiente */}
      {bothRevealed && (
        <div className="mt-6">
          <Button onClick={handleNext}>
            {isLastRound ? 'Terminar' : 'Siguiente frase'}
          </Button>
        </div>
      )}
    </div>
  );
}
