import { Button } from '../components';

interface WaitingForGameProps {
  inviteMessage?: string;
  onLeave: () => void;
}

export function WaitingForGame({ inviteMessage, onLeave }: WaitingForGameProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full text-center">
        {/* Icono animado */}
        <div className="mb-8">
          <div className="text-6xl mb-4">💜</div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            ¡Ya estás dentro!
          </h1>
        </div>

        {/* Mensaje del creador (si existe) */}
        {inviteMessage && (
          <div className="bg-white/80 rounded-2xl p-5 mb-8 shadow-soft">
            <p className="text-xs text-[var(--color-text)] opacity-50 mb-2">
              Tu pareja te dice:
            </p>
            <p className="text-[var(--color-text)] text-lg italic">
              "{inviteMessage}"
            </p>
          </div>
        )}

        {/* Estado de espera */}
        <div className="bg-white/60 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[var(--color-coral)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-[var(--color-text)] font-medium">
            Tu pareja está eligiendo un juego...
          </p>
          <p className="text-sm text-[var(--color-text)] opacity-60 mt-2">
            En unos segundos empezáis
          </p>
        </div>

        {/* Salir */}
        <Button variant="ghost" onClick={onLeave}>
          Salir
        </Button>
      </div>
    </div>
  );
}
