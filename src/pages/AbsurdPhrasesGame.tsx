import { useState, useEffect } from 'react';
import { Button } from '../components';
import { AbsurdPhrasesIcon } from '../components/icons/GameIcons';
import { celebrateMatch } from '../utils/celebrations';
import type { AbsurdPhrase } from '../data/absurdphrases';

interface AbsurdPhrasesGameProps {
  phrases: AbsurdPhrase[];
  currentRound: number;
  totalRounds: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  onSubmitAnswer: (answer: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function AbsurdPhrasesGame({
  phrases,
  currentRound,
  totalRounds,
  myAnswer,
  partnerAnswer,
  bothRevealed,
  onSubmitAnswer,
  onNextRound,
  onFinish,
}: AbsurdPhrasesGameProps) {
  const [answer, setAnswer] = useState('');
  const currentPhrase = phrases[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  // Confeti cuando se revelan las frases
  useEffect(() => {
    if (bothRevealed) {
      celebrateMatch();
    }
  }, [bothRevealed]);

  if (!currentPhrase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text)]">Preparando frases...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleNext = () => {
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  // Categoría a emoji
  const categoryEmoji = {
    random: '🎲',
    couple: '💑',
    fantasy: '✨',
    confession: '🤫',
  }[currentPhrase.category];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AbsurdPhrasesIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Completa la Frase
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Ronda {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Frase */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <span className="text-3xl mb-3 block text-center">{categoryEmoji}</span>
        <p className="text-lg font-semibold text-[var(--color-text)] text-center leading-relaxed">
          {currentPhrase.phrase}
        </p>
      </div>

      {/* Input o respuestas */}
      <div className="flex-1">
        {!myAnswer ? (
          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe lo primero que se te ocurra..."
              className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[var(--color-coral)] focus:outline-none resize-none text-[var(--color-text)] min-h-[120px]"
              maxLength={200}
            />
            <p className="text-xs text-right text-gray-400">
              {answer.length}/200
            </p>
          </div>
        ) : !bothRevealed ? (
          <div className="text-center py-8">
            <div className="bg-[var(--color-coral)]/10 rounded-2xl p-6 mb-4">
              <p className="text-sm text-[var(--color-text)] opacity-70 mb-2">Tu respuesta:</p>
              <p className="font-medium text-[var(--color-text)]">
                {currentPhrase.phrase} <span className="text-[var(--color-coral)]">{myAnswer}</span>
              </p>
            </div>
            <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[var(--color-text)] opacity-70">
              Tu pareja está pensando...
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-up">
            {/* Tu respuesta */}
            <div className="bg-[var(--color-coral)]/10 rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-70 mb-1">Tú:</p>
              <p className="font-medium text-[var(--color-text)]">
                {currentPhrase.phrase} <span className="text-[var(--color-coral)]">{myAnswer}</span>
              </p>
            </div>

            {/* Respuesta de la pareja */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-70 mb-1">Tu pareja:</p>
              <p className="font-medium text-[var(--color-text)]">
                {currentPhrase.phrase} <span className="text-blue-600">{partnerAnswer}</span>
              </p>
            </div>

            {/* Reacción random */}
            <div className="text-center py-4">
              <span className="text-4xl">
                {['😂', '🤣', '😆', '🙈', '💀'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-3 mt-6">
        {!myAnswer ? (
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            Enviar
          </Button>
        ) : bothRevealed ? (
          <Button onClick={handleNext}>
            {isLastRound ? '¡Listo!' : 'Siguiente frase'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
