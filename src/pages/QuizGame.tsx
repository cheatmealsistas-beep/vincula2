import { useState } from 'react';
import { Button } from '../components';
import { QuizIcon } from '../components/icons/GameIcons';
import type { QuizQuestion } from '../data/quiz';

interface QuizGameProps {
  questions: QuizQuestion[];
  currentRound: number;
  totalRounds: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  myPlayerNumber: 1 | 2 | null;
  onSubmitAnswer: (answer: string) => void;
  onNextRound: () => void;
  onFinish: () => void;
}

export function QuizGame({
  questions,
  currentRound,
  totalRounds,
  myAnswer,
  partnerAnswer,
  bothRevealed,
  myPlayerNumber,
  onSubmitAnswer,
  onNextRound,
  onFinish,
}: QuizGameProps) {
  const [inputValue, setInputValue] = useState('');
  const currentQuestion = questions[currentRound - 1];
  const isLastRound = currentRound === totalRounds;

  // Alternar quién responde sobre sí mismo y quién adivina
  // Rondas impares: J1 responde sobre sí, J2 adivina
  // Rondas pares: J2 responde sobre sí, J1 adivina
  const isMyTurnToReveal = (currentRound % 2 === 1 && myPlayerNumber === 1) ||
                           (currentRound % 2 === 0 && myPlayerNumber === 2);

  const myQuestionText = isMyTurnToReveal
    ? currentQuestion?.question
    : currentQuestion?.partnerQuestion;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p>Cargando...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !myAnswer) {
      onSubmitAnswer(inputValue.trim());
      setInputValue('');
    }
  };

  const handleNext = () => {
    setInputValue('');
    if (isLastRound) {
      onFinish();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[var(--color-cream)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QuizIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            Quiz de pareja
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Pregunta {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Pregunta */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-soft">
          <p className="text-lg font-medium text-[var(--color-text)] text-center">
            {myQuestionText}
          </p>
          <p className="text-xs text-center text-[var(--color-text)] opacity-50 mt-2">
            {isMyTurnToReveal ? 'Responde sobre ti' : 'Adivina sobre tu pareja'}
          </p>
        </div>

        {/* Input de respuesta */}
        {!myAnswer ? (
          <div className="space-y-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full p-4 rounded-2xl bg-white/80 text-[var(--color-text)] placeholder:text-[var(--color-text)]/40 resize-none outline-none text-base min-h-[100px]"
              maxLength={200}
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
              Enviar respuesta
            </Button>
          </div>
        ) : !bothRevealed ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-3 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[var(--color-text)] opacity-70">
              Esperando a tu pareja...
            </p>
            <div className="mt-4 bg-white/50 rounded-2xl p-4">
              <p className="text-sm text-[var(--color-text)] opacity-60">Tu respuesta:</p>
              <p className="text-[var(--color-text)] font-medium mt-1">{myAnswer}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Respuestas reveladas */}
            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-1">Tú respondiste:</p>
              <p className="text-[var(--color-text)] font-medium">{myAnswer}</p>
            </div>

            <div className="bg-[var(--color-coral)]/10 rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text)] opacity-60 mb-1">Tu pareja respondió:</p>
              <p className="text-[var(--color-text)] font-medium">{partnerAnswer}</p>
            </div>

            {/* Feedback */}
            <div className="text-center py-4">
              <span className="text-3xl">💬</span>
              <p className="text-sm text-[var(--color-text)] opacity-70 mt-2">
                ¿Os conocíais tan bien?
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón siguiente */}
      {bothRevealed && (
        <div className="mt-6">
          <Button onClick={handleNext}>
            {isLastRound ? 'Ver resumen' : 'Siguiente pregunta'}
          </Button>
        </div>
      )}
    </div>
  );
}
