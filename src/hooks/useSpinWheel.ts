import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { IntensityLevel, SpinOption } from '../data/spinwheel';
import { getRandomSpin } from '../data/spinwheel';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SpinResult {
  action: SpinOption;
  zone: SpinOption;
  how: SpinOption;
}

interface SyncMessage {
  type: 'game_state' | 'spin_result' | 'level_change' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseSpinWheelReturn {
  level: IntensityLevel;
  setLevel: (level: IntensityLevel) => void;
  currentSpin: SpinResult | null;
  isSpinning: boolean;
  spinCount: number;
  isMyTurn: boolean;
  spin: () => void;
  reset: () => void;
  startGame: () => Promise<void>;
  loading: boolean;
  gameFinished: boolean;
  finishGame: () => void;
}

export function useSpinWheel(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseSpinWheelReturn {
  const [level, setLevelState] = useState<IntensityLevel>('soft');
  const [currentSpin, setCurrentSpin] = useState<SpinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const stateRef = useRef({ level, currentSpin, spinCount, currentTurn, gameStarted });

  const isMyTurn = currentTurn === myPlayerNumber;

  useEffect(() => {
    stateRef.current = { level, currentSpin, spinCount, currentTurn, gameStarted };
  }, [level, currentSpin, spinCount, currentTurn, gameStarted]);

  const send = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (!channelRef.current || !myPlayerNumber) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: { ...message, timestamp: Date.now() },
    });
  }, [myPlayerNumber]);

  const handleMessage = useCallback((message: SyncMessage) => {
    switch (message.type) {
      case 'game_state':
        setLevelState(message.payload.level || 'soft');
        setCurrentSpin(message.payload.currentSpin || null);
        setSpinCount(message.payload.spinCount || 0);
        setCurrentTurn(message.payload.currentTurn || 1);
        setGameStarted(true);
        setGameFinished(false);
        setLoading(false);
        break;

      case 'spin_result':
        setCurrentSpin(message.payload.spin);
        setSpinCount(message.payload.spinCount);
        setCurrentTurn(message.payload.nextTurn);
        setIsSpinning(false);
        break;

      case 'level_change':
        setLevelState(message.payload.level);
        break;

      case 'request_state':
        if (myPlayerNumber === 1 && stateRef.current.gameStarted) {
          send({
            type: 'game_state',
            payload: {
              level: stateRef.current.level,
              currentSpin: stateRef.current.currentSpin,
              spinCount: stateRef.current.spinCount,
              currentTurn: stateRef.current.currentTurn,
            },
            from: 1,
          });
        }
        break;

      case 'game_finished':
        setGameFinished(true);
        break;
    }
  }, [myPlayerNumber, send]);

  // Conectar al canal
  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`spinwheel:${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        handleMessage(payload as SyncMessage);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId, myPlayerNumber, handleMessage]);

  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    if (myPlayerNumber === 1) {
      setGameStarted(true);
      setCurrentTurn(1);
      setSpinCount(0);
      setCurrentSpin(null);
      setGameFinished(false);

      setTimeout(() => {
        send({
          type: 'game_state',
          payload: {
            level: stateRef.current.level,
            currentSpin: null,
            spinCount: 0,
            currentTurn: 1,
          },
          from: 1,
        });
        setLoading(false);
      }, 300);
    } else {
      setGameFinished(false);
      setTimeout(() => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'sync',
          payload: { type: 'request_state', payload: null, from: 2, timestamp: Date.now() },
        });
      }, 500);
      setTimeout(() => setLoading(false), 5000);
    }
  }, [roomId, myPlayerNumber, send]);

  const setLevel = useCallback((newLevel: IntensityLevel) => {
    if (!myPlayerNumber) return;
    setLevelState(newLevel);
    send({
      type: 'level_change',
      payload: { level: newLevel },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, send]);

  const spin = useCallback(() => {
    if (!myPlayerNumber || !isMyTurn) return;

    setIsSpinning(true);
    setCurrentSpin(null);

    // Simular animación de ruleta
    setTimeout(() => {
      const result = getRandomSpin(level);
      const newSpinCount = spinCount + 1;
      const nextTurn: 1 | 2 = currentTurn === 1 ? 2 : 1;

      setCurrentSpin(result);
      setSpinCount(newSpinCount);
      setCurrentTurn(nextTurn);
      setIsSpinning(false);

      // Enviar resultado al otro
      send({
        type: 'spin_result',
        payload: {
          spin: result,
          spinCount: newSpinCount,
          nextTurn,
        },
        from: myPlayerNumber,
      });
    }, 2000);
  }, [level, myPlayerNumber, isMyTurn, spinCount, currentTurn, send]);

  const reset = useCallback(() => {
    setCurrentSpin(null);
    setSpinCount(0);
    setLevelState('soft');
    setCurrentTurn(1);
    setGameStarted(false);
  }, []);

  const finishGame = useCallback(() => {
    if (!myPlayerNumber) return;
    setGameFinished(true);
    send({ type: 'game_finished', payload: { finished: true }, from: myPlayerNumber });
  }, [myPlayerNumber, send]);

  return {
    level,
    setLevel,
    currentSpin,
    isSpinning,
    spinCount,
    isMyTurn,
    spin,
    reset,
    startGame,
    loading,
    gameFinished,
    finishGame,
  };
}
