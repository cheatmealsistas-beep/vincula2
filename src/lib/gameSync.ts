// Sistema de sincronización de juegos usando Supabase Realtime Broadcast
// No usa base de datos, solo canales de comunicación en tiempo real

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface GameState {
  gameCards: string[] | number[];
  gameRound: number;
  responses: Record<string, any>;
}

export interface SyncMessage {
  type: 'game_state' | 'response' | 'next_round' | 'request_state';
  payload: any;
  from: 1 | 2;
  timestamp: number;
}

type MessageHandler = (message: SyncMessage) => void;

class GameSyncManager {
  private channel: RealtimeChannel | null = null;
  private playerNumber: 1 | 2 | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private gameState: GameState = {
    gameCards: [],
    gameRound: 1,
    responses: {},
  };

  // Conectar a una sala
  connect(roomCode: string, playerNumber: 1 | 2): Promise<boolean> {
    return new Promise((resolve) => {
      this.playerNumber = playerNumber;

      // Limpiar canal anterior si existe
      if (this.channel) {
        supabase.removeChannel(this.channel);
      }

      this.channel = supabase.channel(`game:${roomCode}`, {
        config: {
          broadcast: { self: false }, // No recibir mis propios mensajes
        },
      });

      this.channel
        .on('broadcast', { event: 'sync' }, ({ payload }) => {
          const message = payload as SyncMessage;
          this.handleMessage(message);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[GameSync] Conectado a sala ${roomCode} como jugador ${playerNumber}`);

            // Si soy jugador 2, pedir el estado actual
            if (playerNumber === 2) {
              setTimeout(() => {
                this.requestState();
              }, 500);
            }

            resolve(true);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[GameSync] Error al conectar');
            resolve(false);
          }
        });
    });
  }

  // Desconectar
  disconnect() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.playerNumber = null;
    this.gameState = { gameCards: [], gameRound: 1, responses: {} };
  }

  // Enviar mensaje al canal
  private send(message: Omit<SyncMessage, 'timestamp'>) {
    if (!this.channel) return;

    const fullMessage: SyncMessage = {
      ...message,
      timestamp: Date.now(),
    };

    this.channel.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullMessage,
    });
  }

  // Manejar mensaje recibido
  private handleMessage(message: SyncMessage) {
    console.log('[GameSync] Mensaje recibido:', message.type);

    switch (message.type) {
      case 'game_state':
        // Actualizar estado del juego
        this.gameState = message.payload;
        break;

      case 'response':
        // Añadir respuesta
        const { key, data } = message.payload;
        this.gameState.responses[key] = data;
        break;

      case 'next_round':
        this.gameState.gameRound = message.payload.round;
        break;

      case 'request_state':
        // El otro jugador pide el estado, enviarlo si soy jugador 1
        if (this.playerNumber === 1 && this.gameState.gameCards.length > 0) {
          this.send({
            type: 'game_state',
            payload: this.gameState,
            from: 1,
          });
        }
        break;
    }

    // Notificar a los handlers
    this.handlers.forEach((handler) => handler(message));
  }

  // Pedir estado actual (usado por jugador 2)
  requestState() {
    if (!this.playerNumber) return;
    this.send({
      type: 'request_state',
      payload: null,
      from: this.playerNumber,
    });
  }

  // Inicializar juego (solo jugador 1)
  initGame(gameCards: string[] | number[]) {
    if (this.playerNumber !== 1) return;

    this.gameState = {
      gameCards,
      gameRound: 1,
      responses: {},
    };

    this.send({
      type: 'game_state',
      payload: this.gameState,
      from: 1,
    });
  }

  // Enviar respuesta
  sendResponse(key: string, data: any) {
    if (!this.playerNumber) return;

    this.gameState.responses[key] = data;

    this.send({
      type: 'response',
      payload: { key, data },
      from: this.playerNumber,
    });
  }

  // Avanzar ronda
  nextRound() {
    if (!this.playerNumber) return;

    this.gameState.gameRound += 1;

    this.send({
      type: 'next_round',
      payload: { round: this.gameState.gameRound },
      from: this.playerNumber,
    });
  }

  // Obtener estado actual
  getState(): GameState {
    return this.gameState;
  }

  // Suscribirse a mensajes
  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  // Actualizar estado local
  setState(state: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...state };
  }

  // Getters
  getPlayerNumber() {
    return this.playerNumber;
  }

  isConnected() {
    return this.channel !== null;
  }
}

// Singleton
export const gameSync = new GameSyncManager();
