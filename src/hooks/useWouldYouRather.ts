import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  getRandomWouldYouRatherCards,
  WOULD_YOU_RATHER_CARDS,
  type WouldYouRatherCard,
} from '../data/wouldyourather';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseWouldYouRatherReturn {
  cards: WouldYouRatherCard[];
  currentRound: number;
  myChoice: 'A' | 'B' | null;
  partnerChoice: 'A' | 'B' | null;
  bothRevealed: boolean;
  loading: boolean;
  gameFinished: boolean;
  startGame: () => Promise<void>;
  submitChoice: (choice: 'A' | 'B') => void;
  nextRound: () => void;
  resetGame: () => void;
  finishGame: () => void;
}

export function useWouldYouRather(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseWouldYouRatherReturn {
  const [cards, setCards] = useState<WouldYouRatherCard[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Record<string, 'A' | 'B'>>({});
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);
  const stateRef = useRef({ cards, currentRound, responses });

  useEffect(() => {
    stateRef.current = { cards, currentRound, responses };
  }, [cards, currentRound, responses]);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myChoice = responses[currentKey] || null;
  const partnerChoice = responses[partnerKey] || null;
  const bothRevealed = !!myChoice && !!partnerChoice;

  const send = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (!channelRef.current || !myPlayerNumber) return;

    const fullMessage: SyncMessage = {
      ...message,
      timestamp: Date.now(),
    };

    console.log('[WouldYouRather] Enviando:', message.type);

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullMessage,
    });
  }, [myPlayerNumber]);

  const handleMessage = useCallback((message: SyncMessage) => {
    console.log('[WouldYouRather] Recibido:', message.type);

    switch (message.type) {
      case 'game_state':
        if (message.payload.cardIds) {
          const saved = message.payload.cardIds
            .map((id: string) => WOULD_YOU_RATHER_CARDS.find(c => c.id === id))
            .filter(Boolean) as WouldYouRatherCard[];
          setCards(saved);
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
        if (myPlayerNumber === 1 && stateRef.current.cards.length > 0) {
          send({
            type: 'game_state',
            payload: {
              cardIds: stateRef.current.cards.map(c => c.id),
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

  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    console.log(`[WouldYouRather] Conectando a wyr:${roomId} como jugador ${myPlayerNumber}`);

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`wyr:${roomId}`, {
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
          console.log('[WouldYouRather] Conectado exitosamente');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[WouldYouRather] Error de conexion');
        }
      });

    channelRef.current = channel;
    subscribedRef.current = false;

    return () => {
      console.log('[WouldYouRather] Desconectando');
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

  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    await waitForSubscription();

    if (myPlayerNumber === 1) {
      const newCards = getRandomWouldYouRatherCards(5);
      setCards(newCards);
      setCurrentRound(1);
      setResponses({});
      setGameFinished(false);

      setTimeout(() => {
        send({
          type: 'game_state',
          payload: {
            cardIds: newCards.map(c => c.id),
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

  const submitChoice = useCallback((choice: 'A' | 'B') => {
    if (!myPlayerNumber || cards.length === 0) return;

    const key = currentKey;
    setResponses(prev => ({ ...prev, [key]: choice }));

    send({
      type: 'response',
      payload: { key, data: choice },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, cards.length, currentKey, send]);

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

  const resetGame = useCallback(() => {
    setCards([]);
    setCurrentRound(1);
    setResponses({});
    setGameFinished(false);
  }, []);

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
    cards,
    currentRound,
    myChoice,
    partnerChoice,
    bothRevealed,
    loading,
    gameFinished,
    startGame,
    submitChoice,
    nextRound,
    resetGame,
    finishGame,
  };
}
