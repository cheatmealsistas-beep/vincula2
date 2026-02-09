import { useState } from 'react';
import { Button, DrawCanvas } from '../components';
import { DrawIcon } from '../components/icons/GameIcons';
import type { DrawWord } from '../data/drawguess';

interface DrawGuessGameProps {
  words: DrawWord[];
  currentRound: number;
  totalRounds: number;
  isMyTurnToDraw: boolean;
  currentWord: DrawWord | null; // Solo visible para quien dibuja
  myDrawing: string | null;
  partnerDrawing: string | null;
  myGuess: string | null;
  partnerGuess: string | null;
  correctGuess: boolean | null;
  onSubmitDrawing: (dataUrl: string) => void;
  onSubmitGuess: (guess: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function DrawGuessGame({
  currentRound,
  totalRounds,
  isMyTurnToDraw,
  currentWord,
  myDrawing,
  partnerDrawing,
  myGuess,
  correctGuess,
  onSubmitDrawing,
  onSubmitGuess,
  onNextRound,
  onFinish,
}: DrawGuessGameProps) {
  const [guessInput, setGuessInput] = useState('');
  const [hasSubmittedDrawing, setHasSubmittedDrawing] = useState(false);
  const isLastRound = currentRound === totalRounds;

  // Estado del turno
  const roundComplete = correctGuess !== null;

  const handleDrawingChange = (dataUrl: string) => {
    if (isMyTurnToDraw && !hasSubmittedDrawing) {
      onSubmitDrawing(dataUrl);
    }
  };

  const handleSubmitDrawing = () => {
    setHasSubmittedDrawing(true);
  };

  const handleSubmitGuess = () => {
    if (guessInput.trim()) {
      onSubmitGuess(guessInput.trim());
      setGuessInput('');
    }
  };

  const handleNext = () => {
    setHasSubmittedDrawing(false);
    setGuessInput('');
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DrawIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Dibuja y adivina
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Ronda {currentRound} de {totalRounds}
        </p>
        <p className="text-xs text-[var(--color-text)] opacity-50 mt-1">
          {isMyTurnToDraw ? 'Te toca dibujar' : 'Te toca adivinar'}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Si es mi turno de dibujar */}
        {isMyTurnToDraw && !roundComplete && (
          <>
            {/* Palabra a dibujar */}
            <div className="bg-white rounded-2xl p-4 mb-4 text-center shadow-soft">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-1">
                Dibuja esta palabra:
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {currentWord?.word || '...'}
              </p>
            </div>

            {/* Canvas para dibujar */}
            {!hasSubmittedDrawing ? (
              <div className="space-y-4">
                <DrawCanvas onDrawingChange={handleDrawingChange} />
                <Button onClick={handleSubmitDrawing}>
                  ¡Listo! Enviar dibujo
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[var(--color-text)] opacity-70">
                  Tu pareja está adivinando...
                </p>
              </div>
            )}
          </>
        )}

        {/* Si es mi turno de adivinar */}
        {!isMyTurnToDraw && !roundComplete && (
          <>
            {/* Mostrar dibujo del partner */}
            <div className="mb-4">
              <DrawCanvas
                onDrawingChange={() => {}}
                disabled
                remoteDrawing={partnerDrawing || undefined}
              />
            </div>

            {/* Input para adivinar */}
            {!myGuess ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="¿Qué es?"
                  className="w-full p-4 rounded-2xl bg-white text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 outline-none text-lg text-center"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitGuess()}
                />
                <Button onClick={handleSubmitGuess} disabled={!guessInput.trim()}>
                  Adivinar
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-white/50 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-[var(--color-text)] opacity-60">Tu respuesta:</p>
                  <p className="text-[var(--color-text)] font-medium mt-1">{myGuess}</p>
                </div>
                <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[var(--color-text)] opacity-70">
                  Esperando resultado...
                </p>
              </div>
            )}
          </>
        )}

        {/* Resultado de la ronda */}
        {roundComplete && (
          <div className="space-y-4">
            {/* Mostrar el dibujo */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <DrawCanvas
                onDrawingChange={() => {}}
                disabled
                remoteDrawing={isMyTurnToDraw ? myDrawing || undefined : partnerDrawing || undefined}
              />
            </div>

            {/* Resultado */}
            <div className="text-center py-4">
              <span className="text-4xl">
                {correctGuess ? '🎉' : '😅'}
              </span>
              <p className="text-lg font-bold text-[var(--color-text)] mt-2">
                {correctGuess ? '¡Acertó!' : 'No acertó...'}
              </p>
              <p className="text-sm text-[var(--color-text)] opacity-70 mt-1">
                La palabra era: <strong>{currentWord?.word}</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón siguiente */}
      {roundComplete && (
        <div className="mt-6">
          <Button onClick={handleNext}>
            {isLastRound ? '¡Listo!' : 'Siguiente ronda'}
          </Button>
        </div>
      )}
    </div>
  );
}
