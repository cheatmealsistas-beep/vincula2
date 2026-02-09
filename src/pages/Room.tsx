import { useState } from 'react';
import { Button, GameIcon } from '../components';

function ShareButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://cheatmealsistas-beep.github.io/vincula2/?code=${code}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vincula2',
          text: `¡Juega conmigo! Entra con el código ${code}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Usuario canceló
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="mt-4 py-3 px-5 bg-[var(--color-lavender)] rounded-xl text-[var(--color-text)] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>¡Link copiado!</span>
        </>
      ) : (
        <>
          <span>📤</span>
          <span>Enviar link a tu pareja</span>
        </>
      )}
    </button>
  );
}

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
}: RoomProps) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-8 animate-fade-up">
      {/* Cabecera */}
      <div className="text-center mb-8">
        <p className="text-sm text-[var(--color-text)] opacity-50 mb-1">
          Vuestro espacio
        </p>
        <h1 className="text-2xl font-bold font-mono tracking-wider text-[var(--color-text)]">
          {code}
        </h1>

        {/* Estado de presencia */}
        <div className={`mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full ${
          partnerOnline ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <span
            className={`w-3 h-3 rounded-full ${
              partnerOnline ? 'bg-green-500 animate-pulse-soft' : 'bg-gray-400'
            }`}
          />
          <span className={`text-sm font-medium ${
            partnerOnline ? 'text-green-700' : 'text-gray-600'
          }`}>
            {partnerOnline
              ? 'Tu pareja está aquí'
              : partnerLastSeen
              ? `Última vez: ${partnerLastSeen}`
              : 'Tu pareja llegará pronto'}
          </span>
        </div>

        {/* Botón compartir cuando la pareja no está */}
        {!partnerOnline && !partnerLastSeen && (
          <ShareButton code={code} />
        )}
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
              Dejarle un mensaje
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 space-y-3">
        {!isPaused && (
          <button
            onClick={onPause}
            className="w-full py-3 px-4 text-[var(--color-text)] text-sm font-medium bg-white/50 rounded-xl border border-gray-200 hover:bg-white hover:border-gray-300 active:scale-[0.98] transition-all"
          >
            ⏸️ Necesito un momento
          </button>
        )}

        <button
          onClick={onLeave}
          className="w-full py-3 px-4 text-gray-500 text-sm hover:text-gray-700 hover:underline transition-all"
        >
          Hasta luego
        </button>
      </div>
    </div>
  );
}
