-- Migración: Añadir columna game_round para sincronización de rondas
-- Ejecutar en SQL Editor de Supabase si la tabla rooms ya existe

-- Añadir columnas si no existen
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS game_type TEXT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS game_cards JSONB;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS game_round INTEGER DEFAULT 1;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS invite_message TEXT;

-- Añadir columna response_type a game_responses si no existe
ALTER TABLE game_responses ADD COLUMN IF NOT EXISTS response_type TEXT;
