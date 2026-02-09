import { Button, GameIcon } from '../components';
import { GAMES } from '../data/games';

interface GameSelectProps {
  partnerOnline: boolean;
  onSelectGame: (gameId: string) => void;
  onBack: () => void;
}

export function GameSelect({ partnerOnline, onSelectGame, onBack }: GameSelectProps) {
  const availableGames = GAMES.filter(g => g.available && !g.hidden);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            ¿A qué jugamos?
          </h1>
          <p className="text-sm text-[var(--color-text)] opacity-70">
            {partnerOnline
              ? '¡Tu pareja está lista!'
              : 'Elige un juego mientras llega tu pareja'}
          </p>
        </div>

        {/* Estado de la pareja */}
        <div className={`flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-full mx-auto ${
          partnerOnline ? 'bg-green-100' : 'bg-amber-50'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            partnerOnline ? 'bg-green-500' : 'bg-amber-400 animate-pulse'
          }`} />
          <span className={`text-sm ${
            partnerOnline ? 'text-green-700' : 'text-amber-700'
          }`}>
            {partnerOnline ? 'Tu pareja está aquí' : 'Esperando a tu pareja...'}
          </span>
        </div>

        {/* Lista de juegos */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {availableGames.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="w-full p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform"
              style={{ backgroundColor: game.color }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <GameIcon gameId={game.id} className="w-10 h-10" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-[var(--color-text)]">
                  {game.name}
                </h3>
                <p className="text-sm text-[var(--color-text)] opacity-70">
                  {game.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Volver */}
        <div className="mt-6">
          <Button variant="ghost" onClick={onBack}>
            ← Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
