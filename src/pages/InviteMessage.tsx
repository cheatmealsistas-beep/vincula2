import { useState } from 'react';
import { Button, GameIcon } from '../components';

interface InviteMessageProps {
  gameId: string;
  gameName: string;
  onContinue: (message?: string) => void;
  onBack: () => void;
}

export function InviteMessage({
  gameId,
  gameName,
  onContinue,
  onBack,
}: InviteMessageProps) {
  const [message, setMessage] = useState('');

  const handleContinue = () => {
    onContinue(message.trim() || undefined);
  };

  const handleSkip = () => {
    onContinue(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <GameIcon gameId={gameId} className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">
            {gameName}
          </h1>
          <p className="text-sm text-[var(--color-text)] opacity-70">
            ¿Quieres dejar un mensaje para cuando llegue tu pareja?
          </p>
        </div>

        {/* Mensaje opcional */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white/60 rounded-2xl p-4 mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: Te echo de menos, ¿jugamos? 💕"
              className="w-full h-24 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 resize-none outline-none text-base"
              maxLength={150}
            />
            <div className="text-right text-xs text-[var(--color-text)] opacity-40">
              {message.length}/150
            </div>
          </div>

          <p className="text-center text-xs text-[var(--color-text)] opacity-50 mb-6">
            Este mensaje aparecerá cuando tu pareja entre con el código
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <Button onClick={handleContinue}>
            {message.trim() ? 'Continuar con mensaje' : 'Continuar'}
          </Button>

          {message.trim() && (
            <Button variant="ghost" onClick={handleSkip}>
              Crear sin mensaje
            </Button>
          )}

          <button
            onClick={onBack}
            className="w-full py-3 text-[var(--color-text)] opacity-50 text-sm"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
