import { useState } from 'react';
import { Button, GameIcon } from '../components';

interface RoomProps {
  code: string;
  partnerOnline: boolean;
  partnerLastSeen?: string;
  hasPendingMessage: boolean;
  isPaused: boolean;
  pauseMessage?: string;
  gameId?: string;
  gameName?: string;
  onPlayTogether: () => void;
  onLeaveMessage: () => void;
  onViewMessage: () => void;
  onPause: () => void;
  onResume: () => void;
  onLeave: () => void;
  onNeedCalm?: () => void;
}

export function Room({
  code,
  partnerOnline,
  partnerLastSeen,
  hasPendingMessage,
  isPaused,
  pauseMessage,
  gameId,
  gameName,
  onPlayTogether,
  onLeaveMessage,
  onViewMessage,
  onPause,
  onResume,
  onLeave,
  onNeedCalm,
}: RoomProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}?code=${code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 animate-fade-up">
      {/* Cabecera */}
      <div className="text-center mb-8">
        <p className="text-sm text-[var(--color-text)] opacity-50 mb-1">
          Vuestra sala
        </p>
        <h1 className="text-2xl font-bold font-mono tracking-wider text-[var(--color-text)]">
          {code}
        </h1>

        {/* Botón copiar enlace */}
        <button
          onClick={handleCopyLink}
          className="mt-2 text-sm text-[var(--color-coral)] hover:underline"
        >
          {copied ? '¡Enlace copiado!' : 'Copiar enlace de invitación'}
        </button>

        {/* Estado de presencia */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              partnerOnline ? 'bg-green-400 animate-pulse-soft' : 'bg-gray-300'
            }`}
          />
          <span className="text-sm text-[var(--color-text)] opacity-70">
            {partnerOnline
              ? 'Tu pareja está aquí'
              : partnerLastSeen
              ? `Última vez: ${partnerLastSeen}`
              : 'Esperando a tu pareja'}
          </span>
        </div>
      </div>

      {/* Mensaje de pausa (si aplica) */}
      {isPaused && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 mb-6 text-center shadow-soft">
          <p className="text-[var(--color-text)] mb-2">
            {pauseMessage || 'Tu pareja necesita un momento. No es un adiós, es un respiro.'}
          </p>
          <Button variant="ghost" onClick={onResume} className="mt-2">
            Ya estoy aquí
          </Button>
        </div>
      )}

      {/* Mensaje pendiente */}
      {hasPendingMessage && !isPaused && (
        <button
          onClick={onViewMessage}
          className="bg-[var(--color-lavender)] rounded-3xl p-5 mb-6 text-left w-full transition-all duration-200 shadow-soft hover:shadow-soft-lg hover:translate-y-[-2px] active:scale-[0.98]"
        >
          <p className="text-sm text-[var(--color-text)] opacity-60 mb-1">
            Tienes algo sin leer
          </p>
          <p className="text-[var(--color-text)] font-semibold">
            Tu pareja te dejó un mensaje →
          </p>
        </button>
      )}

      {/* Acciones principales */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {!isPaused && (
          <>
            <Button onClick={onPlayTogether}>
              {gameId && <GameIcon gameId={gameId} className="w-5 h-5 mr-2 inline-block" />}
              {gameName ? `Jugar a ${gameName}` : 'Jugar juntos'}
            </Button>

            {!partnerOnline && (
              <p className="text-center text-sm text-[var(--color-text)] opacity-50 -mt-2 mb-2">
                Mejor cuando estéis los dos, pero puedes empezar
              </p>
            )}

            <Button variant="secondary" onClick={onLeaveMessage}>
              Dejar algo para ti
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 space-y-2">
        {!isPaused && onNeedCalm && (
          <button
            onClick={onNeedCalm}
            className="w-full py-3 flex items-center justify-center gap-2 text-[var(--color-text)] opacity-70 text-sm hover:opacity-90 transition-opacity"
          >
            <span>🌊</span>
            <span>Necesito calma</span>
          </button>
        )}

        {!isPaused && (
          <button
            onClick={onPause}
            className="w-full py-3 text-[var(--color-text)] opacity-60 text-sm hover:opacity-80 transition-opacity"
          >
            Necesito un momento
          </button>
        )}

        <button
          onClick={onLeave}
          className="w-full py-3 text-[var(--color-text)] opacity-50 text-xs hover:opacity-70 transition-opacity"
        >
          Salir de la sala
        </button>
      </div>
    </div>
  );
}
