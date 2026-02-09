import { useState } from 'react';
import { Button } from '../components';

interface WaitingRoomProps {
  code: string;
  playerCount: number;
  onStart: () => void;
  onLeave: () => void;
  isHost: boolean;
}

export function WaitingRoom({ code, playerCount, onStart, onLeave, isHost }: WaitingRoomProps) {
  const canStart = playerCount === 2;
  const [copied, setCopied] = useState(false);

  // URL para compartir
  const shareUrl = `https://cheatmealsistas-beep.github.io/vincula2/?code=${code}`;

  const handleShare = async () => {
    // Intentar usar Web Share API (móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vincula2',
          text: `¡Juega conmigo! Entra con el código ${code}`,
          url: shareUrl,
        });
        return;
      } catch {
        // El usuario canceló o no se pudo compartir
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores antiguos
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
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full text-center">
        {/* Código grande */}
        <div className="mb-8">
          <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">
            Vuestro código
          </p>
          <div className="text-5xl font-bold font-mono tracking-widest text-[var(--color-text)]">
            {code}
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          {playerCount < 2 ? (
            <>
              <div className="w-8 h-8 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--color-text)]">
                Tu pareja está de camino...
              </p>

              {/* Botón compartir link */}
              <button
                onClick={handleShare}
                className="mt-4 w-full py-3 px-4 bg-[var(--color-lavender)] rounded-xl text-[var(--color-text)] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
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

              <p className="text-xs text-[var(--color-text)] opacity-50 mt-3">
                O dile el código: <span className="font-mono font-bold">{code}</span>
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">✨</div>
              <p className="text-[var(--color-text)] font-medium">
                ¡Ya estáis los dos!
              </p>
              <p className="text-sm text-[var(--color-text)] opacity-60 mt-2">
                Cuando queráis, empezamos
              </p>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          {canStart && isHost && (
            <Button onClick={onStart}>
              Empezar a jugar
            </Button>
          )}

          <Button variant="ghost" onClick={onLeave}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
