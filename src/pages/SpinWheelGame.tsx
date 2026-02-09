import { Button } from '../components';
import { SpinWheelIcon } from '../components/icons/GameIcons';
import type { IntensityLevel } from '../data/spinwheel';
import { LEVEL_LABELS, LEVEL_EMOJIS, LEVEL_COLORS } from '../data/spinwheel';

interface SpinResult {
  action: { text: string; emoji: string };
  zone: { text: string; emoji: string };
  how: { text: string; emoji: string };
}

interface SpinWheelGameProps {
  level: IntensityLevel;
  setLevel: (level: IntensityLevel) => void;
  currentSpin: SpinResult | null;
  isSpinning: boolean;
  spinCount: number;
  isMyTurn: boolean;
  onSpin: () => void;
  onFinish: () => void;
}

export function SpinWheelGame({
  level,
  setLevel,
  currentSpin,
  isSpinning,
  spinCount,
  isMyTurn,
  onSpin,
  onFinish,
}: SpinWheelGameProps) {
  // Pantalla principal del juego (ya no hay selección de nivel separada)
  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SpinWheelIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Gira y...
          </h1>
        </div>

        {/* Selector de nivel compacto */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {(['soft', 'medium', 'spicy'] as IntensityLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${level === lvl
                  ? 'scale-110 shadow-md'
                  : 'opacity-60 hover:opacity-80'
                }
              `}
              style={{
                backgroundColor: level === lvl ? LEVEL_COLORS[lvl] : 'white',
              }}
            >
              {LEVEL_EMOJIS[lvl]} {LEVEL_LABELS[lvl]}
            </button>
          ))}
        </div>

        {spinCount > 0 && (
          <p className="text-xs text-[var(--color-text)] opacity-60">
            Giro #{spinCount}
          </p>
        )}
      </div>

      {/* Indicador de turno */}
      <div className="flex justify-center mb-4">
        <div className={`
          px-4 py-2 rounded-full text-sm font-medium
          ${isMyTurn
            ? 'bg-[var(--color-coral)]/20 text-[var(--color-coral)]'
            : 'bg-blue-100 text-blue-600'
          }
        `}>
          {isMyTurn ? '¡Te toca girar!' : 'Turno de tu pareja'}
        </div>
      </div>

      {/* Área de la ruleta */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isSpinning ? (
          // Animación de giro
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-8 border-dashed border-[var(--color-coral)] animate-spin" />
              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                <span className="text-5xl animate-pulse">🎰</span>
              </div>
            </div>
            <p className="text-lg text-[var(--color-text)] animate-pulse">
              {isMyTurn ? 'Girando...' : 'Tu pareja está girando...'}
            </p>
          </div>
        ) : currentSpin ? (
          // Resultado
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl p-5 shadow-lg mb-4">
              <div className="text-center mb-4">
                <span className="text-4xl mb-1 block">{currentSpin.action.emoji}</span>
                <p className="text-xl font-bold text-[var(--color-text)]">
                  {currentSpin.action.text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-sm">en</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="text-center mb-4">
                <span className="text-3xl mb-1 block">{currentSpin.zone.emoji}</span>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {currentSpin.zone.text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-sm">pero</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="text-center">
                <span className="text-2xl mb-1 block">{currentSpin.how.emoji}</span>
                <p className="text-base text-[var(--color-text)] italic">
                  {currentSpin.how.text}
                </p>
              </div>
            </div>

            {/* Resumen en una frase */}
            <div
              className="p-3 rounded-2xl text-center"
              style={{ backgroundColor: LEVEL_COLORS[level] + '40' }}
            >
              <p className="text-[var(--color-text)] font-medium text-sm">
                "{currentSpin.action.text} {currentSpin.zone.text} {currentSpin.how.text}"
              </p>
            </div>
          </div>
        ) : (
          // Estado inicial - esperando primer giro
          <div className="text-center">
            {isMyTurn ? (
              <>
                <p className="text-lg text-[var(--color-text)] mb-2">
                  ¿Preparados?
                </p>
                <p className="text-[var(--color-text)] opacity-70">
                  Pulsa el botón de abajo para girar
                </p>
                <span className="text-4xl block mt-4 animate-bounce">👇</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[var(--color-text)] opacity-70">
                  Tu pareja va a girar...
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-3 mt-4">
        {!isSpinning && (
          <>
            {isMyTurn ? (
              <Button onClick={onSpin}>
                {currentSpin ? '¡Girar otra vez!' : '¡Girar la ruleta!'}
              </Button>
            ) : (
              <div className="text-center py-3">
                <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-[var(--color-text)] opacity-70">
                  Tu pareja está pensando...
                </p>
              </div>
            )}

            {spinCount > 0 && (
              <button
                onClick={onFinish}
                className="w-full py-3 text-[var(--color-text)] opacity-70 hover:opacity-100 transition-opacity"
              >
                Ya está bien por hoy 😊
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
