-- Schema de Vínculo para Supabase
-- Ejecutar en SQL Editor de Supabase

-- Tabla de salas
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  pause_message TEXT,
  pause_until TEXT,
  game_type TEXT,
  game_cards JSONB,
  game_round INTEGER DEFAULT 1,
  invite_message TEXT
);

-- Tabla de jugadores en sala
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_number INTEGER NOT NULL CHECK (player_number IN (1, 2)),
  last_seen TIMESTAMPTZ DEFAULT now(),
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, player_number)
);

-- Tabla de mensajes asíncronos
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  from_player INTEGER NOT NULL CHECK (from_player IN (1, 2)),
  message_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  gesture TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de respuestas en juego
CREATE TABLE game_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_number INTEGER NOT NULL CHECK (player_number IN (1, 2)),
  round INTEGER NOT NULL,
  card_id TEXT NOT NULL,
  response TEXT NOT NULL,
  gesture TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, player_number, round)
);

-- Habilitar Realtime en todas las tablas
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE game_responses;

-- Políticas de seguridad (permitir todo por ahora - sin auth)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on game_responses" ON game_responses FOR ALL USING (true) WITH CHECK (true);
