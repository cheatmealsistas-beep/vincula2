import { Button } from '../components';

interface EndProps {
  onPlayAgain?: () => void;
  onExit: () => void;
}

export function End({ onExit }: EndProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full text-center">
        {/* Mensaje de cierre */}
        <div className="mb-12">
          <div className="text-6xl mb-6">💜</div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">
            ¡Buen rato juntos!
          </h1>
          <p className="text-[var(--color-text)] opacity-70">
            Gracias por jugar 💜
          </p>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <Button onClick={onExit}>
            Volver al inicio
          </Button>
        </div>

        {/* Nota sutil */}
        <p className="text-xs text-[var(--color-text)] opacity-40 mt-12">
          Esta conversación no se ha guardado.
        </p>
      </div>
    </div>
  );
}
