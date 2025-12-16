import { useState } from 'react';
import { Button, GameIcon } from '../components';
import { GAMES, type GameDefinition } from '../data/games';
import logoSvg from '/logo.svg';

interface HomeProps {
  onCreateRoom: (gameType: string) => void;
  onJoinRoom: () => void;
}

export function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (game: GameDefinition) => {
    if (game.available) {
      setSelectedGame(game.id);
    }
  };

  const handleCreateRoom = () => {
    if (selectedGame) {
      onCreateRoom(selectedGame);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido scrolleable */}
      <div className="flex-1 px-6 pt-6 pb-4 overflow-auto">
        <div className="max-w-sm mx-auto w-full animate-fade-up">
          {/* Logo / Título */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <img src={logoSvg} alt="vincula2" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1 tracking-tight">
              vincula<span className="bg-gradient-to-br from-[#9D8DF1] to-[#FF4081] bg-clip-text text-transparent">2</span>
            </h1>
            <p className="text-sm text-[var(--color-text)] opacity-70">
              Elige cómo queréis conectar hoy
            </p>
          </div>

          {/* Selección de juegos - grid 2 columnas con scroll vertical */}
          <div className="grid grid-cols-2 gap-2.5 pb-4">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                disabled={!game.available}
                className={`
                  relative p-3 rounded-2xl text-left transition-all duration-200
                  shadow-soft hover:shadow-soft-lg hover:translate-y-[-2px]
                  ${game.available
                    ? 'active:scale-95'
                    : 'opacity-50 cursor-not-allowed'
                  }
                  ${selectedGame === game.id
                    ? 'ring-2 ring-[#9D8DF1] ring-offset-2 shadow-soft-lg'
                    : ''
                  }
                `}
                style={{ backgroundColor: game.color }}
              >
                {/* Icono del juego */}
                <div className="mb-1.5">
                  <GameIcon gameId={game.id} className="w-8 h-8" />
                </div>

                {/* Nombre */}
                <h3 className="font-semibold text-[var(--color-text)] text-sm leading-tight">
                  {game.name}
                </h3>

                {/* Descripción */}
                <p className="text-[11px] text-[var(--color-text)] opacity-60 mt-0.5 leading-snug line-clamp-2">
                  {game.description}
                </p>

                {/* Badge "Próximamente" */}
                {!game.available && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                    <span className="text-[10px] font-semibold text-[var(--color-text)] opacity-60">
                      Pronto
                    </span>
                  </div>
                )}

                {/* Indicador de selección */}
                {selectedGame === game.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#9D8DF1] to-[#FF4081] rounded-full flex items-center justify-center shadow-soft">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botones fijos en la parte inferior */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[var(--color-cream)] via-[var(--color-cream)] to-transparent px-6 pt-4 pb-6">
        <div className="max-w-sm mx-auto space-y-2.5">
          <Button
            onClick={handleCreateRoom}
            disabled={!selectedGame}
          >
            {selectedGame ? 'Crear sala' : 'Elige un juego'}
          </Button>

          <Button variant="secondary" onClick={onJoinRoom}>
            Tengo un código
          </Button>

          {/* Nota sutil */}
          <p className="text-center text-[11px] text-[var(--color-text)] opacity-50 pt-1">
            Sin cuenta. Sin historial. Solo vosotros dos.
          </p>
        </div>
      </div>
    </div>
  );
}
