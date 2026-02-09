import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getRandomAdventure, getAdventureById, type Adventure } from '../data/adventure';

interface UseAdventureReturn {
  adventure: Adventure | null;
  myAvatarId: string | null;
  partnerAvatarId: string | null;
  currentEventId: string | null;
  completedEventIds: string[];
  myVote: string | null;
  partnerVote: string | null;
  loading: boolean;
  startGame: () => Promise<void>;
  selectAvatar: (avatarId: string) => Promise<void>;
  moveToEvent: (eventId: string) => Promise<void>;
  vote: (choice: string) => Promise<void>;
  completeEvent: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useAdventure(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseAdventureReturn {
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [myAvatarId, setMyAvatarId] = useState<string | null>(null);
  const [partnerAvatarId, setPartnerAvatarId] = useState<string | null>(null);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [partnerVote, setPartnerVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startGame = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);

    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards')
      .eq('id', roomId)
      .single();

    let adv: Adventure;
    if (room?.game_cards && room.game_cards[0]) {
      adv = getAdventureById(room.game_cards[0]) || getRandomAdventure();
    } else {
      adv = getRandomAdventure();
      await supabase
        .from('rooms')
        .update({ game_cards: [adv.id] })
        .eq('id', roomId);
    }

    setAdventure(adv);
    await supabase.from('game_responses').delete().eq('room_id', roomId);
    setMyAvatarId(null);
    setPartnerAvatarId(null);
    setCurrentEventId(null);
    setCompletedEventIds([]);
    setMyVote(null);
    setPartnerVote(null);
    setLoading(false);
  }, [roomId]);

  const selectAvatar = useCallback(async (avatarId: string) => {
    if (!roomId || !myPlayerNumber) return;
    setMyAvatarId(avatarId);

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: 0,
      card_id: 'avatar',
      response: avatarId,
      response_type: 'avatar',
    });
  }, [roomId, myPlayerNumber]);

  const moveToEvent = useCallback(async (eventId: string) => {
    if (!roomId || !myPlayerNumber) return;
    setCurrentEventId(eventId);
    setMyVote(null);
    setPartnerVote(null);

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: completedEventIds.length + 1,
      card_id: eventId,
      response: 'move',
      response_type: 'move',
    });
  }, [roomId, myPlayerNumber, completedEventIds]);

  const vote = useCallback(async (choice: string) => {
    if (!roomId || !myPlayerNumber || !currentEventId) return;
    setMyVote(choice);

    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: completedEventIds.length + 1,
      card_id: currentEventId,
      response: choice,
      response_type: 'vote',
    });
  }, [roomId, myPlayerNumber, currentEventId, completedEventIds]);

  const completeEvent = useCallback(async () => {
    if (!currentEventId || !roomId || !myPlayerNumber) return;
    setCompletedEventIds(prev => [...prev, currentEventId]);
    setMyVote(null);
    setPartnerVote(null);

    // Notificar a la pareja que el evento se completó
    await supabase.from('game_responses').insert({
      room_id: roomId,
      player_number: myPlayerNumber,
      round: completedEventIds.length + 1,
      card_id: currentEventId,
      response: 'complete',
      response_type: 'complete',
    });
  }, [currentEventId, roomId, myPlayerNumber, completedEventIds]);

  const resetGame = useCallback(async () => {
    if (!roomId) return;
    await supabase.from('rooms').update({ game_cards: null }).eq('id', roomId);
    setAdventure(null);
    setMyAvatarId(null);
    setPartnerAvatarId(null);
    setCurrentEventId(null);
    setCompletedEventIds([]);
  }, [roomId]);

  // Load adventure
  useEffect(() => {
    if (!roomId) return;
    const load = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards')
        .eq('id', roomId)
        .single();

      if (room?.game_cards?.[0]) {
        const adv = getAdventureById(room.game_cards[0]);
        if (adv) setAdventure(adv);
      }
    };
    load();
  }, [roomId]);

  // Real-time subscription
  useEffect(() => {
    if (!roomId) return;

    const loadResponses = async () => {
      const { data } = await supabase
        .from('game_responses')
        .select()
        .eq('room_id', roomId);

      if (data) {
        data.forEach((r: any) => {
          if (r.response_type === 'avatar') {
            if (r.player_number === myPlayerNumber) {
              setMyAvatarId(r.response);
            } else {
              setPartnerAvatarId(r.response);
            }
          }
          if (r.response_type === 'vote') {
            if (r.player_number === myPlayerNumber) {
              setMyVote(r.response);
            } else {
              setPartnerVote(r.response);
            }
          }
        });
      }
    };

    loadResponses();

    const channel = supabase
      .channel(`adventure:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_responses',
        filter: `room_id=eq.${roomId}`,
      }, (payload: any) => {
        const r = payload.new as any;
        if (!r) return;

        if (r.response_type === 'avatar' && r.player_number !== myPlayerNumber) {
          setPartnerAvatarId(r.response);
        }
        if (r.response_type === 'vote' && r.player_number !== myPlayerNumber) {
          setPartnerVote(r.response);
        }
        if (r.response_type === 'move' && r.player_number !== myPlayerNumber) {
          setCurrentEventId(r.card_id);
          // Reset votos cuando cambia de evento
          setMyVote(null);
          setPartnerVote(null);
        }
        if (r.response_type === 'complete' && r.player_number !== myPlayerNumber) {
          // Sincronizar eventos completados
          setCompletedEventIds(prev => {
            if (!prev.includes(r.card_id)) {
              return [...prev, r.card_id];
            }
            return prev;
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, myPlayerNumber]);

  return {
    adventure,
    myAvatarId,
    partnerAvatarId,
    currentEventId,
    completedEventIds,
    myVote,
    partnerVote,
    loading,
    startGame,
    selectAvatar,
    moveToEvent,
    vote,
    completeEvent,
    resetGame,
  };
}
