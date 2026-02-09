import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getRandomChallenges, SILLY_CHALLENGES, type SillyChallenge } from '../data/sillychallenges';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseSillyChallengesReturn {
  challenges: SillyChallenge[];
  currentRound: number;
  currentPlayer: 1 | 2;
  iAmChallenged: boolean;
  challengeCompleted: boolean;
  partnerConfirmed: boolean;
  partnerRejected: boolean;
  loading: boolean;
  gameFinished: boolean;
  startGame: () => Promise<void>;
  completeChallenge: () => void;
  confirmPartnerChallenge: () => void;
  rejectPartnerChallenge: () => void;
  nextRound: () => void;
  resetGame: () => void;
  finishGame: () => void;
}

export function useSillyChallenges(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseSillyChallengesReturn {
  const [challenges, setChallenges] = useState<SillyChallenge[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const stateRef = useRef({ challenges, currentRound, responses });

  // Mantener refs actualizados
  useEffect(() => {
    stateRef.current = { challenges, currentRound, responses };
  }, [challenges, currentRound, responses]);

  // Alternar quien hace el reto (rondas impares: jugador 1, pares: jugador 2)
  const currentPlayer = currentRound % 2 === 1 ? 1 : 2;
  const iAmChallenged = currentPlayer === myPlayerNumber;

  // Claves para respuestas
  const challengedKey = `${currentRound}-${currentPlayer}`;
  const confirmerKey = `${currentRound}-${currentPlayer === 1 ? 2 : 1}`;

  const challengeCompleted = !!responses[challengedKey];
  const partnerConfirmed = responses[confirmerKey]?.confirmed === true;
  const partnerRejected = responses[confirmerKey]?.rejected === true;

  // Enviar mensaje al canal
  const send = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (!channelRef.current || !myPlayerNumber) return;

    const fullMessage: SyncMessage = {
      ...message,
      timestamp: Date.now(),
    };

    console.log('[SillyChallenges] Enviando:', message.type);

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullMessage,
    });
  }, [myPlayerNumber]);

  // Manejar mensajes recibidos
  const handleMessage = useCallback((message: SyncMessage) => {
    console.log('[SillyChallenges] Recibido:', message.type, message.payload);

    switch (message.type) {
      case 'game_state':
        if (message.payload.challengeIds) {
          const saved = message.payload.challengeIds
            .map((id: number) => SILLY_CHALLENGES.find(c => c.id === id))
            .filter(Boolean) as SillyChallenge[];
          setChallenges(saved);
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
        // El otro jugador pide el estado, enviarlo si soy jugador 1 y tengo datos
        if (myPlayerNumber === 1 && stateRef.current.challenges.length > 0) {
          send({
            type: 'game_state',
            payload: {
              challengeIds: stateRef.current.challenges.map(c => c.id),
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

  // Conectar al canal de Broadcast
  useEffect(() => {
    if (!roomId || !myPlayerNumber) return;

    console.log(`[SillyChallenges] Conectando a sillychallenges:${roomId} como jugador ${myPlayerNumber}`);

    // Limpiar canal anterior si existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`sillychallenges:${roomId}`, {
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
          console.log('[SillyChallenges] Conectado exitosamente');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[SillyChallenges] Error de conexion');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('[SillyChallenges] Desconectando');
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId, myPlayerNumber, handleMessage]);

  // Iniciar juego
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;
    setLoading(true);

    if (myPlayerNumber === 1) {
      // Jugador 1 genera los retos y los envia
      const newChallenges = getRandomChallenges(6);
      setChallenges(newChallenges);
      setCurrentRound(1);
      setResponses({});
      setGameFinished(false);

      // Enviar estado a jugador 2
      setTimeout(() => {
        send({
          type: 'game_state',
          payload: {
            challengeIds: newChallenges.map(c => c.id),
            gameRound: 1,
            responses: {},
          },
          from: 1,
        });
        setLoading(false);
      }, 300);
    } else {
      // Jugador 2 pide el estado
      setGameFinished(false);

      // Pedir estado al jugador 1
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

      // Timeout de espera - si no recibe estado en 5s, quitar loading
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [roomId, myPlayerNumber, send]);

  // Marcar reto como completado
  const completeChallenge = useCallback(() => {
    if (!myPlayerNumber || !iAmChallenged) return;

    const key = challengedKey;
    setResponses(prev => ({ ...prev, [key]: { done: true } }));

    send({
      type: 'response',
      payload: { key, data: { done: true } },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, iAmChallenged, challengedKey, send]);

  // Confirmar que la pareja hizo el reto
  const confirmPartnerChallenge = useCallback(() => {
    if (!myPlayerNumber || iAmChallenged) return;

    const key = confirmerKey;
    setResponses(prev => ({ ...prev, [key]: { confirmed: true } }));

    send({
      type: 'response',
      payload: { key, data: { confirmed: true } },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, iAmChallenged, confirmerKey, send]);

  // Rechazar que la pareja hizo el reto
  const rejectPartnerChallenge = useCallback(() => {
    if (!myPlayerNumber || iAmChallenged) return;

    const key = confirmerKey;
    setResponses(prev => ({ ...prev, [key]: { rejected: true } }));

    send({
      type: 'response',
      payload: { key, data: { rejected: true } },
      from: myPlayerNumber,
    });
  }, [myPlayerNumber, iAmChallenged, confirmerKey, send]);

  // Siguiente ronda
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

  // Resetear juego
  const resetGame = useCallback(() => {
    setChallenges([]);
    setCurrentRound(1);
    setResponses({});
    setGameFinished(false);
  }, []);

  // Terminar juego
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
    challenges,
    currentRound,
    currentPlayer,
    iAmChallenged,
    challengeCompleted,
    partnerConfirmed,
    partnerRejected,
    loading,
    gameFinished,
    startGame,
    completeChallenge,
    confirmPartnerChallenge,
    rejectPartnerChallenge,
    nextRound,
    resetGame,
    finishGame,
  };
}
