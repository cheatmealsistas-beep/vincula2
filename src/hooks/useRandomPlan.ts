import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  rollHalfPlan,
  rerollSingleOption,
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
  myLocked: boolean;
  partnerLocked: boolean;
  canReroll: boolean;
  startGame: () => Promise<void>;
  rollDice: () => Promise<void>;
  reroll: () => Promise<void>;
  rerollOption: (optionNumber: 1 | 2) => Promise<void>;
  lockPlan: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useRandomPlan(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseRandomPlanReturn {
  const [myHalfPlan, setMyHalfPlan] = useState<HalfPlanResult | null>(null);
  const [partnerHalfPlan, setPartnerHalfPlan] = useState<HalfPlanResult | null>(null);
  const [myLocked, setMyLocked] = useState(false);
  const [partnerLocked, setPartnerLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasRolled = !!myHalfPlan;
  const partnerHasRolled = !!partnerHalfPlan;
  // Solo se revela el plan completo cuando AMBOS han bloqueado su parte
  const bothRevealed = hasRolled && partnerHasRolled && myLocked && partnerLocked;

  // Solo puedo volver a tirar si YO no he bloqueado (el otro puede seguir tirando)
  const canReroll = hasRolled && !myLocked;

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
    setMyLocked(false);
    setPartnerLocked(false);
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
    if (!roomId || !myPlayerNumber || myLocked) return;

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
  }, [roomId, myPlayerNumber, myLocked]);

  // Reroll solo una categoría (1 o 2)
  const rerollOption = useCallback(async (optionNumber: 1 | 2) => {
    if (!roomId || !myPlayerNumber || myLocked || !myHalfPlan) return;

    const newPlan = rerollSingleOption(myHalfPlan, myPlayerNumber, optionNumber);
    const encoded = encodeHalfPlan(newPlan);

    // Actualizar en la base de datos
    await supabase
      .from('game_responses')
      .update({ response: encoded })
      .eq('room_id', roomId)
      .eq('player_number', myPlayerNumber);

    setMyHalfPlan(newPlan);
  }, [roomId, myPlayerNumber, myLocked, myHalfPlan]);

  const lockPlan = useCallback(async () => {
    if (!roomId || !myPlayerNumber || !myHalfPlan || myLocked) return;

    // Actualizar response añadiendo |locked
    const encoded = encodeHalfPlan(myHalfPlan) + '|locked';

    await supabase
      .from('game_responses')
      .update({ response: encoded })
      .eq('room_id', roomId)
      .eq('player_number', myPlayerNumber);

    setMyLocked(true);
  }, [roomId, myPlayerNumber, myHalfPlan, myLocked]);

  const resetGame = useCallback(async () => {
    if (!roomId) return;
    await supabase.from('game_responses').delete().eq('room_id', roomId);
    setMyHalfPlan(null);
    setPartnerHalfPlan(null);
    setMyLocked(false);
    setPartnerLocked(false);
  }, [roomId]);

  // Helper para parsear response con lock
  const parseResponse = (response: string): { halfPlan: HalfPlanResult | null; locked: boolean } => {
    const isLocked = response.endsWith('|locked');
    const planPart = isLocked ? response.replace('|locked', '') : response;
    return {
      halfPlan: decodeHalfPlan(planPart),
      locked: isLocked,
    };
  };

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
        data.forEach((r: any) => {
          const { halfPlan, locked } = parseResponse(r.response);
          if (halfPlan) {
            if (r.player_number === myPlayerNumber) {
              setMyHalfPlan(halfPlan);
              setMyLocked(locked);
            } else {
              setPartnerHalfPlan(halfPlan);
              setPartnerLocked(locked);
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

    const handleResponse = (playerNumber: number, responseStr: string) => {
      const { halfPlan, locked } = parseResponse(responseStr);
      if (halfPlan) {
        if (playerNumber === myPlayerNumber) {
          setMyHalfPlan(halfPlan);
          setMyLocked(locked);
        } else {
          setPartnerHalfPlan(halfPlan);
          setPartnerLocked(locked);
        }
      }
    };

    const channel = supabase
      .channel(`randomplan:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload: any) => {
        const response = payload.new as { player_number: number; response: string };
        if (response) {
          handleResponse(response.player_number, response.response);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload: any) => {
        const response = payload.new as { player_number: number; response: string };
        if (response) {
          handleResponse(response.player_number, response.response);
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload: any) => {
        // Si alguien borra, actualizamos
        const deleted = payload.old as { player_number?: number };
        if (deleted?.player_number && deleted.player_number !== myPlayerNumber) {
          setPartnerHalfPlan(null);
          setPartnerLocked(false);
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
    myLocked,
    partnerLocked,
    canReroll,
    startGame,
    rollDice,
    reroll,
    rerollOption,
    lockPlan,
    resetGame,
  };
}
