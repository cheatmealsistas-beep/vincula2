import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getRandomPhrases, ABSURD_PHRASES, type AbsurdPhrase } from '../data/absurdphrases';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseAbsurdPhrasesReturn {
  phrases: AbsurdPhrase[];
  currentRound: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  loading: boolean;
  gameFinished: boolean;
  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextRound: () => void;
  resetGame: () => void;
  finishGame: () => void;
}

export function useAbsurdPhrases(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseAbsurdPhrasesReturn {
  const [phrases, setPhrases] = useState<AbsurdPhrase[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);
  const stateRef = useRef({ phrases, currentRound, responses });

  // Mantener refs actualizados
  useEffect(() => {
    stateRef.current = { phrases, currentRound, responses };
  }, [phrases, currentRound, responses]);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myAnswer = responses[currentKey] || null;
  const partnerAnswer = responses[partnerKey] || null;
  const bothRevealed = !!myAnswer && !!partnerAnswer;

  // Enviar mensaje al canal
  const send = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (!channelRef.current || !myPlayerNumber) return;

    const fullMessage: SyncMessage = {
      ...message,
      timestamp: Date.now(),
    };

    console.log('[AbsurdPhrases] Enviando:', message.type);

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullMessage,
    });
  }, [myPlayerNumber]);

  // Manejar mensajes recibidos
  const handleMessage = useCallback((message: SyncMessage) => {
    console.log('[AbsurdPhrases] Recibido:', message.type);

    switch (message.type) {
      case 'game_state':
        if (message.payload.phraseIds) {
          const saved = message.payload.phraseIds
            .map((id: number) => ABSURD_PHRASES.find(p => p.id === id))
            .filter(Boolean) as AbsurdPhrase[];
          setPhrases(saved);
        }
        setCurrentRound(message.payload.gameRound || 1);
        setResponses(message.payload.responses || {});
        setGameFinished(false);
        setLoading(false);
        break;

      case 'response':
        const { key, data } = message.payload;
        setResponses(prev => ({ ...prev, [key]: data }));
        break;

      case 'next_round':
        setCurrentRound(message.payload.round);
        break;

      case 'request_state':
        if (myPlayerNumber === 1 && stateRef.current.phrases.length > 0) {
          send({
            type: 'game_state',
            payload: {
              phraseIds: stateRef.current.phrases.map(p => p.id),
              gameRound: stateRef.current.currentRound,
              responses: stateRef.current.responses,
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

  // Conectar al canal de Broadcast
  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    console.log(`[AbsurdPhrases] Conectando a absurdphrases:${roomId} como jugador ${myPlayerNumber}`);

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`absurdphrases:${roomId}`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        handleMessage(payload as SyncMessage);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          subscribedRef.current = true;
          console.log('[AbsurdPhrases] Conectado exitosamente');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[AbsurdPhrases] Error de conexion');
        }
      });

    channelRef.current = channel;
    subscribedRef.current = false;

    return () => {
      console.log('[AbsurdPhrases] Desconectando');
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId, myPlayerNumber, handleMessage]);

  const waitForSubscription = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (subscribedRef.current) return resolve();
      const interval = setInterval(() => {
        if (subscribedRef.current) { clearInterval(interval); resolve(); }
      }, 100);
      setTimeout(() => { clearInterval(interval); resolve(); }, 5000);
    });
  }, []);

  // Iniciar juego
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    await waitForSubscription();

    if (myPlayerNumber === 1) {
      const newPhrases = getRandomPhrases(5);
      setPhrases(newPhrases);
      setCurrentRound(1);
      setResponses({});
      setGameFinished(false);

      setTimeout(() => {
        send({
          type: 'game_state',
          payload: {
            phraseIds: newPhrases.map(p => p.id),
            gameRound: 1,
            responses: {},
          },
          from: 1,
        });
        setLoading(false);
      }, 300);
    } else {
      setGameFinished(false);

      setTimeout(() => {
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'sync',
            payload: {
              type: 'request_state',
              payload: null,
              from: 2,
              timestamp: Date.now(),
            },
          });
        }
      }, 500);

      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [roomId, myPlayerNumber, send, waitForSubscription]);

  // Enviar respuesta
  const submitAnswer = useCallback((answer: string) => {
    if (!myPlayerNumber || phrases.length === 0) return;

    const key = currentKey;
    setResponses(prev => ({ ...prev, [key]: answer }));

    send({
      type: 'response',
      payload: { key, data: answer },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, phrases.length, currentKey, send]);

  // Siguiente ronda
  const nextRound = useCallback(() => {
    if (!myPlayerNumber) return;

    const newRound = currentRound + 1;
    setCurrentRound(newRound);

    send({
      type: 'next_round',
      payload: { round: newRound },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, currentRound, send]);

  // Resetear juego
  const resetGame = useCallback(() => {
    setPhrases([]);
    setCurrentRound(1);
    setResponses({});
    setGameFinished(false);
  }, []);

  // Terminar juego
  const finishGame = useCallback(() => {
    if (!myPlayerNumber) return;

    setGameFinished(true);

    send({
      type: 'game_finished',
      payload: { finished: true },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, send]);

  return {
    phrases,
    currentRound,
    myAnswer,
    partnerAnswer,
    bothRevealed,
    loading,
    gameFinished,
    startGame,
    submitAnswer,
    nextRound,
    resetGame,
    finishGame,
  };
}
