import { useState } from 'react';
import { Button, Card } from '../components';
import type { Card as CardType } from '../types';

const GESTURES = [
  { emoji: '💜', label: 'Te quiero' },
  { emoji: '🫂', label: 'Te abrazo' },
  { emoji: '👀', label: 'Te leo' },
  { emoji: '🙏', label: 'Gracias' },
  { emoji: '💭', label: 'Lo pienso' },
];

interface GameProps {
  cards: CardType[];
  currentRound: number;
  totalRounds: number;
  myResponse?: string;
  partnerResponse?: string;
  bothRevealed: boolean;
  onSubmitResponse: (response: string) => void;
  onSendGesture: (gesture: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function Game({
  cards,
  currentRound,
  totalRounds,
  myResponse,
  partnerResponse,
  bothRevealed,
  onSubmitResponse,
  onSendGesture,
  onNextRound,
  onFinish,
}: GameProps) {
  const [response, setResponse] = useState('');
  const [sentGesture, setSentGesture] = useState<string | null>(null);
  const currentCard = cards[currentRound - 1];
  const hasSubmitted = !!myResponse;
  const isLastRound = currentRound === totalRounds;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      onSubmitResponse(response.trim());
      setResponse('');
    }
  };

  const handleGesture = (gesture: string) => {
    setSentGesture(gesture);
    onSendGesture(gesture);
  };

  const handleNext = () => {
    setSentGesture(null);
    onNextRound();
  };

  const handleFinish = () => {
    setSentGesture(null);
    onFinish();
  };

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const maxWords = 15;
  const isOverLimit = wordCount > maxWords;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Progreso */}
      <div className="text-center mb-6">
        <span className="text-sm text-[var(--color-text)] opacity-60">
          Ronda {currentRound} de {totalRounds}
        </span>
        <div className="flex gap-2 justify-center mt-2">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={`
                w-8 h-1 rounded-full transition-colors
                ${i < currentRound ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-warm-gray)]'}
              `}
            />
          ))}
        </div>
      </div>

      {/* Carta */}
      <div className="flex-1 flex flex-col">
        <Card type={currentCard.type} prompt={currentCard.prompt}>
          {!hasSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={currentCard.placeholder}
                  rows={3}
                  autoFocus
                  className={`
                    w-full p-4 rounded-xl bg-white/80
                    text-[var(--color-text)] text-lg
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/50
                    resize-none
                    ${isOverLimit ? 'ring-2 ring-amber-500' : ''}
                  `}
                />
                <span
                  className={`
                    absolute bottom-2 right-3 text-sm
                    ${isOverLimit ? 'text-amber-600' : 'text-gray-400'}
                  `}
                >
                  {wordCount}/{maxWords}
                </span>
              </div>

              <Button type="submit" disabled={!response.trim() || isOverLimit}>
                Enviar
              </Button>
            </form>
          ) : !bothRevealed ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-3 border-[var(--color-text)] border-t-transparent rounded-full animate-spin mx-auto mb-4 opacity-40" />
              <p className="text-[var(--color-text)] opacity-70">
                Esperando a que termine...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Respuesta propia */}
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-sm text-[var(--color-text)] opacity-50 mb-1">
                  Tú
                </p>
                <p className="text-[var(--color-text)]">{myResponse}</p>
              </div>

              {/* Respuesta del otro */}
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-sm text-[var(--color-text)] opacity-50 mb-1">
                  Tu pareja
                </p>
                <p className="text-[var(--color-text)]">{partnerResponse}</p>
              </div>

              {/* Gestos de recibido */}
              {!sentGesture && (
                <div className="pt-2">
                  <p className="text-center text-xs text-[var(--color-text)] opacity-50 mb-3">
                    ¿Quieres responder con un gesto?
                  </p>
                  <div className="flex justify-center gap-2">
                    {GESTURES.map((g) => (
                      <button
                        key={g.emoji}
                        onClick={() => handleGesture(g.emoji)}
                        className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center text-xl hover:scale-110 transition-transform active:scale-95"
                        title={g.label}
                      >
                        {g.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sentGesture && (
                <p className="text-center text-sm text-[var(--color-text)] opacity-60">
                  Enviaste {sentGesture}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Siguiente / Terminar */}
        {bothRevealed && (
          <div className="mt-6 space-y-3">
            {isLastRound ? (
              <Button onClick={handleFinish}>Terminamos por hoy</Button>
            ) : (
              <Button onClick={handleNext}>Siguiente carta</Button>
            )}

            {!isLastRound && (
              <Button variant="ghost" onClick={handleFinish}>
                Mejor lo dejamos aquí
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
