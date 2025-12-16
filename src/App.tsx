import { useState, useEffect } from 'react';
import {
  Home,
  JoinRoom,
  InviteMessage,
  WelcomeMessage,
  Room,
  Game,
  WouldYouRatherGame,
  QuizGame,
  DrawGuessGame,
  AdventureGame,
  MirrorGame,
  TimelineGame,
  TimeCardsGame,
  CalmGame,
  LovePhrasesGame,
  RandomPlanGame,
  LeaveMessage,
  ViewMessage,
  Pause,
  End,
} from './pages';
import { useRoom } from './hooks/useRoom';
import { useGame } from './hooks/useGame';
import { useWouldYouRather } from './hooks/useWouldYouRather';
import { useQuiz } from './hooks/useQuiz';
import { useDrawGuess } from './hooks/useDrawGuess';
import { useAdventure } from './hooks/useAdventure';
import { useMirror } from './hooks/useMirror';
import { useTimeline } from './hooks/useTimeline';
import { useTimeCards } from './hooks/useTimeCards';
import { useCalm } from './hooks/useCalm';
import { useLovePhrases } from './hooks/useLovePhrases';
import { useRandomPlan } from './hooks/useRandomPlan';
import { getGameById } from './data/games';

type Screen =
  | 'home'
  | 'join'
  | 'invite-message'
  | 'welcome-message'
  | 'room'
  | 'game'
  | 'leave-message'
  | 'view-message'
  | 'pause'
  | 'end';

