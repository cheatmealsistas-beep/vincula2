import { Button, GameIcon } from '../components';

interface WelcomeMessageProps {
  message: string;
  gameId?: string;
  gameName?: string;
  onContinue: () => void;
}

export function WelcomeMessage({
  message,
  gameId,
  gameName,
  onContinue,
}: WelcomeMessageProps) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-lavender)]/30">
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Icono */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">💌</div>
          <p className="text-sm text-[var(--color-text)] opacity-60">
            Tu pareja te dejó un mensaje
          </p>
        </div>

        {/* Mensaje */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-8">
          <p className="text-lg text-[var(--color-text)] text-center leading-relaxed">
            "{message}"
          </p>
        </div>

        {/* Info del juego */}
        {gameId && gameName && (
          <div className="text-center mb-6">
            <p className="text-sm text-[var(--color-text)] opacity-60 mb-1">
              Os espera
            </p>
            <p className="text-lg font-semibold text-[var(--color-text)] flex items-center justify-center gap-2">
              <GameIcon gameId={gameId} className="w-6 h-6" /> {gameName}
            </p>
          </div>
        )}

        {/* Botón */}
        <Button onClick={onContinue}>
          Entrar a la sala
        </Button>
      </div>
    </div>
  );
}
