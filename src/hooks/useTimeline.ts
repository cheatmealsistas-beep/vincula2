import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getRandomTimelinePrompts, TIMELINE_PROMPTS, type TimelinePrompt } from '../data/timeline';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseTimelineReturn {
  prompts: TimelinePrompt[];
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

export function useTimeline(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseTimelineReturn {
  const [prompts, setPrompts] = useState<TimelinePrompt[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const stateRef = useRef({ prompts, currentRound, responses });

  useEffect(() => {
    stateRef.current = { prompts, currentRound, responses };
  }, [prompts, currentRound, responses]);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myAnswer = responses[currentKey] || null;
  const partnerAnswer = responses[partnerKey] || null;
  const bothRevealed = !!myAnswer && !!partnerAnswer;

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
        if (message.payload.promptIds) {
          const saved = message.payload.promptIds
            .map((id: string) => TIMELINE_PROMPTS.find(p => p.id === id))
            .filter(Boolean) as TimelinePrompt[];
          setPrompts(saved);
        }
        setCurrentRound(message.payload.gameRound || 1);
        setResponses(message.payload.responses || {});
        setGameFinished(false);
        setLoading(false);
        break;

      case 'response':
        setResponses(prev => ({ ...prev, [message.payload.key]: message.payload.data }));
        break;

      case 'next_round':
        setCurrentRound(message.payload.round);
        break;

      case 'request_state':
        if (myPlayerNumber === 1 && stateRef.current.prompts.length > 0) {
          send({
            type: 'game_state',
            payload: {
              promptIds: stateRef.current.prompts.map(p => p.id),
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

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`timeline:${roomId}`, {
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
      const newPrompts = getRandomTimelinePrompts(5);
      setPrompts(newPrompts);
      setCurrentRound(1);
      setResponses({});
      setGameFinished(false);

      setTimeout(() => {
        send({
          type: 'game_state',
          payload: { promptIds: newPrompts.map(p => p.id), gameRound: 1, responses: {} },
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

  const submitAnswer = useCallback((answer: string) => {
    if (!myPlayerNumber || prompts.length === 0) return;
    setResponses(prev => ({ ...prev, [currentKey]: answer }));
    send({ type: 'response', payload: { key: currentKey, data: answer }, from: myPlayerNumber });
  }, [myPlayerNumber, prompts.length, currentKey, send]);

  const nextRound = useCallback(() => {
    if (!myPlayerNumber) return;
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    send({ type: 'next_round', payload: { round: newRound }, from: myPlayerNumber });
  }, [myPlayerNumber, currentRound, send]);

  const resetGame = useCallback(() => {
    setPrompts([]);
    setCurrentRound(1);
    setResponses({});
    setGameFinished(false);
  }, []);

  const finishGame = useCallback(() => {
    if (!myPlayerNumber) return;
    setGameFinished(true);
    send({ type: 'game_finished', payload: { finished: true }, from: myPlayerNumber });
  }, [myPlayerNumber, send]);

  return {
    prompts,
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
