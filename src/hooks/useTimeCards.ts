import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { GameResponse } from '../lib/supabase';
import { getRandomTimeCards, TIME_CARDS, type TimeCard } from '../data/timecards';

interface UseTimeCardsReturn {
  cards: TimeCard[];
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

export function useTimeCards(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseTimeCardsReturn {
  const [cards, setCards] = useState<TimeCard[]>([]);
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

  // Iniciar juego - SOLO Player 1 genera
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards, game_round')
      .eq('id', roomId)
      .single();

    if (room?.game_cards && Array.isArray(room.game_cards) && room.game_cards.length > 0) {
      // Verificar si es el formato antiguo (objeto) o nuevo (array de IDs)
      const firstItem = room.game_cards[0];
      if (typeof firstItem === 'string') {
        // Formato nuevo: array de IDs
        const saved = room.game_cards
          .map((id: string) => TIME_CARDS.find(c => c.id === id))
          .filter(Boolean) as TimeCard[];
        setCards(saved);
      } else {
        // Formato antiguo: objeto con cards
        const gameState = room.game_cards as unknown as { cards?: TimeCard[] };
        if (gameState.cards) {
          setCards(gameState.cards);
        }
      }
      setCurrentRound(room.game_round || 1);
    } else if (myPlayerNumber === 1) {
      // SOLO Player 1 genera
      const newCards = getRandomTimeCards(6);
      const ids = newCards.map(c => c.id);
      await supabase.from('rooms').update({ game_cards: ids, game_round: 1 }).eq('id', roomId);
      await supabase.from('game_responses').delete().eq('room_id', roomId);
      setCards(newCards);
      setCurrentRound(1);
    } else {
      // Jugador 2: esperar a que el jugador 1 cree los datos (polling con reintentos)
      let retries = 0;
      const maxRetries = 10;
      while (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: roomRetry } = await supabase
          .from('rooms')
          .select('game_cards, game_round')
          .eq('id', roomId)
          .single();

        if (roomRetry?.game_cards && Array.isArray(roomRetry.game_cards) && roomRetry.game_cards.length > 0) {
          const firstItem = roomRetry.game_cards[0];
          if (typeof firstItem === 'string') {
            const saved = roomRetry.game_cards
              .map((id: string) => TIME_CARDS.find(c => c.id === id))
              .filter(Boolean) as TimeCard[];
            setCards(saved);
          }
          setCurrentRound(roomRetry.game_round || 1);
          break;
        }
        retries++;
      }
    }

    setResponses(new Map());
    setLoading(false);
  }, [roomId, myPlayerNumber]);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!roomId || !myPlayerNumber || cards.length === 0) return;
    const currentCard = cards[currentRound - 1];

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: currentRound,
      card_id: currentCard?.id || '',
      response: answer,
    });
  }, [roomId, myPlayerNumber, currentRound, cards]);

  // Siguiente ronda - SINCRONIZADA
  const nextRound = useCallback(async () => {
    if (!roomId) return;
    const newRound = currentRound + 1;
    await supabase.from('rooms').update({ game_round: newRound }).eq('id', roomId);
    setCurrentRound(newRound);
  }, [roomId, currentRound]);

  const resetGame = useCallback(async () => {
    if (!roomId) return;
    await supabase.from('rooms').update({ game_cards: null, game_round: 1 }).eq('id', roomId);
    await supabase.from('game_responses').delete().eq('room_id', roomId);
    setCards([]);
    setCurrentRound(1);
    setResponses(new Map());
  }, [roomId]);

  // Ref para rastrear si ya tenemos cards (evita problemas de closure)
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  // Cargar al entrar + polling continuo como fallback
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    const load = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (!isMounted) return;

      if (room && room.game_cards && Array.isArray(room.game_cards) && room.game_cards.length > 0) {
        const firstItem = room.game_cards[0];
        if (typeof firstItem === 'string') {
          const saved = room.game_cards
            .map((id: string) => TIME_CARDS.find(c => c.id === id))
            .filter(Boolean) as TimeCard[];
          setCards(saved);
        }
      }
      if (room?.game_round) {
        setCurrentRound(room.game_round);
      }
    };

    load();

    const pollInterval = setInterval(() => {
      if (cardsRef.current.length === 0) {
        load();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [roomId]);

  // Suscripción a cambios en la sala
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`timecards-room-sync:${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      }, (payload: any) => {
        const room = payload.new as { game_round?: number; game_cards?: string[] };
        if (room.game_round && room.game_round !== currentRound) {
          setCurrentRound(room.game_round);
        }
        if (room.game_cards && Array.isArray(room.game_cards) && room.game_cards.length > 0 && cards.length === 0) {
          const firstItem = room.game_cards[0];
          if (typeof firstItem === 'string') {
            const saved = room.game_cards
              .map((id: string) => TIME_CARDS.find(c => c.id === id))
              .filter(Boolean) as TimeCard[];
            setCards(saved);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, currentRound, cards.length]);

  // Suscripción a respuestas
  useEffect(() => {
    if (!roomId) return;

    const loadResponses = async () => {
      const { data } = await supabase.from('game_responses').select().eq('room_id', roomId);
      if (data) {
        const newResponses = new Map<string, GameResponse>();
        data.forEach((r: any) => newResponses.set(`${r.round}-${r.player_number}`, r));
        setResponses(newResponses);
      }
    };
    loadResponses();

    const channel = supabase
      .channel(`timecards:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload: any) => {
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
    cards,
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
