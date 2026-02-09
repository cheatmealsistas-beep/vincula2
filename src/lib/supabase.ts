// Cliente real de Supabase para sincronización entre dispositivos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Tipos para las tablas
export interface Room {
  id: string;
  code: string;
  created_at: string;
  status: 'active' | 'paused';
  pause_message?: string;
  pause_until?: string;
  game_type?: string;
  game_cards?: string[];
  game_round?: number;
  invite_message?: string;
}

export interface Player {
  id: string;
  room_id: string;
  player_number: 1 | 2;
  last_seen: string;
  is_online: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  from_player: 1 | 2;
  message_type: string;
  prompt: string;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface GameResponse {
  id: string;
  room_id: string;
  player_number: 1 | 2;
  round: number;
  card_id: string;
  response: string;
  response_type?: string;
  created_at: string;
}
