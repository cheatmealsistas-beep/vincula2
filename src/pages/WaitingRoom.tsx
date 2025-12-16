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

  const handleShare = async () => {
    const shareText = `¿Jugamos a Vínculo? Entra con el código: ${code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vínculo',
          text: shareText,
        });
      } catch {
        // Usuario canceló o error
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full text-center">
        {/* Código grande */}
        <div className="mb-8">
          <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">
            Tu código de sala
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
                Esperando a la otra persona...
              </p>
              <p className="text-sm text-[var(--color-text)] opacity-60 mt-2">
                Comparte el código para que pueda entrar
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
          {playerCount < 2 && (
            <Button onClick={handleShare}>
              Compartir código
            </Button>
          )}

          {canStart && isHost && (
            <Button onClick={onStart}>
              Empezar a jugar
            </Button>
          )}

          <Button variant="ghost" onClick={onLeave}>
            Salir de la sala
          </Button>
        </div>
      </div>
    </div>
  );
}
