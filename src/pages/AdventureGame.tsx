import { useState, useEffect } from 'react';
import { Button } from '../components';
import { PixelCharacter, PixelScene, DialogBubble } from '../components/adventure';
import type { Adventure } from '../data/adventure';
import { AVATARS } from '../data/adventure';
import { getPixelCharacterInfo } from '../components/adventure/PixelCharacter';

type GamePhase = 'avatar-select' | 'scene' | 'voting' | 'minigame' | 'result';

interface AdventureGameProps {
  adventure: Adventure;
  myAvatarId: string | null;
  partnerAvatarId: string | null;
  currentEventId: string | null;
  completedEventIds: string[];
  myVote: string | null;
  partnerVote: string | null;
  onSelectAvatar: (avatarId: string) => void;
  onMoveToEvent: (eventId: string) => void;
  onVote: (choice: string) => void;
  onCompleteEvent: () => void;
  onFinish: () => void;
}

export function AdventureGame({
  adventure,
  myAvatarId,
  partnerAvatarId,
  currentEventId: _currentEventId,
  completedEventIds: _completedEventIds,
  myVote,
  partnerVote,
  onSelectAvatar,
  onMoveToEvent,
  onVote,
  onCompleteEvent,
  onFinish,
}: AdventureGameProps) {
  // Las props _currentEventId y _completedEventIds se mantienen para compatibilidad con el hook
  void _currentEventId;
  void _completedEventIds;
  const [phase, setPhase] = useState<GamePhase>('avatar-select');
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [minigameTimer, setMinigameTimer] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');

  const currentEvent = adventure.events[currentEventIndex];
  const bothHaveAvatars = myAvatarId && partnerAvatarId;
  const bothVoted = myVote && partnerVote;
  const votesMatch = myVote === partnerVote;

  // Cuando ambos tienen avatar, pasar a la primera escena
  useEffect(() => {
    if (bothHaveAvatars && phase === 'avatar-select') {
      setPhase('scene');
      // Mover al primer evento
      if (adventure.events[0]) {
        onMoveToEvent(adventure.events[0].id);
      }
    }
  }, [bothHaveAvatars, phase]);

  // Cuando ambos votan, mostrar resultado
  useEffect(() => {
    if (bothVoted && phase === 'voting') {
      // Buscar el resultado de la elección
      const choice = currentEvent?.choices?.find(c => c.text === myVote);
      if (choice) {
        setResultText(choice.result);
      }
      setShowResult(true);
      setPhase('result');
    }
  }, [bothVoted, phase]);

  // Timer del minijuego
  useEffect(() => {
    if (phase === 'minigame' && minigameTimer > 0) {
      const timer = setTimeout(() => setMinigameTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'minigame' && minigameTimer === 0) {
      setShowResult(true);
      setPhase('result');
    }
  }, [phase, minigameTimer]);

  const handleContinue = () => {
    onCompleteEvent();

    // Ir a la siguiente escena
    const nextIndex = currentEventIndex + 1;

    if (nextIndex >= adventure.events.length) {
      // Aventura completada
      onFinish();
    } else {
      setCurrentEventIndex(nextIndex);
      onMoveToEvent(adventure.events[nextIndex].id);
      setPhase('scene');
      setShowResult(false);
      setResultText('');
      setTapCount(0);
      setMinigameTimer(5);
    }
  };

  const handleVote = (choice: string) => {
    onVote(choice);
    setPhase('voting');
  };

  const handleStartMinigame = () => {
    setPhase('minigame');
    setTapCount(0);
    setMinigameTimer(5);
  };

  const handleRealLifeComplete = () => {
    setShowResult(true);
    setPhase('result');
  };

  // === FASE: Selección de Avatar ===
  if (phase === 'avatar-select') {
    return (
      <div
        className="min-h-screen flex flex-col p-4"
        style={{ backgroundColor: adventure.palette.background }}
      >
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">{adventure.emoji}</span>
          <h1 className="text-xl font-bold text-[var(--color-text)]">{adventure.name}</h1>
          <p className="text-sm text-[var(--color-text)] opacity-70 mt-1">Elige tu personaje</p>
        </div>

        {/* Grid de personajes pixel */}
        <div className="grid grid-cols-4 gap-3 flex-1">
          {AVATARS.map((avatar) => {
            const isSelected = myAvatarId === avatar.id;
            const isPartnerSelected = partnerAvatarId === avatar.id;
            const isDisabled = isPartnerSelected;
            const characterInfo = getPixelCharacterInfo(avatar.id);

            return (
              <button
                key={avatar.id}
                onClick={() => !isDisabled && onSelectAvatar(avatar.id)}
                disabled={isDisabled}
                className={`
                  relative flex flex-col items-center justify-center p-2 rounded-2xl
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-[var(--color-coral)] scale-105 shadow-lg ring-2 ring-white'
                    : isDisabled
                      ? 'bg-gray-100 opacity-40 cursor-not-allowed'
                      : 'bg-white/80 hover:bg-white hover:scale-105'
                  }
                `}
              >
                <PixelCharacter characterId={avatar.id} className="mb-1" />
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-[var(--color-text)]'}`}>
                  {characterInfo?.name || avatar.name}
                </span>

                {isPartnerSelected && (
                  <span className="absolute -top-1 -right-1 text-xs bg-pink-400 text-white px-1.5 py-0.5 rounded-full">
                    💕
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {myAvatarId && !partnerAvatarId && (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text)] opacity-70">Esperando a tu pareja...</p>
          </div>
        )}
      </div>
    );
  }

  // === FASE: Escena con evento ===
  if (currentEvent && (phase === 'scene' || phase === 'voting' || phase === 'minigame' || phase === 'result')) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: adventure.palette.background }}
      >
        {/* Título de la escena */}
        <div className="text-center py-3 px-4">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{currentEvent.title}</h2>
          <p className="text-xs text-[var(--color-text)] opacity-60">
            {currentEventIndex + 1} / {adventure.events.length}
          </p>
        </div>

        {/* Escenario pixel art */}
        <div className="px-4 relative">
          <PixelScene sceneId={currentEvent.sceneId}>
            {/* Personajes en la escena */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex justify-between items-end">
              {myAvatarId && (
                <PixelCharacter
                  characterId={myAvatarId}
                  position="left"
                  speaking={phase === 'scene' && !!currentEvent.dialog}
                />
              )}
              {partnerAvatarId && (
                <PixelCharacter
                  characterId={partnerAvatarId}
                  position="right"
                />
              )}
            </div>
          </PixelScene>

          {/* Diálogo fuera de la escena para mejor visibilidad en móvil */}
          {currentEvent.dialog && phase === 'scene' && (
            <div className="mt-2">
              <DialogBubble
                text={currentEvent.dialog}
                position="center"
              />
            </div>
          )}
        </div>

        {/* Panel de interacción */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Descripción */}
          <div className="bg-white/90 rounded-2xl p-4 mb-4 shadow-soft">
            <p className="text-[var(--color-text)] text-center">{currentEvent.description}</p>
          </div>

          {/* Según tipo de evento */}

          {/* STORY: Solo continuar */}
          {currentEvent.type === 'story' && phase === 'scene' && (
            <Button onClick={handleContinue}>Continuar →</Button>
          )}

          {/* CHOICE: Mostrar opciones */}
          {currentEvent.type === 'choice' && !showResult && (
            <div className="space-y-3">
              {currentEvent.choices?.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleVote(choice.text)}
                  disabled={!!myVote}
                  className={`
                    w-full p-4 rounded-2xl text-left transition-all
                    ${myVote === choice.text
                      ? 'bg-[var(--color-coral)] text-white scale-[0.98]'
                      : 'bg-white hover:bg-gray-50 active:scale-[0.98]'
                    }
                  `}
                >
                  <span className="font-medium">{choice.text}</span>
                </button>
              ))}

              {myVote && !partnerVote && (
                <div className="text-center py-4">
                  <div className="w-5 h-5 border-2 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm opacity-70">Esperando a tu pareja...</p>
                </div>
              )}
            </div>
          )}

          {/* CHOICE RESULT */}
          {currentEvent.type === 'choice' && showResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl text-center ${votesMatch ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <span className="text-3xl block mb-2">{votesMatch ? '🎉' : '🤔'}</span>
                <p className="font-medium mb-1">{votesMatch ? '¡Pensáis igual!' : 'Opiniones diferentes'}</p>
                <p className="text-sm opacity-80">{resultText}</p>
              </div>
              <Button onClick={handleContinue}>Continuar →</Button>
            </div>
          )}

          {/* MINIGAME: Botón de empezar o juego activo */}
          {currentEvent.type === 'minigame' && phase === 'scene' && (
            <Button onClick={handleStartMinigame}>¡Empezar!</Button>
          )}

          {currentEvent.type === 'minigame' && phase === 'minigame' && !showResult && (
            <div className="space-y-4">
              <div className="text-center">
                <span
                  className="text-6xl font-bold"
                  style={{ color: adventure.palette.primary }}
                >
                  {minigameTimer}
                </span>
              </div>
              <button
                onClick={() => setTapCount(c => c + 1)}
                className="w-full py-16 rounded-3xl text-white text-2xl font-bold active:scale-95 transition-transform"
                style={{ backgroundColor: adventure.palette.primary }}
              >
                ¡TAP! ({tapCount})
              </button>
            </div>
          )}

          {currentEvent.type === 'minigame' && showResult && (
            <div className="space-y-4">
              <div className="bg-white/90 rounded-2xl p-6 text-center shadow-soft">
                <span className="text-4xl block mb-2">🌟</span>
                <p className="text-2xl font-bold" style={{ color: adventure.palette.primary }}>
                  {tapCount} taps
                </p>
                <p className="text-sm opacity-70 mt-1">¡Buen trabajo en equipo!</p>
              </div>
              <Button onClick={handleContinue}>Continuar →</Button>
            </div>
          )}

          {/* REALLIFE: Reto de la vida real */}
          {currentEvent.type === 'reallife' && !showResult && (
            <div className="space-y-4">
              <div
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: `${adventure.palette.secondary}30` }}
              >
                <span className="text-4xl block mb-2">💕</span>
                <p className="text-lg font-medium" style={{ color: adventure.palette.primary }}>
                  {currentEvent.challenge}
                </p>
              </div>
              <Button onClick={handleRealLifeComplete}>¡Hecho! 💕</Button>
            </div>
          )}

          {currentEvent.type === 'reallife' && showResult && (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-2xl p-6 text-center">
                <span className="text-4xl block mb-2">✨</span>
                <p className="font-medium">¡Momento especial!</p>
              </div>
              <Button onClick={handleContinue}>Continuar →</Button>
            </div>
          )}

          {/* TREASURE: Final de aventura */}
          {currentEvent.type === 'treasure' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${adventure.palette.accent}40, ${adventure.palette.primary}40)`
                }}
              >
                <span className="text-5xl block mb-2">🏆</span>
                <p className="text-lg font-bold" style={{ color: adventure.palette.primary }}>
                  ¡Aventura completada!
                </p>
                <p className="text-sm opacity-70 mt-1">
                  Habéis vivido una experiencia única juntos
                </p>
              </div>
              <Button onClick={onFinish}>Terminar</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
