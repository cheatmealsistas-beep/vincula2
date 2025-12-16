import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  rollHalfPlan,
  decodeHalfPlan,
  encodeHalfPlan,
  combineHalfPlans,
  type HalfPlanResult,
  type FullPlanResult,
  PLAYER1_CATEGORIES,
  PLAYER2_CATEGORIES,
} from '../data/randomplan';

interface UseRandomPlanReturn {
  myHalfPlan: HalfPlanResult | null;
  partnerHalfPlan: HalfPlanResult | null;
  fullPlan: FullPlanResult | null;
  hasRolled: boolean;
  partnerHasRolled: boolean;
  bothRevealed: boolean;
  myCategories: readonly string[];
  loading: boolean;
  startGame: () => Promise<void>;
  rollDice: () => Promise<void>;
  reroll: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useRandomPlan(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseRandomPlanReturn {
  const [myHalfPlan, setMyHalfPlan] = useState<HalfPlanResult | null>(null);
  const [partnerHalfPlan, setPartnerHalfPlan] = useState<HalfPlanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const hasRolled = !!myHalfPlan;
  const partnerHasRolled = !!partnerHalfPlan;
  const bothRevealed = hasRolled && partnerHasRolled;

  // Qué categorías le tocan a cada jugador
  const myCategories = myPlayerNumber === 1 ? PLAYER1_CATEGORIES : PLAYER2_CATEGORIES;

  // Plan completo cuando ambos han tirado
  const fullPlan = bothRevealed && myHalfPlan && partnerHalfPlan
    ? myPlayerNumber === 1
      ? combineHalfPlans(myHalfPlan, partnerHalfPlan)
      : combineHalfPlans(partnerHalfPlan, myHalfPlan)
    : null;

  const startGame = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);

    await supabase.from('game_responses').delete().eq('room_id', roomId);

    setMyHalfPlan(null);
    setPartnerHalfPlan(null);
    setLoading(false);
  }, [roomId]);

  const rollDice = useCallback(async () => {
    if (!roomId || !myPlayerNumber || hasRolled) return;

    const halfPlan = rollHalfPlan(myPlayerNumber);
    const encoded = encodeHalfPlan(halfPlan);

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: 1,
      card_id: 'randomplan',
      response: encoded,
    });

    setMyHalfPlan(halfPlan);
  }, [roomId, myPlayerNumber, hasRolled]);

  const reroll = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    // Borrar mi respuesta anterior
    await supabase
      .from('game_responses')
      .delete()
      .eq('room_id', roomId)
      .eq('player_number', myPlayerNumber);

    // Tirar de nuevo
    const halfPlan = rollHalfPlan(myPlayerNumber);
    const encoded = encodeHalfPlan(halfPlan);

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: 1,
      card_id: 'randomplan',
      response: encoded,
    });

    setMyHalfPlan(halfPlan);
  }, [roomId, myPlayerNumber]);

  const resetGame = useCallback(async () => {
    if (!roomId) return;
    await supabase.from('game_responses').delete().eq('room_id', roomId);
    setMyHalfPlan(null);
    setPartnerHalfPlan(null);
  }, [roomId]);

  // Cargar respuestas existentes
  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    const loadResponses = async () => {
      const { data } = await supabase
        .from('game_responses')
        .select()
        .eq('room_id', roomId)
        .eq('round', 1);

      if (data) {
        data.forEach(r => {
          const halfPlan = decodeHalfPlan(r.response);
          if (halfPlan) {
            if (r.player_number === myPlayerNumber) {
              setMyHalfPlan(halfPlan);
            } else {
              setPartnerHalfPlan(halfPlan);
            }
          }
        });
      }
    };

    loadResponses();
  }, [roomId, myPlayerNumber]);

  // Suscripción a respuestas
  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    const channel = supabase
      .channel(`randomplan:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        const response = payload.new as { player_number: number; response: string };
        if (response) {
          const halfPlan = decodeHalfPlan(response.response);
          if (halfPlan) {
            if (response.player_number === myPlayerNumber) {
              setMyHalfPlan(halfPlan);
            } else {
              setPartnerHalfPlan(halfPlan);
            }
          }
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        // Si alguien borra, actualizamos
        const deleted = payload.old as { player_number?: number };
        if (deleted?.player_number && deleted.player_number !== myPlayerNumber) {
          setPartnerHalfPlan(null);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, myPlayerNumber]);

  return {
    myHalfPlan,
    partnerHalfPlan,
    fullPlan,
    hasRolled,
    partnerHasRolled,
    bothRevealed,
    myCategories,
    loading,
    startGame,
    rollDice,
    reroll,
    resetGame,
  };
}
