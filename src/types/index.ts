// Tipos principales de Vínculo

export type RoomStatus = 'waiting' | 'playing' | 'paused' | 'finished';

export type CardType = 'express' | 'listen' | 'repair' | 'mirror' | 'pause';

export interface Room {
  id: string;
  code: string;
  created_at: string;
  expires_at: string;
  status: RoomStatus;
  current_round: number;
  pause_until?: string;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  joined_at: string;
  is_ready: boolean;
}

export interface Card {
  id: string;
  type: CardType;
  prompt: string;
  placeholder: string;
  // Si es true, la pregunta es "sobre tu pareja" y se alterna quién es el sujeto
  aboutPartner?: boolean;
}

export interface CardPlayed {
  id: string;
  room_id: string;
  player_id: string;
  round: number;
  card_type: CardType;
  content: string;
  created_at: string;
}
