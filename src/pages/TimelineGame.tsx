import { useState } from 'react';
import { Button } from '../components';
import { TimelineIcon } from '../components/icons/GameIcons';
import type { TimelinePrompt } from '../data/timeline';

interface TimelineGameProps {
  prompts: TimelinePrompt[];
  currentRound: number;
  totalRounds: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  onSubmitAnswer: (answer: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

const CATEGORY_COLORS: Record<TimelinePrompt['category'], string> = {
  beginning: '#FFB5C5',
  growth: '#B5EAAA',
  challenges: '#B5D4FF',
  joy: '#FFE5B5',
  dreams: '#E5B5FF',
};

const CATEGORY_LABELS: Record<TimelinePrompt['category'], string> = {
  beginning: 'Comienzos',
  growth: 'Crecimiento',
  challenges: 'Desafíos',
  joy: 'Alegría',
  dreams: 'Sueños',
};

export function TimelineGame({
  prompts,
  currentRound,
  totalRounds,
  myAnswer,
  partnerAnswer,
  bothRevealed,
  onSubmitAnswer,
  onNextRound,
  onFinish,
}: TimelineGameProps) {
  const [inputValue, setInputValue] = useState('');

  const currentPrompt = prompts[currentRound - 1];
  const isLastRound = currentRound >= totalRounds;

  if (!currentPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-cream)]">
        <p className="text-[var(--color-text)]">Cargando momentos...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmitAnswer(inputValue.trim());
      setInputValue('');
    }
  };

  const handleContinue = () => {
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  const categoryColor = CATEGORY_COLORS[currentPrompt.category];
  const categoryLabel = CATEGORY_LABELS[currentPrompt.category];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TimelineIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Nuestra Historia
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Momento {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Timeline visual */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1">
          {prompts.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-2 rounded-full transition-all ${
                idx < currentRound - 1
                  ? 'bg-[var(--color-coral)]'
                  : idx === currentRound - 1
                  ? 'bg-[var(--color-coral)] scale-110'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card del momento */}
      <div className="flex-1 flex flex-col">
        <div
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          style={{ borderLeft: `4px solid ${categoryColor}` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
            <span className="text-2xl">{currentPrompt.emoji}</span>
          </div>

          <p className="text-lg text-[var(--color-text)] font-medium leading-relaxed">
            {currentPrompt.prompt}
          </p>
        </div>

        {/* Input o respuestas */}
        {!myAnswer ? (
          <div className="space-y-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu recuerdo..."
              className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[var(--color-coral)] focus:outline-none resize-none text-[var(--color-text)] min-h-[120px]"
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
              Compartir momento
            </Button>
          </div>
        ) : !bothRevealed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-lavender)] flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
            <p className="text-[var(--color-text)] font-medium mb-2">
              Tu recuerdo está guardado
            </p>
            <p className="text-sm text-[var(--color-text)] opacity-70">
              Esperando a que tu pareja comparta el suyo...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mi recuerdo */}
            <div className="bg-[var(--color-lavender)] rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-70 mb-2">Tu recuerdo:</p>
              <p className="text-[var(--color-text)]">{myAnswer}</p>
            </div>

            {/* Recuerdo de la pareja */}
            <div className="bg-[var(--color-coral)]/20 rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-70 mb-2">Su recuerdo:</p>
              <p className="text-[var(--color-text)]">{partnerAnswer}</p>
            </div>

            {/* Botón continuar */}
            <div className="pt-4">
              <Button onClick={handleContinue}>
                {isLastRound ? 'Ver nuestra historia completa' : 'Siguiente momento'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
