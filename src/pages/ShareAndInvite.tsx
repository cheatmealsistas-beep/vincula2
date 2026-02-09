import { useState } from 'react';
import { Button } from '../components';

interface ShareAndInviteProps {
  code: string;
  onContinue: (message?: string) => void;
  onBack: () => void;
}

export function ShareAndInvite({ code, onContinue, onBack }: ShareAndInviteProps) {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://cheatmealsistas-beep.github.io/vincula2/?code=${code}`;

  const handleShare = async () => {
    const shareText = message.trim()
      ? `${message.trim()}\n\n¡Juega conmigo! Entra con el código ${code}`
      : `¡Juega conmigo! Entra con el código ${code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vincula2',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Usuario canceló
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    onContinue(message.trim() || undefined);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col">
        {/* Header con código */}
        <div className="text-center mb-6">
          <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">
            Vuestro código
          </p>
          <div className="text-4xl font-bold font-mono tracking-widest text-[var(--color-text)] mb-4">
            {code}
          </div>
        </div>

        {/* Mensaje opcional */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white/60 rounded-2xl p-4 mb-3">
            <p className="text-sm text-[var(--color-text)] opacity-70 mb-3">
              Mensaje para tu pareja (opcional)
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: ¿Jugamos un rato? 💕"
              className="w-full h-20 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 resize-none outline-none text-base"
              maxLength={100}
            />
            <div className="text-right text-xs text-[var(--color-text)] opacity-40">
              {message.length}/100
            </div>
          </div>

          {/* Botón de compartir */}
          <button
            onClick={handleShare}
            className="w-full py-4 px-4 bg-[var(--color-lavender)] rounded-xl text-[var(--color-text)] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform mb-3"
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Enviar link a tu pareja</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-[var(--color-text)] opacity-50 mb-6">
            O dile el código: <span className="font-mono font-bold">{code}</span>
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 mt-auto">
          <Button onClick={handleContinue}>
            Elegir juego →
          </Button>

          <p className="text-center text-xs text-[var(--color-text)] opacity-50">
            Puedes compartir el link ahora o después
          </p>

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