// Genera un código memorable tipo "LUNA42"
function generateCode(): string {
  const words = ['LUNA', 'SOL', 'MAR', 'CIELO', 'RIO', 'LUZ', 'PAZ', 'AIRE'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${word}${num}`;
}

// Prompts para los tipos de mensaje
const MESSAGE_PROMPTS: Record<string, string> = {
  feel: 'Hoy me siento...',
  need: 'Necesitaría...',
  thanks: 'Gracias por...',
  sorry: 'Perdona por...',
  free: 'Quiero decirte que...',
};

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [joinError, setJoinError] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<string>('cards');
  const [showWelcome, setShowWelcome] = useState(false);
  const [urlCode, setUrlCode] = useState<string | null>(null);

  // Leer código de la URL al cargar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setUrlCode(code.toUpperCase());
      // Limpiar la URL sin recargar
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Hook de Supabase para la sala
  const {
    room,
    myPlayerNumber,
    partnerOnline,
    partnerLastSeen,
    pendingMessage,
    isPaused,
    pauseMessage,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    markMessageRead,
    setPause,
    resumeFromPause,
  } = useRoom();

  // Hooks de juegos
  const cardsGame = useGame(room?.id || null, myPlayerNumber);
  const wyrGame = useWouldYouRather(room?.id || null, myPlayerNumber);
  const quizGame = useQuiz(room?.id || null, myPlayerNumber);
  const drawGame = useDrawGuess(room?.id || null, myPlayerNumber);
  const adventureGame = useAdventure(room?.id || null, myPlayerNumber);
  const mirrorGame = useMirror(room?.id || null, myPlayerNumber);
  const timelineGame = useTimeline(room?.id || null, myPlayerNumber);
  const timeCardsGame = useTimeCards(room?.id || null, myPlayerNumber);
  const calmGame = useCalm(room?.id || null, myPlayerNumber);
  const lovePhrasesGame = useLovePhrases(room?.id || null, myPlayerNumber);
  const randomPlanGame = useRandomPlan(room?.id || null, myPlayerNumber);

  // Determinar qué juego está activo
  const gameType = room?.game_type || 'cards';
  const currentGameInfo = getGameById(gameType);
  const selectedGameInfo = getGameById(selectedGameType);

  // --- Handlers de navegación ---

  const handleSelectGame = (gameTypeSelected: string) => {
    setSelectedGameType(gameTypeSelected);
    setScreen('invite-message');
  };

  const handleCreateRoomWithMessage = async (inviteMessage?: string) => {
    const code = generateCode();
    const success = await createRoom(code, selectedGameType, inviteMessage);
    if (success) {
      setScreen('room');
    }
  };

  const handleJoinRoom = async (code: string) => {
    if (code.length < 4) {
      setJoinError('El código debe tener al menos 4 caracteres');
      return;
    }

    const success = await joinRoom(code);
    if (success) {
      setJoinError('');
      // Si hay mensaje de invitación, mostrar pantalla de bienvenida
      // El room ya está disponible después de joinRoom
      setShowWelcome(true);
      setScreen('welcome-message');
    } else {
      setJoinError(error || 'No se pudo unir a la sala');
    }
  };

  // Unirse automáticamente si hay código en la URL
  useEffect(() => {
    if (urlCode && screen === 'home' && !room) {
      handleJoinRoom(urlCode);
      setUrlCode(null);
    }
  }, [urlCode]);

  const handleWelcomeContinue = () => {
    setShowWelcome(false);
    setScreen('room');
  };

  const handleGoHome = async () => {
    await leaveRoom();
    setScreen('home');
  };

  // --- Handlers de la Sala ---

  const handlePlayTogether = async () => {
    if (gameType === 'wouldyourather') {
      await wyrGame.startGame();
    } else if (gameType === 'quiz') {
      await quizGame.startGame();
    } else if (gameType === 'draw') {
      await drawGame.startGame();
    } else if (gameType === 'adventure') {
      await adventureGame.startGame();
    } else if (gameType === 'mirror') {
      await mirrorGame.startGame();
    } else if (gameType === 'timeline') {
      await timelineGame.startGame();
    } else if (gameType === 'timecards') {
      await timeCardsGame.startGame();
    } else if (gameType === 'calm') {
      await calmGame.startCalm();
    } else if (gameType === 'lovephrases') {
      await lovePhrasesGame.startGame();
    } else if (gameType === 'randomplan') {
      await randomPlanGame.startGame();
    } else {
      await cardsGame.startGame();
    }
    setScreen('game');
  };

  const handleLeaveMessage = () => {
    setScreen('leave-message');
  };

  const handleViewMessage = () => {
    setScreen('view-message');
  };

  const handlePause = () => {
    setScreen('pause');
  };

  const handleResume = async () => {
    await resumeFromPause();
  };

  const handleNeedCalm = async () => {
    await calmGame.startCalm();
    setScreen('game');
  };

  // --- Handlers de Mensajes ---

  const handleSendMessage = async (type: string, content: string) => {
    const prompt = MESSAGE_PROMPTS[type] || type;
    await sendMessage(type, prompt, content);
    setScreen('room');
  };

  const handleSendGesture = async (gesture: string) => {
    if (pendingMessage) {
      await markMessageRead(pendingMessage.id, gesture);
    }
  };

  const handleCloseMessage = async () => {
    if (pendingMessage) {
      await markMessageRead(pendingMessage.id);
    }
    setScreen('room');
  };

  // --- Handlers de Pausa ---

  const handleConfirmPause = async (returnTime?: string) => {
    const message = returnTime
      ? `Tu pareja necesita un momento. Volverá: ${returnTime}`
      : 'Tu pareja necesita un momento. No es un adiós, es un respiro.';
    await setPause(message, returnTime);
    setScreen('room');
  };

  // --- Handlers del Juego de Cartas ---

  const handleSubmitResponse = async (response: string) => {
    await cardsGame.submitResponse(response);
  };

  const handleGameGesture = async (gesture: string) => {
    await cardsGame.sendGesture(gesture);
  };

  const handleNextRound = () => {
    if (gameType === 'wouldyourather') {
      wyrGame.nextRound();
    } else if (gameType === 'quiz') {
      quizGame.nextRound();
    } else if (gameType === 'draw') {
      drawGame.nextRound();
    } else if (gameType === 'mirror') {
      mirrorGame.nextRound();
    } else if (gameType === 'timeline') {
      timelineGame.nextRound();
    } else if (gameType === 'timecards') {
      timeCardsGame.nextRound();
    } else if (gameType === 'lovephrases') {
      lovePhrasesGame.nextRound();
    } else {
      cardsGame.nextRound();
    }
  };

  const handleFinish = () => {
    setScreen('end');
  };

  const handlePlayAgain = async () => {
    if (gameType === 'wouldyourather') {
      await wyrGame.resetGame();
      await wyrGame.startGame();
    } else if (gameType === 'quiz') {
      await quizGame.resetGame();
      await quizGame.startGame();
    } else if (gameType === 'draw') {
      await drawGame.resetGame();
      await drawGame.startGame();
    } else if (gameType === 'adventure') {
      await adventureGame.resetGame();
      await adventureGame.startGame();
    } else if (gameType === 'mirror') {
      await mirrorGame.resetGame();
      await mirrorGame.startGame();
    } else if (gameType === 'timeline') {
      await timelineGame.resetGame();
      await timelineGame.startGame();
    } else if (gameType === 'timecards') {
      await timeCardsGame.resetGame();
      await timeCardsGame.startGame();
    } else if (gameType === 'lovephrases') {
      await lovePhrasesGame.resetGame();
      await lovePhrasesGame.startGame();
    } else if (gameType === 'randomplan') {
      await randomPlanGame.resetGame();
      await randomPlanGame.startGame();
    } else {
      await cardsGame.resetGame();
      await cardsGame.startGame();
    }
    setScreen('game');
  };

  const handleBackToRoom = () => {
    setScreen('room');
  };

  // --- Handlers del Juego ¿Qué prefieres? ---

  const handleSubmitChoice = async (choice: 'A' | 'B') => {
    await wyrGame.submitChoice(choice);
  };

  // --- Handlers del Quiz ---

  const handleSubmitQuizAnswer = async (answer: string) => {
    await quizGame.submitAnswer(answer);
  };

  // --- Handlers del Dibuja y Adivina ---

  const handleSubmitDrawing = async (dataUrl: string) => {
    await drawGame.submitDrawing(dataUrl);
  };

  const handleSubmitGuess = async (guess: string) => {
    await drawGame.submitGuess(guess);
  };

  // --- Handlers del Espejo del Alma ---

  const handleSubmitMirrorAnswer = async (answer: string) => {
    await mirrorGame.submitAnswer(answer);
  };

  // --- Handlers de Nuestra Historia ---

  const handleSubmitTimelineAnswer = async (answer: string) => {
    await timelineGame.submitAnswer(answer);
  };

  // --- Handlers de Cartas del Tiempo ---

  const handleSubmitTimeCardsAnswer = async (answer: string) => {
    await timeCardsGame.submitAnswer(answer);
  };

  // --- Handlers de Te quiero porque... ---

  const handleSubmitLovePhrasesAnswer = async (answer: string) => {
    await lovePhrasesGame.submitAnswer(answer);
  };

  // --- Handlers de Plan Random ---

  const handleRollDice = async () => {
    await randomPlanGame.rollDice();
  };

  // Mensaje pendiente formateado para ViewMessage
  const formattedPendingMessage = pendingMessage
    ? {
        type: pendingMessage.message_type,
        prompt: pendingMessage.prompt,
        content: pendingMessage.content,
        gesture: pendingMessage.gesture,
      }
    : null;

  return (
    <>
      <div className="bubbles-bg" aria-hidden="true" />
      <div className="max-w-md mx-auto">
      {screen === 'home' && (
        <Home
          onCreateRoom={handleSelectGame}
          onJoinRoom={() => setScreen('join')}
        />
      )}

      {screen === 'join' && (
        <JoinRoom
          onJoin={handleJoinRoom}
          onBack={() => setScreen('home')}
          error={joinError}
        />
      )}

      {screen === 'invite-message' && selectedGameInfo && (
        <InviteMessage
          gameId={selectedGameInfo.id}
          gameName={selectedGameInfo.name}
          onContinue={handleCreateRoomWithMessage}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'welcome-message' && room?.invite_message && showWelcome && (
        <WelcomeMessage
          message={room.invite_message}
          gameId={currentGameInfo?.id}
          gameName={currentGameInfo?.name}
          onContinue={handleWelcomeContinue}
        />
      )}

      {/* Si no hay mensaje de invitación, ir directo a la sala */}
      {screen === 'welcome-message' && (!room?.invite_message || !showWelcome) && room && (
        <Room
          code={room.code}
          partnerOnline={partnerOnline}
          partnerLastSeen={partnerLastSeen || undefined}
          hasPendingMessage={!!pendingMessage}
          isPaused={isPaused}
          pauseMessage={pauseMessage || undefined}
          gameId={currentGameInfo?.id}
          gameName={currentGameInfo?.name}
          onPlayTogether={handlePlayTogether}
          onLeaveMessage={handleLeaveMessage}
          onViewMessage={handleViewMessage}
          onPause={handlePause}
          onResume={handleResume}
          onLeave={handleGoHome}
          onNeedCalm={handleNeedCalm}
        />
      )}

      {screen === 'room' && room && (
        <Room
          code={room.code}
          partnerOnline={partnerOnline}
          partnerLastSeen={partnerLastSeen || undefined}
          hasPendingMessage={!!pendingMessage}
          isPaused={isPaused}
          pauseMessage={pauseMessage || undefined}
          gameId={currentGameInfo?.id}
          gameName={currentGameInfo?.name}
          onPlayTogether={handlePlayTogether}
          onLeaveMessage={handleLeaveMessage}
          onViewMessage={handleViewMessage}
          onPause={handlePause}
          onResume={handleResume}
          onLeave={handleGoHome}
          onNeedCalm={handleNeedCalm}
        />
      )}

      {screen === 'leave-message' && (
        <LeaveMessage onSend={handleSendMessage} onBack={handleBackToRoom} />
      )}

      {screen === 'view-message' && formattedPendingMessage && (
        <ViewMessage
          message={formattedPendingMessage}
          onGesture={handleSendGesture}
          onClose={handleCloseMessage}
        />
      )}

      {screen === 'pause' && (
        <Pause onConfirm={handleConfirmPause} onCancel={handleBackToRoom} />
      )}

      {/* Juego de Cartas */}
      {screen === 'game' && gameType === 'cards' && (
        <Game
          cards={cardsGame.cards}
          currentRound={cardsGame.currentRound}
          totalRounds={cardsGame.cards.length}
          myResponse={cardsGame.myResponse || undefined}
          partnerResponse={cardsGame.partnerResponse || undefined}
          bothRevealed={cardsGame.bothRevealed}
          onSubmitResponse={handleSubmitResponse}
          onSendGesture={handleGameGesture}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Juego ¿Qué prefieres? */}
      {screen === 'game' && gameType === 'wouldyourather' && (
        <WouldYouRatherGame
          cards={wyrGame.cards}
          currentRound={wyrGame.currentRound}
          totalRounds={wyrGame.cards.length}
          myChoice={wyrGame.myChoice}
          partnerChoice={wyrGame.partnerChoice}
          bothRevealed={wyrGame.bothRevealed}
          onSubmitChoice={handleSubmitChoice}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Quiz de pareja */}
      {screen === 'game' && gameType === 'quiz' && (
        <QuizGame
          questions={quizGame.questions}
          currentRound={quizGame.currentRound}
          totalRounds={quizGame.questions.length}
          myAnswer={quizGame.myAnswer}
          partnerAnswer={quizGame.partnerAnswer}
          bothRevealed={quizGame.bothRevealed}
          myPlayerNumber={myPlayerNumber}
          onSubmitAnswer={handleSubmitQuizAnswer}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Dibuja y Adivina */}
      {screen === 'game' && gameType === 'draw' && (
        <DrawGuessGame
          words={drawGame.words}
          currentRound={drawGame.currentRound}
          totalRounds={drawGame.words.length}
          isMyTurnToDraw={drawGame.isMyTurnToDraw}
          currentWord={drawGame.currentWord}
          myDrawing={drawGame.myDrawing}
          partnerDrawing={drawGame.partnerDrawing}
          myGuess={drawGame.myGuess}
          partnerGuess={drawGame.partnerGuess}
          correctGuess={drawGame.correctGuess}
          onSubmitDrawing={handleSubmitDrawing}
          onSubmitGuess={handleSubmitGuess}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Aventura */}
      {screen === 'game' && gameType === 'adventure' && adventureGame.adventure && (
        <AdventureGame
          adventure={adventureGame.adventure}
          myAvatarId={adventureGame.myAvatarId}
          partnerAvatarId={adventureGame.partnerAvatarId}
          currentEventId={adventureGame.currentEventId}
          completedEventIds={adventureGame.completedEventIds}
          myVote={adventureGame.myVote}
          partnerVote={adventureGame.partnerVote}
          onSelectAvatar={adventureGame.selectAvatar}
          onMoveToEvent={adventureGame.moveToEvent}
          onVote={adventureGame.vote}
          onCompleteEvent={adventureGame.completeEvent}
          onFinish={handleFinish}
        />
      )}

      {/* Espejo del Alma */}
      {screen === 'game' && gameType === 'mirror' && (
        <MirrorGame
          prompts={mirrorGame.prompts}
          currentRound={mirrorGame.currentRound}
          totalRounds={mirrorGame.prompts.length}
          myAnswer={mirrorGame.myAnswer}
          partnerAnswer={mirrorGame.partnerAnswer}
          bothRevealed={mirrorGame.bothRevealed}
          onSubmitAnswer={handleSubmitMirrorAnswer}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Nuestra Historia */}
      {screen === 'game' && gameType === 'timeline' && (
        <TimelineGame
          prompts={timelineGame.prompts}
          currentRound={timelineGame.currentRound}
          totalRounds={timelineGame.prompts.length}
          myAnswer={timelineGame.myAnswer}
          partnerAnswer={timelineGame.partnerAnswer}
          bothRevealed={timelineGame.bothRevealed}
          onSubmitAnswer={handleSubmitTimelineAnswer}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Cartas del Tiempo */}
      {screen === 'game' && gameType === 'timecards' && (
        <TimeCardsGame
          cards={timeCardsGame.cards}
          currentRound={timeCardsGame.currentRound}
          totalRounds={timeCardsGame.cards.length}
          myAnswer={timeCardsGame.myAnswer}
          partnerAnswer={timeCardsGame.partnerAnswer}
          bothRevealed={timeCardsGame.bothRevealed}
          onSubmitAnswer={handleSubmitTimeCardsAnswer}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Momento Calma */}
      {screen === 'game' && gameType === 'calm' && (
        <CalmGame
          isInitiator={calmGame.isInitiator}
          partnerJoined={calmGame.partnerJoined}
          partnerResponse={calmGame.partnerResponse}
          onStartBreathing={calmGame.startBreathing}
          onSendSupport={calmGame.sendSupport}
          onJoinBreathing={calmGame.startBreathing}
          onSendPresence={calmGame.sendPresence}
          onFinish={handleBackToRoom}
        />
      )}

      {/* Te quiero porque... */}
      {screen === 'game' && gameType === 'lovephrases' && (
        <LovePhrasesGame
          phrases={lovePhrasesGame.phrases}
          currentRound={lovePhrasesGame.currentRound}
          totalRounds={lovePhrasesGame.phrases.length}
          myAnswer={lovePhrasesGame.myAnswer}
          partnerAnswer={lovePhrasesGame.partnerAnswer}
          bothRevealed={lovePhrasesGame.bothRevealed}
          onSubmitAnswer={handleSubmitLovePhrasesAnswer}
          onNextRound={handleNextRound}
          onFinish={handleFinish}
        />
      )}

      {/* Plan Random */}
      {screen === 'game' && gameType === 'randomplan' && (
        <RandomPlanGame
          myHalfPlan={randomPlanGame.myHalfPlan}
          partnerHalfPlan={randomPlanGame.partnerHalfPlan}
          fullPlan={randomPlanGame.fullPlan}
          hasRolled={randomPlanGame.hasRolled}
          partnerHasRolled={randomPlanGame.partnerHasRolled}
          bothRevealed={randomPlanGame.bothRevealed}
          myCategories={randomPlanGame.myCategories}
          onRollDice={handleRollDice}
          onReroll={randomPlanGame.reroll}
          onFinish={handleFinish}
        />
      )}

      {screen === 'end' && (
        <End onPlayAgain={handlePlayAgain} onGoHome={handleBackToRoom} />
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-8 h-8 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[var(--color-text)]">Un momento...</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
