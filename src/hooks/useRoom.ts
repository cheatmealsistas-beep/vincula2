import { useState, useEffect, useCallback } from 'react';
import { supabase, ensureAnonymousSession } from '../lib/supabase';
import type { Room, Player, Message } from '../lib/supabase';

interface UseRoomReturn {
  // Estado
  room: Room | null;
  myPlayerNumber: 1 | 2 | null;
  partnerOnline: boolean;
  partnerLastSeen: string | null;
  pendingMessage: Message | null;
  isPaused: boolean;
  pauseMessage: string | null;
  loading: boolean;
  error: string | null;

  // Acciones
  createRoom: (code: string, gameType?: string, inviteMessage?: string) => Promise<boolean>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  setGameType: (gameType: string) => Promise<void>;
  sendMessage: (type: string, prompt: string, content: string) => Promise<void>;
  markMessageRead: (messageId: string) => Promise<void>;
  setPause: (message?: string, until?: string) => Promise<void>;
  resumeFromPause: () => Promise<void>;
  updatePresence: () => Promise<void>;
}

export function useRoom(): UseRoomReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [myPlayerNumber, setMyPlayerNumber] = useState<1 | 2 | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerLastSeen, setPartnerLastSeen] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear sala nueva
  const createRoom = useCallback(async (code: string, gameType?: string, inviteMessage?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await ensureAnonymousSession();

      const { data: roomId, error: rpcError } = await supabase.rpc('create_room_as_player', {
        p_code: code,
        p_game_type: gameType || null,
        p_invite_message: inviteMessage || null,
      });

      if (rpcError || !roomId) throw rpcError || new Error('No se pudo crear la sala');

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select()
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;

      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select()
        .eq('room_id', roomId)
        .eq('player_number', 1)
        .single();

      if (playerError) throw playerError;

      setRoom(roomData);
      setMyPlayerNumber(1);
      setMyPlayerId(playerData.id);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al crear sala');
      setLoading(false);
      return false;
    }
  }, []);

  // Unirse a sala existente
  const joinRoom = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await ensureAnonymousSession();

      const { data: joinResult, error: rpcError } = await supabase
        .rpc('join_room_as_player', { p_code: code.toUpperCase() })
        .single();

      if (rpcError || !joinResult) {
        setError('No existe una sala con ese código');
        setLoading(false);
        return false;
      }

      const { room_id: roomId, player_number: playerNumber } = joinResult as {
        room_id: string;
        player_number: 1 | 2;
      };

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select()
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;

      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select()
        .eq('room_id', roomId)
        .eq('player_number', playerNumber)
        .single();

      if (playerError) throw playerError;

      setRoom(roomData);
      setMyPlayerNumber(playerNumber);
      setMyPlayerId(playerData.id);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al unirse');
      setLoading(false);
      return false;
    }
  }, []);

  // Salir de sala
  const leaveRoom = useCallback(async () => {
    if (myPlayerId) {
      await supabase.from('players').delete().eq('id', myPlayerId);
    }
    setRoom(null);
    setMyPlayerNumber(null);
    setMyPlayerId(null);
    setPartnerOnline(false);
    setPendingMessage(null);
  }, [myPlayerId]);

  // Enviar mensaje asíncrono
  const sendMessage = useCallback(
    async (type: string, prompt: string, content: string) => {
      if (!room || !myPlayerNumber) return;

      await supabase.from('messages').insert({
        room_id: room.id,
        from_player: myPlayerNumber,
        message_type: type,
        prompt,
        content,
      });
    },
    [room, myPlayerNumber]
  );

  // Marcar mensaje como leído
  const markMessageRead = useCallback(async (messageId: string) => {
    await supabase
      .from('messages')
      .update({
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    setPendingMessage(null);
  }, []);

  // Activar pausa
  const setPause = useCallback(
    async (message?: string, until?: string) => {
      if (!room) return;

      await supabase
        .from('rooms')
        .update({
          status: 'paused',
          pause_message: message || 'Tu pareja necesita un momento.',
          pause_until: until || null,
        })
        .eq('id', room.id);
    },
    [room]
  );

  // Volver de pausa
  const resumeFromPause = useCallback(async () => {
    if (!room) return;

    await supabase
      .from('rooms')
      .update({
        status: 'active',
        pause_message: null,
        pause_until: null,
      })
      .eq('id', room.id);
  }, [room]);

  // Establecer tipo de juego
  const setGameType = useCallback(async (gameType: string) => {
    if (!room) return;

    console.log('[useRoom] Actualizando game_type a:', gameType);

    const { error } = await supabase
      .from('rooms')
      .update({ game_type: gameType })
      .eq('id', room.id);

    if (error) {
      console.error('[useRoom] Error al actualizar game_type:', error);
    } else {
      // Actualizar estado local inmediatamente
      setRoom(prev => prev ? { ...prev, game_type: gameType } : null);
    }
  }, [room]);

  // Actualizar presencia
  const updatePresence = useCallback(async () => {
    if (!myPlayerId) return;

    await supabase
      .from('players')
      .update({
        last_seen: new Date().toISOString(),
        is_online: true,
      })
      .eq('id', myPlayerId);
  }, [myPlayerId]);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    if (!room) return;

    // Suscripción a cambios en la sala
    const roomSubscription = supabase
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload: any) => {
          if (payload.new) {
            setRoom(payload.new as Room);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room.id}` },
        (payload: any) => {
          const player = payload.new as Player;
          if (player && player.player_number !== myPlayerNumber) {
            setPartnerOnline(player.is_online);
            if (!player.is_online && player.last_seen) {
              const date = new Date(player.last_seen);
              const now = new Date();
              const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
              if (diff < 60) {
                setPartnerLastSeen(`hace ${diff} min`);
              } else {
                setPartnerLastSeen(`hace ${Math.floor(diff / 60)}h`);
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        (payload: any) => {
          const message = payload.new as Message;
          if (message.from_player !== myPlayerNumber && !message.read_at) {
            setPendingMessage(message);
          }
        }
      )
      .subscribe();

    // Cargar estado inicial del partner
    const loadPartnerState = async () => {
      const { data: players } = await supabase
        .from('players')
        .select()
        .eq('room_id', room.id)
        .neq('player_number', myPlayerNumber);

      if (players && players.length > 0) {
        const partner = players[0];
        setPartnerOnline(partner.is_online);
      }

      // Cargar mensajes pendientes
      const { data: messages } = await supabase
        .from('messages')
        .select()
        .eq('room_id', room.id)
        .neq('from_player', myPlayerNumber)
        .is('read_at', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (messages && messages.length > 0) {
        setPendingMessage(messages[0]);
      }
    };

    loadPartnerState();

    // Actualizar presencia cada 30 segundos
    const presenceInterval = setInterval(updatePresence, 30000);

    // Marcar offline al salir
    const handleBeforeUnload = () => {
      if (myPlayerId) {
        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/players?id=eq.${myPlayerId}`,
          JSON.stringify({ is_online: false })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      roomSubscription.unsubscribe();
      clearInterval(presenceInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [room, myPlayerNumber, myPlayerId, updatePresence]);

  return {
    room,
    myPlayerNumber,
    partnerOnline,
    partnerLastSeen,
    pendingMessage,
    isPaused: room?.status === 'paused',
    pauseMessage: room?.pause_message || null,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    setGameType,
    sendMessage,
    markMessageRead,
    setPause,
    resumeFromPause,
    updatePresence,
  };
}
