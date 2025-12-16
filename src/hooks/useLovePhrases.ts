import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameResponse } from '../lib/supabase';
import { getRandomLovePhrases, LOVE_PHRASES, type LovePhrase } from '../data/lovephrases';

interface UseLovePhrasesReturn {
  phrases: LovePhrase[];
  currentRound: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  loading: boolean;
  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  nextRound: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useLovePhrases(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseLovePhrasesReturn {
  const [phrases, setPhrases] = useState<LovePhrase[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Map<string, GameResponse>>(new Map());
  const [loading, setLoading] = useState(false);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myResponseData = responses.get(currentKey);
  const partnerResponseData = responses.get(partnerKey);

  const myAnswer = myResponseData?.response || null;
  const partnerAnswer = partnerResponseData?.response || null;
  const bothRevealed = !!myAnswer && !!partnerAnswer;

  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards, game_round')
      .eq('id', roomId)
      .single();

    if (room?.game_cards && room.game_cards.length > 0) {
      const saved = room.game_cards
        .map((id: string) => LOVE_PHRASES.find(p => p.id === id))
        .filter(Boolean) as LovePhrase[];
      setPhrases(saved);
      setCurrentRound(room.game_round || 1);
    } else if (myPlayerNumber === 1) {
      const newPhrases = getRandomLovePhrases(5);
      const ids = newPhrases.map(p => p.id);
      await supabase.from('rooms').update({ game_cards: ids, game_round: 1 }).eq('id', roomId);
      await supabase.from('game_responses').delete().eq('room_id', roomId);
      setPhrases(newPhrases);
      setCurrentRound(1);
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: roomRetry } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (roomRetry?.game_cards && roomRetry.game_cards.length > 0) {
        const saved = roomRetry.game_cards
          .map((id: string) => LOVE_PHRASES.find(p => p.id === id))
          .filter(Boolean) as LovePhrase[];
        setPhrases(saved);
        setCurrentRound(roomRetry.game_round || 1);
      }
    }

    setResponses(new Map());
    setLoading(false);
  }, [roomId, myPlayerNumber]);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!roomId || !myPlayerNumber || phrases.length === 0) return;
    const currentPhrase = phrases[currentRound - 1];

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: currentRound,
      card_id: currentPhrase.id,
      response: answer,
    });
  }, [roomId, myPlayerNumber, currentRound, phrases]);

  const nextRound = useCallback(async () => {
    if (!roomId) return;
    const newRound = currentRound + 1;
    await supabase.from('rooms').update({ game_round: newRound }).eq('id', roomId);
    setCurrentRound(newRound);
  }, [roomId, currentRound]);

  const resetGame = useCallback(async () => {
    if (!roomId) return;
    await supabase.from('rooms').update({ game_cards: null, game_round: 1 }).eq('id', roomId);
    setPhrases([]);
    setCurrentRound(1);
    setResponses(new Map());
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const load = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (room && room.game_cards && room.game_cards.length > 0) {
        const saved = room.game_cards
          .map((id: string) => LOVE_PHRASES.find(p => p.id === id))
          .filter(Boolean) as LovePhrase[];
        setPhrases(saved);
      }
      if (room?.game_round) {
        setCurrentRound(room.game_round);
      }
    };
    load();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`lovephrases-room-sync:${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        const room = payload.new as { game_round?: number; game_cards?: string[] };
        if (room.game_round && room.game_round !== currentRound) {
          setCurrentRound(room.game_round);
        }
        if (room.game_cards && room.game_cards.length > 0 && phrases.length === 0) {
          const saved = room.game_cards
            .map((id: string) => LOVE_PHRASES.find(p => p.id === id))
            .filter(Boolean) as LovePhrase[];
          setPhrases(saved);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, currentRound, phrases.length]);

  useEffect(() => {
    if (!roomId) return;

    const loadResponses = async () => {
      const { data } = await supabase.from('game_responses').select().eq('room_id', roomId);
      if (data) {
        const newResponses = new Map<string, GameResponse>();
        data.forEach(r => newResponses.set(`${r.round}-${r.player_number}`, r));
        setResponses(newResponses);
      }
    };
    loadResponses();

    const channel = supabase
      .channel(`lovephrases:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        const response = payload.new as GameResponse;
        if (response) {
          setResponses(prev => {
            const newMap = new Map(prev);
            newMap.set(`${response.round}-${response.player_number}`, response);
            return newMap;
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  return {
    phrases,
    currentRound,
    myAnswer,
    partnerAnswer,
    bothRevealed,
    loading,
    startGame,
    submitAnswer,
    nextRound,
    resetGame,
  };
}
