import { useState, useEffect, useRef } from 'react';
import { Button } from '../components';
import { SillyChallengesIcon } from '../components/icons/GameIcons';
import { celebrateMatch } from '../utils/celebrations';
import type { SillyChallenge } from '../data/sillychallenges';

interface SillyChallengesGameProps {
  challenges: SillyChallenge[];
  currentRound: number;
  totalRounds: number;
  iAmChallenged: boolean;
  challengeCompleted: boolean;
  partnerConfirmed: boolean;
  partnerRejected: boolean;
  onCompleteChallenge: () => void;
  onConfirmPartner: () => void;
  onRejectPartner: () => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function SillyChallengesGame({
  challenges,
  currentRound,
  totalRounds,
  iAmChallenged,
  challengeCompleted,
  partnerConfirmed,
  partnerRejected,
  onCompleteChallenge,
  onConfirmPartner,
  onRejectPartner,
  onNextRound,
  onFinish,
}: SillyChallengesGameProps) {
  const [showingChallenge, setShowingChallenge] = useState(false);
  const currentChallenge = challenges[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  // Ambos confirmaron = siguiente ronda
  const bothDone = challengeCompleted && partnerConfirmed;
  const rejected = challengeCompleted && partnerRejected;

  // Confeti cuando se completa un reto
  const prevBothDone = useRef(false);
  useEffect(() => {
    if (bothDone && !prevBothDone.current) {
      celebrateMatch();
    }
    prevBothDone.current = bothDone;
  }, [bothDone]);

  if (!currentChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text)]">Preparando retos...</p>
        </div>
      </div>
    );
  }

  const handleRevealChallenge = () => {
    setShowingChallenge(true);
  };

  const handleComplete = () => {
    onCompleteChallenge();
  };

  const handleConfirm = () => {
    onConfirmPartner();
  };

  const handleNext = () => {
    setShowingChallenge(false);
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  // Categoria a emoji
  const categoryEmoji = {
    voice: '🎤',
    face: '😜',
    body: '💃',
    mixed: '🎭',
  }[currentChallenge.category];

  // --- VISTA DEL RETADO (quien hace el reto) ---
  if (iAmChallenged) {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SillyChallengesIcon className="w-8 h-8" />
            <h1 className="text-xl font-bold text-[var(--color-text)]">Retos</h1>
          </div>
          <p className="text-sm text-[var(--color-text)] opacity-70">
            Ronda {currentRound} de {totalRounds}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Badge de turno */}
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-coral)]/20 text-[var(--color-coral)]">
            ¡Te toca a ti!
          </div>

          {/* Carta del reto - sin revelar */}
          {!showingChallenge && (
            <button
              onClick={handleRevealChallenge}
              className="w-full max-w-xs aspect-[3/4] bg-gradient-to-br from-[#FFE082] to-[#FFCA28] rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
            >
              <span className="text-6xl">🎪</span>
              <p className="text-lg font-semibold text-amber-800">
                Toca para ver tu reto
              </p>
            </button>
          )}

          {/* Carta del reto - revelada */}
          {showingChallenge && (
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg p-6 text-center">
              <span className="text-4xl mb-4 block">{categoryEmoji}</span>
              <p className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
                {currentChallenge.challenge}
              </p>
            </div>
          )}

          {/* Estados */}
          {showingChallenge && !challengeCompleted && (
            <p className="text-sm text-[var(--color-text)] opacity-70 text-center">
              Hazlo delante de tu pareja
            </p>
          )}

          {challengeCompleted && !partnerConfirmed && !partnerRejected && (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[var(--color-text)] opacity-70">
                Tu pareja está decidiendo...
              </p>
            </div>
          )}

          {bothDone && (
            <div className="bg-green-100 rounded-2xl p-4 text-center animate-fade-up">
              <span className="text-3xl">😂</span>
              <p className="font-semibold text-green-700 mt-1">
                ¡Reto completado!
              </p>
            </div>
          )}

          {rejected && (
            <div className="bg-red-100 rounded-2xl p-4 text-center animate-fade-up">
              <span className="text-3xl">🙈</span>
              <p className="font-semibold text-red-700 mt-1">
                Tu pareja dice que no vale...
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="space-y-3 mt-6">
          {showingChallenge && !challengeCompleted && (
            <Button onClick={handleComplete}>¡Hecho!</Button>
          )}

          {bothDone && (
            <Button onClick={handleNext}>
              {isLastRound ? '¡Fin de los retos!' : 'Siguiente reto'}
            </Button>
          )}

          {rejected && (
            <Button onClick={handleNext}>
              {isLastRound ? '¡Fin de los retos!' : 'Siguiente reto'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA DEL OBSERVADOR (quien juzga/confirma) ---
  // El observador NO avanza la ronda, solo espera a que el retado lo haga
  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SillyChallengesIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">Retos</h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Ronda {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Badge de turno */}
        <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
          Le toca a tu pareja
        </div>

        {/* Estado: Esperando que vea el reto */}
        {!challengeCompleted && (
          <>
            <div className="w-full max-w-xs aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4">
              <span className="text-6xl">👀</span>
              <p className="text-lg font-semibold text-gray-600 text-center px-4">
                Tu pareja tiene un reto secreto
              </p>
            </div>
            <p className="text-sm text-[var(--color-text)] opacity-70 text-center animate-pulse">
              Observa lo que hace...
            </p>
          </>
        )}

        {/* Estado: Tu pareja dice que lo hizo, mostrar el reto y pedir confirmacion */}
        {challengeCompleted && !partnerConfirmed && !partnerRejected && (
          <>
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg p-6 text-center">
              <p className="text-xs text-[var(--color-text)] opacity-50 mb-2">
                El reto era:
              </p>
              <span className="text-4xl mb-4 block">{categoryEmoji}</span>
              <p className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
                {currentChallenge.challenge}
              </p>
            </div>
            <p className="text-sm text-[var(--color-text)] opacity-70 text-center">
              Tu pareja dice que lo ha hecho. ¿Lo confirmas?
            </p>
          </>
        )}

        {/* Estado: Rechazado */}
        {rejected && (
          <>
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg p-6 text-center">
              <span className="text-4xl mb-4 block">{categoryEmoji}</span>
              <p className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
                {currentChallenge.challenge}
              </p>
            </div>
            <div className="bg-red-100 rounded-2xl p-4 text-center animate-fade-up">
              <span className="text-3xl">🙈</span>
              <p className="font-semibold text-red-700 mt-1">
                ¡No vale! Siguiente reto...
              </p>
            </div>
          </>
        )}

        {/* Estado: Ambos confirmaron */}
        {bothDone && (
          <>
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg p-6 text-center">
              <span className="text-4xl mb-4 block">{categoryEmoji}</span>
              <p className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
                {currentChallenge.challenge}
              </p>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 text-center animate-fade-up">
              <span className="text-3xl">😂</span>
              <p className="font-semibold text-green-700 mt-1">
                ¡Reto completado!
              </p>
            </div>
          </>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-3 mt-6">
        {challengeCompleted && !partnerConfirmed && !partnerRejected && (
          <>
            <Button onClick={handleConfirm}>Sí, lo ha hecho</Button>
            <Button variant="ghost" onClick={onRejectPartner}>No, ¡no vale!</Button>
          </>
        )}

        {bothDone && (
          <Button onClick={handleNext}>
            {isLastRound ? '¡Fin de los retos!' : 'Siguiente reto'}
          </Button>
        )}

        {rejected && (
          <Button onClick={handleNext}>
            {isLastRound ? '¡Fin de los retos!' : 'Siguiente reto'}
          </Button>
        )}
      </div>
    </div>
  );
}
