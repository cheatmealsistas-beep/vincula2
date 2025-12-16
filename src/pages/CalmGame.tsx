import { useState } from 'react';
import { Button } from '../components';
import { BreathingCircle } from '../components/BreathingCircle';

interface CalmGameProps {
  isInitiator: boolean; // ¿Yo pedí el momento de calma?
  partnerJoined: boolean;
  partnerResponse: 'breathing' | 'support' | 'presence' | null;
  onStartBreathing: () => void;
  onSendSupport: (message: string) => void;
  onJoinBreathing: () => void;
  onSendPresence: () => void;
  onFinish: () => void;
}

const SUPPORT_MESSAGES = [
  { emoji: '💙', text: 'Estoy aquí contigo' },
  { emoji: '🤗', text: 'Todo va a estar bien' },
  { emoji: '💪', text: 'Eres más fuerte de lo que crees' },
  { emoji: '🌸', text: 'Respira, yo te espero' },
  { emoji: '✨', text: 'Este momento pasará' },
];

export function CalmGame({
  isInitiator,
  partnerJoined,
  partnerResponse,
  onStartBreathing,
  onSendSupport,
  onJoinBreathing,
  onSendPresence,
  onFinish,
}: CalmGameProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(!isInitiator);

  const handleStartBreathing = () => {
    setIsBreathing(true);
    onStartBreathing();
  };

  const handleComplete = () => {
    setIsBreathing(false);
  };

  const handleSendSupport = (message: string) => {
    setSelectedSupport(message);
    onSendSupport(message);
    setShowOptions(false);
  };

  const handleJoinBreathing = () => {
    setIsBreathing(true);
    onJoinBreathing();
    setShowOptions(false);
  };

  // Vista para quien necesita calma (iniciador)
  if (isInitiator) {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-lavender)]/20">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">🌊</span>
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Momento Calma
          </h1>
          <p className="text-sm text-[var(--color-text)]/70 mt-1">
            Tómate tu tiempo, respira
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {!isBreathing ? (
            <div className="text-center space-y-6">
              <p className="text-[var(--color-text)]/80">
                ¿Listo/a para respirar?
              </p>
              <Button onClick={handleStartBreathing}>
                Comenzar respiración
              </Button>

              {/* Mensaje de la pareja si respondió */}
              {partnerResponse === 'support' && (
                <div className="mt-6 bg-white/80 rounded-2xl p-4 shadow-soft">
                  <p className="text-sm text-[var(--color-text)]/60 mb-1">
                    Tu pareja te dice:
                  </p>
                  <p className="text-[var(--color-text)] font-medium">
                    {selectedSupport || '💙 Estoy aquí contigo'}
                  </p>
                </div>
              )}

              {partnerResponse === 'presence' && (
                <div className="mt-6 text-center">
                  <span className="text-2xl">👤</span>
                  <p className="text-sm text-[var(--color-text)]/70 mt-1">
                    Tu pareja está aquí, acompañándote en silencio
                  </p>
                </div>
              )}
            </div>
          ) : (
            <BreathingCircle
              isActive={isBreathing}
              partnerJoined={partnerJoined}
              onComplete={handleComplete}
              cycles={4}
            />
          )}
        </div>

        {/* Botón terminar */}
        {!isBreathing && (
          <div className="mt-6">
            <button
              onClick={onFinish}
              className="w-full py-3 text-[var(--color-text)]/60 text-sm"
            >
              Volver a la sala
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vista para la pareja (no iniciador)
  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-coral)]/10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-4xl mb-2 block">💝</span>
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          Tu pareja necesita un momento
        </h1>
        <p className="text-sm text-[var(--color-text)]/70 mt-1">
          ¿Cómo quieres acompañarle?
        </p>
      </div>

      {/* Opciones de respuesta */}
      {showOptions ? (
        <div className="flex-1 flex flex-col gap-4">
          {/* Opción: Respirar juntos */}
          <button
            onClick={handleJoinBreathing}
            className="bg-[var(--color-lavender)]/20 rounded-2xl p-5 text-left hover:bg-[var(--color-lavender)]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🫁</span>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Respirar juntos
                </p>
                <p className="text-sm text-[var(--color-text)]/60">
                  Haced el ejercicio de respiración sincronizados
                </p>
              </div>
            </div>
          </button>

          {/* Opción: Enviar apoyo */}
          <div className="bg-white/80 rounded-2xl p-5">
            <p className="font-medium text-[var(--color-text)] mb-3">
              💬 Enviar mensaje de apoyo
            </p>
            <div className="grid grid-cols-1 gap-2">
              {SUPPORT_MESSAGES.map((msg) => (
                <button
                  key={msg.text}
                  onClick={() => handleSendSupport(msg.text)}
                  className="flex items-center gap-2 p-3 bg-[var(--color-cream)] rounded-xl hover:bg-[var(--color-lavender)]/20 transition-colors text-left"
                >
                  <span>{msg.emoji}</span>
                  <span className="text-sm text-[var(--color-text)]">
                    {msg.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Opción: Acompañar en silencio */}
          <button
            onClick={onSendPresence}
            className="bg-[var(--color-text)]/5 rounded-2xl p-5 text-left hover:bg-[var(--color-text)]/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤫</span>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Acompañar en silencio
                </p>
                <p className="text-sm text-[var(--color-text)]/60">
                  Solo estar presente, sin palabras
                </p>
              </div>
            </div>
          </button>
        </div>
      ) : isBreathing ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <BreathingCircle
            isActive={isBreathing}
            partnerJoined={true}
            onComplete={handleComplete}
            cycles={4}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-4">💝</span>
          <p className="text-[var(--color-text)]">
            Tu apoyo ha sido enviado
          </p>
          <p className="text-sm text-[var(--color-text)]/60 mt-2">
            Estás acompañando a tu pareja
          </p>
        </div>
      )}

      {/* Botón volver */}
      {!isBreathing && (
        <div className="mt-6">
          <button
            onClick={onFinish}
            className="w-full py-3 text-[var(--color-text)]/60 text-sm"
          >
            Volver a la sala
          </button>
        </div>
      )}
    </div>
  );
}
