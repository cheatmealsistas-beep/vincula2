import { useState } from 'react';
import { Button } from '../components';
import { TimeCardsIcon } from '../components/icons/GameIcons';
import { TIMEFRAME_COLORS, TIMEFRAME_LABELS, type TimeCard } from '../data/timecards';

interface TimeCardsGameProps {
  cards: TimeCard[];
  currentRound: number;
  totalRounds: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  onSubmitAnswer: (answer: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function TimeCardsGame({
  cards,
  currentRound,
  totalRounds,
  myAnswer,
  partnerAnswer,
  bothRevealed,
  onSubmitAnswer,
  onNextRound,
  onFinish,
}: TimeCardsGameProps) {
  const [inputValue, setInputValue] = useState('');
  const currentCard = cards[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  if (!currentCard) {
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

  const timeframeColor = TIMEFRAME_COLORS[currentCard.timeframe];
  const timeframeLabel = TIMEFRAME_LABELS[currentCard.timeframe];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TimeCardsIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Cartas del Tiempo
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Carta {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Indicador de línea temporal */}
      <div className="flex justify-center gap-2 mb-6">
        {['past', 'present', 'future'].map((tf) => (
          <div
            key={tf}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              tf === currentCard.timeframe
                ? 'scale-110 shadow-md'
                : 'opacity-40'
            }`}
            style={{
              backgroundColor: tf === currentCard.timeframe
                ? TIMEFRAME_COLORS[tf as keyof typeof TIMEFRAME_COLORS]
                : '#e5e5e5',
              color: tf === currentCard.timeframe ? 'white' : '#666',
            }}
          >
            {TIMEFRAME_LABELS[tf as keyof typeof TIMEFRAME_LABELS]}
          </div>
        ))}
      </div>

      {/* Carta */}
      <div className="flex-1 flex flex-col">
        <div
          className="rounded-2xl p-6 mb-6 shadow-soft relative overflow-hidden"
          style={{ backgroundColor: `${timeframeColor}15` }}
        >
          {/* Emoji decorativo */}
          <div className="text-4xl text-center mb-4">{currentCard.emoji}</div>

          {/* Etiqueta de timeframe */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: timeframeColor }}
          >
            {timeframeLabel}
          </div>

          {/* Prompt */}
          <p className="text-lg font-medium text-[var(--color-text)] text-center">
            {currentCard.prompt}
          </p>
        </div>

        {/* Input de respuesta */}
        {!myAnswer ? (
          <div className="space-y-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Comparte tu reflexión..."
              className="w-full p-4 rounded-2xl bg-white/80 text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 resize-none outline-none text-base min-h-[120px]"
              style={{ borderColor: timeframeColor, borderWidth: '2px' }}
              maxLength={300}
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
              Compartir
            </Button>
          </div>
        ) : !bothRevealed ? (
          <div className="text-center py-8">
            <div
              className="w-6 h-6 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: timeframeColor }}
            />
            <p className="text-[var(--color-text)] opacity-70">
              Esperando a tu pareja...
            </p>
            <div
              className="mt-4 rounded-2xl p-4"
              style={{ backgroundColor: `${timeframeColor}20` }}
            >
              <p className="text-sm text-[var(--color-text)] opacity-60">Tu respuesta:</p>
              <p className="text-[var(--color-text)] font-medium mt-1">{myAnswer}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Respuestas reveladas */}
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: `${timeframeColor}15` }}
            >
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-1">Tú:</p>
              <p className="text-[var(--color-text)] font-medium">{myAnswer}</p>
            </div>

            <div className="bg-[var(--color-coral)]/10 rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-1">Tu pareja:</p>
              <p className="text-[var(--color-text)] font-medium">{partnerAnswer}</p>
            </div>

            {/* Mensaje reflexivo según timeframe */}
            <div className="text-center py-4">
              <span className="text-3xl">
                {currentCard.timeframe === 'past' && '🕰️'}
                {currentCard.timeframe === 'present' && '💫'}
                {currentCard.timeframe === 'future' && '🌟'}
              </span>
              <p className="text-sm text-[var(--color-text)] opacity-70 mt-2">
                {currentCard.timeframe === 'past' && 'El pasado os ha construido'}
                {currentCard.timeframe === 'present' && 'El presente es vuestro regalo'}
                {currentCard.timeframe === 'future' && 'El futuro es vuestra promesa'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón siguiente */}
      {bothRevealed && (
        <div className="mt-6">
          <Button onClick={handleNext}>
            {isLastRound ? 'Ver resumen' : 'Siguiente carta'}
          </Button>
        </div>
      )}
    </div>
  );
}
