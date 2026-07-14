import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface GameSyncState {
  gameCards: (string | number)[];
  gameRound: number;
  responses: Record<string, any>;
  gameFinished: boolean;
}

export interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state' | 'game_finished';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

interface UseGameSyncReturn {
  // Estado
  gameCards: (string | number)[];
  gameRound: number;
  responses: Record<string, any>;
  gameFinished: boolean;
  isConnected: boolean;

  // Acciones
  initGame: (cards: (string | number)[]) => void;
  sendResponse: (key: string, data: any) => void;
  advanceRound: () => void;
  finishGame: () => void;
  resetSync: () => void;
}

export function useGameSync(
  roomCode: string | null,
  playerNumber: 1 | 2 | null
): UseGameSyncReturn {
  const [gameCards, setGameCards] = useState<(string | number)[]>([]);
  const [gameRound, setGameRound] = useState(1);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [gameFinished, setGameFinished] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const stateRef = useRef({ gameCards, gameRound, responses });

  // Mantener refs actualizados
  useEffect(() => {
    stateRef.current = { gameCards, gameRound, responses };
  }, [gameCards, gameRound, responses]);

  // Enviar mensaje al canal
  const send = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (!channelRef.current || !playerNumber) return;

    const fullMessage: SyncMessage = {
      ...message,
      timestamp: Date.now(),
    };

    console.log('[GameSync] Enviando:', message.type);

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullMessage,
    });
  }, [playerNumber]);

  // Manejar mensajes recibidos
  const handleMessage = useCallback((message: SyncMessage) => {
    console.log('[GameSync] Recibido:', message.type);

    switch (message.type) {
      case 'game_state':
        setGameCards(message.payload.gameCards || []);
        setGameRound(message.payload.gameRound || 1);
        setResponses(message.payload.responses || {});
        setGameFinished(false);
        break;

      case 'response':
        const { key, data } = message.payload;
        setResponses(prev => ({ ...prev, [key]: data }));
        break;

      case 'next_round':
        setGameRound(message.payload.round);
        break;

      case 'request_state':
        // El otro jugador pide el estado, enviarlo si soy jugador 1 y tengo datos
        if (playerNumber === 1 && stateRef.current.gameCards.length > 0) {
          send({
            type: 'game_state',
            payload: {
              gameCards: stateRef.current.gameCards,
              gameRound: stateRef.current.gameRound,
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
  }, [playerNumber, send]);

  // Conectar al canal
  useEffect(() => {
    if (!roomCode || !playerNumber) return;

    console.log(`[GameSync] Conectando a game:${roomCode} como jugador ${playerNumber}`);

    // Limpiar canal anterior si existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`game:${roomCode}`, {
      config: {
        broadcast: { self: false }, // No recibir mis propios mensajes
      },
    });

    channel
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        handleMessage(payload as SyncMessage);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[GameSync] Conectado exitosamente`);
          setIsConnected(true);

          // Si soy jugador 2, pedir el estado actual
          if (playerNumber === 2) {
            setTimeout(() => {
              channel.send({
                type: 'broadcast',
                event: 'sync',
                payload: {
                  type: 'request_state',
                  payload: null,
                  from: 2,
                  timestamp: Date.now(),
                },
              });
            }, 500);
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[GameSync] Error de conexion');
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('[GameSync] Desconectando');
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [roomCode, playerNumber, handleMessage]);

  // Inicializar juego (solo jugador 1)
  const initGame = useCallback((cards: (string | number)[]) => {
    if (playerNumber !== 1) return;

    console.log('[GameSync] Inicializando juego con', cards.length, 'cartas');

    const newState = {
      gameCards: cards,
      gameRound: 1,
      responses: {},
    };

    setGameCards(cards);
    setGameRound(1);
    setResponses({});
    setGameFinished(false);

    send({
      type: 'game_state',
      payload: newState,
      from: 1,
    });
  }, [playerNumber, send]);

  // Enviar respuesta
  const sendResponse = useCallback((key: string, data: any) => {
    if (!playerNumber) return;

    setResponses(prev => ({ ...prev, [key]: data }));

    send({
      type: 'response',
      payload: { key, data },
      from: playerNumber,
    });
  }, [playerNumber, send]);

  // Avanzar ronda
  const advanceRound = useCallback(() => {
    if (!playerNumber) return;

    const newRound = gameRound + 1;
    setGameRound(newRound);

    send({
      type: 'next_round',
      payload: { round: newRound },
      from: playerNumber,
    });
  }, [playerNumber, gameRound, send]);

  // Terminar juego
  const finishGame = useCallback(() => {
    if (!playerNumber) return;

    setGameFinished(true);

    send({
      type: 'game_finished',
      payload: { finished: true },
      from: playerNumber,
    });
  }, [playerNumber, send]);

  // Resetear sincronizacion
  const resetSync = useCallback(() => {
    setGameCards([]);
    setGameRound(1);
    setResponses({});
    setGameFinished(false);
  }, []);

  return {
    gameCards,
    gameRound,
    responses,
    gameFinished,
    isConnected,
    initGame,
    sendResponse,
    advanceRound,
    finishGame,
    resetSync,
  };
}
