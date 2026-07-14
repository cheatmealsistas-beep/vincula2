import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Home,
  JoinRoom,
  ShareAndInvite,
  GameSelect,
  WelcomeMessage,
  WaitingForGame,
  Room,
  LeaveMessage,
  ViewMessage,
  Pause,
  End,
} from './pages';
import {
  saveSession,
  getSession,
  updateSession,
  clearSession,
} from './hooks/useSessionPersistence';

// Lazy loading de juegos para reducir el bundle inicial
const Game = lazy(() => import('./pages/Game').then(m => ({ default: m.Game })));
const WouldYouRatherGame = lazy(() => import('./pages/WouldYouRatherGame').then(m => ({ default: m.WouldYouRatherGame })));
const QuizGame = lazy(() => import('./pages/QuizGame').then(m => ({ default: m.QuizGame })));
const DrawGuessGame = lazy(() => import('./pages/DrawGuessGame').then(m => ({ default: m.DrawGuessGame })));
const AdventureGame = lazy(() => import('./pages/AdventureGame').then(m => ({ default: m.AdventureGame })));
const MirrorGame = lazy(() => import('./pages/MirrorGame').then(m => ({ default: m.MirrorGame })));
const TimelineGame = lazy(() => import('./pages/TimelineGame').then(m => ({ default: m.TimelineGame })));
const TimeCardsGame = lazy(() => import('./pages/TimeCardsGame').then(m => ({ default: m.TimeCardsGame })));
const CalmGame = lazy(() => import('./pages/CalmGame').then(m => ({ default: m.CalmGame })));
const LovePhrasesGame = lazy(() => import('./pages/LovePhrasesGame').then(m => ({ default: m.LovePhrasesGame })));
const RandomPlanGame = lazy(() => import('./pages/RandomPlanGame').then(m => ({ default: m.RandomPlanGame })));
const SillyChallengesGame = lazy(() => import('./pages/SillyChallengesGame').then(m => ({ default: m.SillyChallengesGame })));
const AbsurdPhrasesGame = lazy(() => import('./pages/AbsurdPhrasesGame').then(m => ({ default: m.AbsurdPhrasesGame })));
const SpinWheelGame = lazy(() => import('./pages/SpinWheelGame').then(m => ({ default: m.SpinWheelGame })));

// Fallback mientras carga un juego
function GameLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-text)] opacity-70">Preparando el juego...</p>
      </div>
    </div>
  );
}

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
import { useSillyChallenges } from './hooks/useSillyChallenges';
import { useAbsurdPhrases } from './hooks/useAbsurdPhrases';
import { useSpinWheel } from './hooks/useSpinWheel';
import { getGameById } from './data/games';

type Screen =
  | 'home'
  | 'join'
  | 'share-invite'    // Creador: compartir link + mensaje
  | 'game-select'     // Creador: elegir juego
  | 'welcome-message' // Invitado: ver mensaje del creador
  | 'waiting-game'    // Invitado: esperar a que elijan juego
  | 'room'
  | 'game'
  | 'leave-message'
  | 'view-message'
  | 'pause'
  | 'end';

