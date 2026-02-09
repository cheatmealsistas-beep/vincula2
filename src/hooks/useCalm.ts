import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CalmState {
  isActive: boolean;
  initiatorPlayerNumber: 1 | 2 | null;
  partnerResponse: 'breathing' | 'support' | 'presence' | null;
  supportMessage: string | null;
  isBreathing: boolean;
  partnerIsBreathing: boolean;
}

export function useCalm(roomId: string | null, myPlayerNumber: 1 | 2 | null) {
  const [state, setState] = useState<CalmState>({
    isActive: false,
    initiatorPlayerNumber: null,
    partnerResponse: null,
    supportMessage: null,
    isBreathing: false,
    partnerIsBreathing: false,
  });

  // Cargar estado desde la base de datos
  useEffect(() => {
    if (!roomId) return;

    const loadCalmState = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('calm_state')
        .eq('id', roomId)
        .single();

      if (room?.calm_state) {
        const calmState = room.calm_state as Partial<CalmState>;
        setState(prev => ({
          ...prev,
          ...calmState,
        }));
      }
    };

    loadCalmState();

    // Suscribirse a cambios
    const channel = supabase
      .channel(`calm-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload: any) => {
          const newRoom = payload.new as { calm_state?: Partial<CalmState> };
          if (newRoom.calm_state) {
            setState(prev => ({
              ...prev,
              ...newRoom.calm_state,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Iniciar momento de calma
  const startCalm = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    const newState: Partial<CalmState> = {
      isActive: true,
      initiatorPlayerNumber: myPlayerNumber,
      partnerResponse: null,
      supportMessage: null,
      isBreathing: false,
      partnerIsBreathing: false,
    };

    await supabase
      .from('rooms')
      .update({ calm_state: newState })
      .eq('id', roomId);

    setState(prev => ({ ...prev, ...newState }));
  }, [roomId, myPlayerNumber]);

  // Empezar a respirar
  const startBreathing = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    const isInitiator = state.initiatorPlayerNumber === myPlayerNumber;
    const updateKey = isInitiator ? 'isBreathing' : 'partnerIsBreathing';

    const newState = {
      ...state,
      [updateKey]: true,
      ...(isInitiator ? {} : { partnerResponse: 'breathing' as const }),
    };

    await supabase
      .from('rooms')
      .update({ calm_state: newState })
      .eq('id', roomId);

    setState(newState);
  }, [roomId, myPlayerNumber, state]);

  // Enviar mensaje de apoyo
  const sendSupport = useCallback(async (message: string) => {
    if (!roomId) return;

    const newState = {
      ...state,
      partnerResponse: 'support' as const,
      supportMessage: message,
    };

    await supabase
      .from('rooms')
      .update({ calm_state: newState })
      .eq('id', roomId);

    setState(newState);
  }, [roomId, state]);

  // Enviar presencia silenciosa
  const sendPresence = useCallback(async () => {
    if (!roomId) return;

    const newState = {
      ...state,
      partnerResponse: 'presence' as const,
    };

    await supabase
      .from('rooms')
      .update({ calm_state: newState })
      .eq('id', roomId);

    setState(newState);
  }, [roomId, state]);

  // Terminar momento de calma
  const endCalm = useCallback(async () => {
    if (!roomId) return;

    const newState: CalmState = {
      isActive: false,
      initiatorPlayerNumber: null,
      partnerResponse: null,
      supportMessage: null,
      isBreathing: false,
      partnerIsBreathing: false,
    };

    await supabase
      .from('rooms')
      .update({ calm_state: newState })
      .eq('id', roomId);

    setState(newState);
  }, [roomId]);

  const isInitiator = state.initiatorPlayerNumber === myPlayerNumber;
  const partnerJoined = isInitiator
    ? state.partnerIsBreathing
    : state.isBreathing;

  return {
    isActive: state.isActive,
    isInitiator,
    partnerResponse: state.partnerResponse,
    supportMessage: state.supportMessage,
    partnerJoined,
    startCalm,
    startBreathing,
    sendSupport,
    sendPresence,
    endCalm,
  };
}
