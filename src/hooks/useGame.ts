import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameResponse } from '../lib/supabase';
import { getBalancedCards, CARDS } from '../data/cards';
import type { Card } from '../types';

interface UseGameReturn {
  cards: Card[];
  currentRound: number;
  myResponse: string | null;
  partnerResponse: string | null;
  myGesture: string | null;
  partnerGesture: string | null;
  bothRevealed: boolean;
  loading: boolean;
  startGame: () => Promise<void>;
  submitResponse: (response: string) => Promise<void>;
  sendGesture: (gesture: string) => Promise<void>;
  nextRound: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useGame(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseGameReturn {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Map<string, GameResponse>>(new Map());
  const [loading, setLoading] = useState(false);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myResponseData = responses.get(currentKey);
  const partnerResponseData = responses.get(partnerKey);

  const myResponse = myResponseData?.response || null;
  const partnerResponse = partnerResponseData?.response || null;
  const myGesture = myResponseData?.gesture || null;
  const partnerGesture = partnerResponseData?.gesture || null;
  const bothRevealed = !!myResponse && !!partnerResponse;

  // Iniciar juego - SOLO Player 1 genera cartas para evitar race condition
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    setLoading(true);

    // Verificar si ya hay cartas guardadas
    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards, game_round')
      .eq('id', roomId)
      .single();

    if (room?.game_cards && room.game_cards.length > 0) {
      // Ya hay cartas, usarlas
      const savedCards = room.game_cards
        .map((id: string) => CARDS.find((c) => c.id === id))
        .filter(Boolean) as Card[];
      setCards(savedCards);
      setCurrentRound(room.game_round || 1);
    } else if (myPlayerNumber === 1) {
      // SOLO Player 1 genera nuevas cartas
      const newCards = getBalancedCards();
      const cardIds = newCards.map((c) => c.id);

      await supabase
        .from('rooms')
        .update({ game_cards: cardIds, game_round: 1 })
        .eq('id', roomId);

      // Limpiar respuestas anteriores
      await supabase.from('game_responses').delete().eq('room_id', roomId);

      setCards(newCards);
      setCurrentRound(1);
    } else {
      // Player 2 espera a que Player 1 genere las cartas
      // Esperamos un poco y reintentamos
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: roomRetry } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (roomRetry?.game_cards && roomRetry.game_cards.length > 0) {
        const savedCards = roomRetry.game_cards
          .map((id: string) => CARDS.find((c) => c.id === id))
          .filter(Boolean) as Card[];
        setCards(savedCards);
        setCurrentRound(roomRetry.game_round || 1);
      }
    }

    setResponses(new Map());
    setLoading(false);
  }, [roomId, myPlayerNumber]);

  // Enviar respuesta
  const submitResponse = useCallback(
    async (response: string) => {
      if (!roomId || !myPlayerNumber || cards.length === 0) return;

      const currentCard = cards[currentRound - 1];

      await supabase.from('game_responses').insert({
        room_id: roomId,
        player_number: myPlayerNumber,
        round: currentRound,
        card_id: currentCard.id,
        response,
      });
    },
    [roomId, myPlayerNumber, currentRound, cards]
  );

  // Enviar gesto
  const sendGesture = useCallback(
    async (gesture: string) => {
      if (!roomId || !myPlayerNumber) return;

      await supabase
        .from('game_responses')
        .update({ gesture })
        .eq('room_id', roomId)
        .eq('player_number', myPlayerNumber)
        .eq('round', currentRound);
    },
    [roomId, myPlayerNumber, currentRound]
  );

  // Siguiente ronda - SINCRONIZADA en base de datos
  const nextRound = useCallback(async () => {
    if (!roomId) return;

    const newRound = currentRound + 1;

    // Actualizar en la base de datos para sincronizar
    await supabase
      .from('rooms')
      .update({ game_round: newRound })
      .eq('id', roomId);

    setCurrentRound(newRound);
  }, [roomId, currentRound]);

  // Resetear juego
  const resetGame = useCallback(async () => {
    if (!roomId) return;

    // Limpiar cartas guardadas para generar nuevas
    await supabase
      .from('rooms')
      .update({ game_cards: null, game_round: 1 })
      .eq('id', roomId);

    setCards([]);
    setCurrentRound(1);
    setResponses(new Map());
  }, [roomId]);

  // Cargar cartas y ronda al entrar si ya existen
  useEffect(() => {
    if (!roomId) return;

    const loadCards = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (room?.game_cards && room.game_cards.length > 0) {
        const savedCards = room.game_cards
          .map((id: string) => CARDS.find((c) => c.id === id))
          .filter(Boolean) as Card[];
        setCards(savedCards);
      }
      if (room?.game_round) {
        setCurrentRound(room.game_round);
      }
    };

    loadCards();
  }, [roomId]);

  // Suscripción a cambios en la sala (para sincronizar ronda)
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-sync:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const room = payload.new as { game_round?: number; game_cards?: string[] };

          // Sincronizar ronda
          if (room.game_round && room.game_round !== currentRound) {
            setCurrentRound(room.game_round);
          }

          // Sincronizar cartas si las generó el otro jugador
          if (room.game_cards && room.game_cards.length > 0 && cards.length === 0) {
            const savedCards = room.game_cards
              .map((id: string) => CARDS.find((c) => c.id === id))
              .filter(Boolean) as Card[];
            setCards(savedCards);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, currentRound, cards.length]);

  // Suscripción a respuestas en tiempo real
  useEffect(() => {
    if (!roomId) return;

    // Cargar respuestas existentes
    const loadResponses = async () => {
      const { data } = await supabase
        .from('game_responses')
        .select()
        .eq('room_id', roomId);

      if (data) {
        const newResponses = new Map<string, GameResponse>();
        data.forEach((r) => {
          newResponses.set(`${r.round}-${r.player_number}`, r);
        });
        setResponses(newResponses);
      }
    };

    loadResponses();

    // Suscripción a nuevas respuestas
    const channelName = `game:${roomId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_responses',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const response = payload.new as GameResponse;
          if (response) {
            setResponses((prev) => {
              const newMap = new Map(prev);
              newMap.set(`${response.round}-${response.player_number}`, response);
              return newMap;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_responses',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const response = payload.new as GameResponse;
          if (response) {
            setResponses((prev) => {
              const newMap = new Map(prev);
              newMap.set(`${response.round}-${response.player_number}`, response);
              return newMap;
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Cards game subscription active');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return {
    cards,
    currentRound,
    myResponse,
    partnerResponse,
    myGesture,
    partnerGesture,
    bothRevealed,
    loading,
    startGame,
    submitResponse,
    sendGesture,
    nextRound,
    resetGame,
  };
}