// Genera un código memorable tipo "AMOR4217"
function generateCode(): string {
  const words = ['AMOR', 'BESO', 'ALMA', 'MIEL', 'NIDO', 'LAZO', 'MIMO', 'LUNA'];
  const word = words[Math.floor(Math.random() * words.length)];
  // 4 dígitos (1000-9999) en vez de 2: sube el espacio de códigos de 720 a ~72.000
  const num = Math.floor(Math.random() * 9000) + 1000;
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
  const [notification, setNotification] = useState<string | null>(null);
  const [prevPartnerOnline, setPrevPartnerOnline] = useState<boolean | null>(null);

  // Mostrar notificación temporal
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Guardar pantalla actual en sesión (wrapper de setScreen)
  const navigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
    updateSession({ currentScreen: newScreen });
  };

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
    setGameType,
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
  const sillyChallengesGame = useSillyChallenges(room?.id || null, myPlayerNumber);
  const absurdPhrasesGame = useAbsurdPhrases(room?.id || null, myPlayerNumber);
  const spinWheelGame = useSpinWheel(room?.id || null, myPlayerNumber);

  // Determinar qué juego está activo
  const gameType = room?.game_type || selectedGameType || 'cards';
  const currentGameInfo = getGameById(gameType);

  // Función auxiliar para iniciar juego según tipo (definida antes de useEffects)
  const startGameByType = async (type: string) => {
    if (type === 'wouldyourather') {
      await wyrGame.startGame();
    } else if (type === 'quiz') {
      await quizGame.startGame();
    } else if (type === 'draw') {
      await drawGame.startGame();
    } else if (type === 'adventure') {
      await adventureGame.startGame();
    } else if (type === 'mirror') {
      await mirrorGame.startGame();
    } else if (type === 'timeline') {
      await timelineGame.startGame();
    } else if (type === 'timecards') {
      await timeCardsGame.startGame();
    } else if (type === 'calm') {
      await calmGame.startCalm();
    } else if (type === 'lovephrases') {
      await lovePhrasesGame.startGame();
    } else if (type === 'randomplan') {
      await randomPlanGame.startGame();
    } else if (type === 'sillychallenges') {
      await sillyChallengesGame.startGame();
    } else if (type === 'absurdphrases') {
      await absurdPhrasesGame.startGame();
    } else if (type === 'spinwheel') {
      await spinWheelGame.startGame();
    } else {
      await cardsGame.startGame();
    }
  };

  // Restaurar sesión al cargar
  useEffect(() => {
    const savedSession = getSession();
    if (savedSession && !room) {
      // Intentar reconectar a la sala guardada
      joinRoom(savedSession.roomCode).then((success) => {
        if (success) {
          // Restaurar sesión según estado guardado
          if (savedSession.gameType) {
            setSelectedGameType(savedSession.gameType);
          }

          const savedScreen = savedSession.currentScreen;

          // Si estaba en un juego o en 'end', no podemos restaurar el estado
          // del juego en memoria, así que volvemos a una pantalla segura
          if (!savedScreen || savedScreen === 'home' || savedScreen === 'game' || savedScreen === 'end') {
            if (savedSession.playerNumber === 1) {
              setScreen('game-select');
            } else {
              setScreen('waiting-game');
            }
          } else {
            setScreen(savedScreen);
          }
          showNotification('¡Reconectado!');
        } else {
          clearSession();
        }
      });
    }
  }, []);

  // Notificar cuando la pareja se conecta/desconecta
  useEffect(() => {
    if (prevPartnerOnline === null) {
      // Primera vez, solo guardar estado
      setPrevPartnerOnline(partnerOnline);
      return;
    }

    if (prevPartnerOnline !== partnerOnline) {
      if (partnerOnline) {
        showNotification('Tu pareja ha vuelto 💜');
      } else {
        showNotification('Tu pareja se ha desconectado...');
      }
      setPrevPartnerOnline(partnerOnline);
    }
  }, [partnerOnline, prevPartnerOnline]);

  // Invitado: detectar cuando el creador inicia un juego
  useEffect(() => {
    console.log('[App] Checking game start:', { screen, gameType: room?.game_type, myPlayerNumber });
    if (screen === 'waiting-game' && room?.game_type && myPlayerNumber === 2) {
      // El creador ha elegido un juego, empezar
      console.log('[App] Invitado detectó juego:', room.game_type);
      setSelectedGameType(room.game_type);
      updateSession({ gameType: room.game_type, currentScreen: 'game' });
      startGameByType(room.game_type);
      setScreen('game');
    }
  }, [room?.game_type, screen, myPlayerNumber]);

  // Efecto para manejar cuando la pareja termina el juego
  useEffect(() => {
    if (screen === 'game') {
      if (sillyChallengesGame.gameFinished && gameType === 'sillychallenges') {
        setScreen('end');
      }
      if (absurdPhrasesGame.gameFinished && gameType === 'absurdphrases') {
        setScreen('end');
      }
      if (wyrGame.gameFinished && gameType === 'wouldyourather') {
        setScreen('end');
      }
      if (lovePhrasesGame.gameFinished && gameType === 'lovephrases') {
        setScreen('end');
      }
      if (timelineGame.gameFinished && gameType === 'timeline') {
        setScreen('end');
      }
      if (cardsGame.gameFinished && gameType === 'cards') {
        setScreen('end');
      }
      if (spinWheelGame.gameFinished && gameType === 'spinwheel') {
        setScreen('end');
      }
    }
  }, [
    sillyChallengesGame.gameFinished,
    absurdPhrasesGame.gameFinished,
    wyrGame.gameFinished,
    lovePhrasesGame.gameFinished,
    timelineGame.gameFinished,
    cardsGame.gameFinished,
    spinWheelGame.gameFinished,
    screen,
    gameType,
  ]);

  // Estado temporal para código generado (para guardar sesión cuando room esté listo)
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  // Efecto para guardar sesión cuando la sala se crea
  useEffect(() => {
    if (pendingCode && room && myPlayerNumber === 1) {
      saveSession({
        roomId: room.id,
        roomCode: pendingCode,
        playerNumber: 1,
        currentScreen: 'share-invite',
      });
      setPendingCode(null);
      setScreen('share-invite');
    }
  }, [room, pendingCode, myPlayerNumber]);

  // --- Handlers de navegación ---

  // Creador: Home → crea sala → ShareAndInvite
  const handleStartAsHost = async () => {
    const code = generateCode();
    setPendingCode(code);
    await createRoom(code);
    // La navegación se hace en el useEffect de arriba cuando room esté listo
  };

  // Creador: ShareAndInvite → GameSelect
  const handleShareContinue = (inviteMessage?: string) => {
    if (inviteMessage && room) {
      // Guardar mensaje de invitación en la sala
      updateSession({ inviteMessage });
    }
    navigateTo('game-select');
  };

  // Creador: GameSelect → selecciona juego → inicia juego
  const handleSelectAndStartGame = async (gameTypeSelected: string) => {
    setSelectedGameType(gameTypeSelected);
    updateSession({ gameType: gameTypeSelected, currentScreen: 'game' });
    // Actualizar el game_type en Supabase (para que el invitado lo vea)
    await setGameType(gameTypeSelected);
    // Iniciar el juego seleccionado
    await startGameByType(gameTypeSelected);
    setScreen('game');
  };

  // Estado para código de unión pendiente
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  // Efecto para manejar cuando el invitado se une
  useEffect(() => {
    if (pendingJoinCode && room && myPlayerNumber === 2) {
      const initialScreen = room.invite_message ? 'welcome-message' : 'waiting-game';
      saveSession({
        roomId: room.id,
        roomCode: pendingJoinCode,
        playerNumber: 2,
        inviteMessage: room.invite_message,
        currentScreen: initialScreen,
      });
      setPendingJoinCode(null);

      // Si hay mensaje de invitación, mostrar pantalla de bienvenida
      if (room.invite_message) {
        setShowWelcome(true);
        setScreen('welcome-message');
      } else {
        // Sin mensaje, ir directo a esperar juego
        setScreen('waiting-game');
      }
    }
  }, [room, pendingJoinCode, myPlayerNumber]);

  const handleJoinRoom = async (code: string) => {
    if (code.length < 4) {
      setJoinError('El código debe tener al menos 4 caracteres');
      return;
    }

    setPendingJoinCode(code);
    const success = await joinRoom(code);
    if (!success) {
      setPendingJoinCode(null);
      setJoinError(error || 'No se pudo unir a la sala');
    } else {
      setJoinError('');
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
    // Invitado va a esperar que el creador elija juego
    navigateTo('waiting-game');
  };

  const handleGoHome = async () => {
    await leaveRoom();
    clearSession();
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
    } else if (gameType === 'sillychallenges') {
      await sillyChallengesGame.startGame();
    } else if (gameType === 'absurdphrases') {
      await absurdPhrasesGame.startGame();
    } else if (gameType === 'spinwheel') {
      await spinWheelGame.startGame();
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

  // --- Handlers de Mensajes ---

  const handleSendMessage = async (type: string, content: string) => {
    const prompt = MESSAGE_PROMPTS[type] || type;
    await sendMessage(type, prompt, content);
    setScreen('room');
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
    } else if (gameType === 'sillychallenges') {
      sillyChallengesGame.nextRound();
    } else if (gameType === 'absurdphrases') {
      absurdPhrasesGame.nextRound();
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
    } else if (gameType === 'sillychallenges') {
      await sillyChallengesGame.resetGame();
      await sillyChallengesGame.startGame();
    } else if (gameType === 'absurdphrases') {
      await absurdPhrasesGame.resetGame();
      await absurdPhrasesGame.startGame();
    } else if (gameType === 'spinwheel') {
      spinWheelGame.reset();
      await spinWheelGame.startGame();
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
      }
    : null;

  return (
    <>
      <div className="bubbles-bg" aria-hidden="true" />
      <div className="max-w-md mx-auto">
      {screen === 'home' && (
        <Home
          onCreateRoom={handleStartAsHost}
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

      {/* Creador: Compartir link + mensaje opcional */}
      {screen === 'share-invite' && room && (
        <ShareAndInvite
          code={room.code}
          onContinue={handleShareContinue}
          onBack={handleGoHome}
        />
      )}

      {/* Creador: Elegir juego */}
      {screen === 'game-select' && room && (
        <GameSelect
          partnerOnline={partnerOnline}
          onSelectGame={handleSelectAndStartGame}
          onBack={() => setScreen('share-invite')}
        />
      )}

      {/* Invitado: Ver mensaje del creador */}
      {screen === 'welcome-message' && room?.invite_message && showWelcome && (
        <WelcomeMessage
          message={room.invite_message}
          gameId={currentGameInfo?.id}
          gameName={currentGameInfo?.name}
          onContinue={handleWelcomeContinue}
        />
      )}

      {/* Invitado: Esperar a que el creador elija juego */}
      {screen === 'waiting-game' && (
        room ? (
          <WaitingForGame
            inviteMessage={room.invite_message}
            onLeave={handleGoHome}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--color-text)] opacity-70">Conectando...</p>
            </div>
          </div>
        )
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
        />
      )}

      {screen === 'leave-message' && (
        <LeaveMessage onSend={handleSendMessage} onBack={handleBackToRoom} />
      )}

      {screen === 'view-message' && formattedPendingMessage && (
        <ViewMessage
          message={formattedPendingMessage}
          onClose={handleCloseMessage}
        />
      )}

      {screen === 'pause' && (
        <Pause onConfirm={handleConfirmPause} onCancel={handleBackToRoom} />
      )}

      {/* Juegos - con lazy loading */}
      <Suspense fallback={<GameLoader />}>
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
          onNextRound={handleNextRound}
          onFinish={() => {
            cardsGame.finishGame();
            handleFinish();
          }}
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
          onFinish={() => {
            wyrGame.finishGame();
            handleFinish();
          }}
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
          onFinish={() => {
            timelineGame.finishGame();
            handleFinish();
          }}
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
          onFinish={() => {
            lovePhrasesGame.finishGame();
            handleFinish();
          }}
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
          myLocked={randomPlanGame.myLocked}
          partnerLocked={randomPlanGame.partnerLocked}
          canReroll={randomPlanGame.canReroll}
          onRollDice={handleRollDice}
          onRerollOption={randomPlanGame.rerollOption}
          onLock={randomPlanGame.lockPlan}
          onFinish={handleFinish}
        />
      )}

      {/* Retos */}
      {screen === 'game' && gameType === 'sillychallenges' && (
        <SillyChallengesGame
          challenges={sillyChallengesGame.challenges}
          currentRound={sillyChallengesGame.currentRound}
          totalRounds={sillyChallengesGame.challenges.length}
          iAmChallenged={sillyChallengesGame.iAmChallenged}
          challengeCompleted={sillyChallengesGame.challengeCompleted}
          partnerConfirmed={sillyChallengesGame.partnerConfirmed}
          partnerRejected={sillyChallengesGame.partnerRejected}
          onCompleteChallenge={sillyChallengesGame.completeChallenge}
          onConfirmPartner={sillyChallengesGame.confirmPartnerChallenge}
          onRejectPartner={sillyChallengesGame.rejectPartnerChallenge}
          onNextRound={handleNextRound}
          onFinish={() => {
            sillyChallengesGame.finishGame();
            handleFinish();
          }}
        />
      )}

      {/* Completa la Frase */}
      {screen === 'game' && gameType === 'absurdphrases' && (
        <AbsurdPhrasesGame
          phrases={absurdPhrasesGame.phrases}
          currentRound={absurdPhrasesGame.currentRound}
          totalRounds={absurdPhrasesGame.phrases.length}
          myAnswer={absurdPhrasesGame.myAnswer}
          partnerAnswer={absurdPhrasesGame.partnerAnswer}
          bothRevealed={absurdPhrasesGame.bothRevealed}
          onSubmitAnswer={absurdPhrasesGame.submitAnswer}
          onNextRound={handleNextRound}
          onFinish={() => {
            absurdPhrasesGame.finishGame();
            handleFinish();
          }}
        />
      )}

      {/* Gira y... */}
      {screen === 'game' && gameType === 'spinwheel' && (
        <SpinWheelGame
          level={spinWheelGame.level}
          setLevel={spinWheelGame.setLevel}
          currentSpin={spinWheelGame.currentSpin}
          isSpinning={spinWheelGame.isSpinning}
          spinCount={spinWheelGame.spinCount}
          isMyTurn={spinWheelGame.isMyTurn}
          onSpin={spinWheelGame.spin}
          onFinish={() => {
            spinWheelGame.finishGame();
            handleFinish();
          }}
        />
      )}
      </Suspense>

      {screen === 'end' && (
        <End
          onPlayAgain={handlePlayAgain}
          onExit={handleGoHome}
        />
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

      {/* Notificación flotante */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg border border-gray-100">
            <p className="text-[var(--color-text)] text-sm font-medium">
              {notification}
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
