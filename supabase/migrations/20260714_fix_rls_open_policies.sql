-- Security fix: replace "allow all" RLS policies with real room-membership checks.
--
-- Before this migration, every table had `USING (true) WITH CHECK (true)`, meaning
-- anyone holding the (public, client-side) anon key could read or write every
-- couple's rooms, players, messages and game_responses directly via the REST API.
--
-- This migration:
-- 1. Adds a `user_id` column to `players`, linked to Supabase Auth (anonymous sign-in).
-- 2. Adds a SECURITY DEFINER helper to check room membership without RLS recursion.
-- 3. Moves "create room" / "join room" (which need to bypass RLS to look up a room
--    by code and atomically evict a stale guest) into SECURITY DEFINER RPC functions.
-- 4. Replaces every "allow all" policy with a membership- or ownership-scoped one.

-- 1. Link players to an authenticated (anonymous) user
ALTER TABLE players ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Existing rows (if any) have no owner; they'll simply become unreachable under the
-- new policies, which is the desired outcome (stale/orphaned sessions).

-- 2. Room-membership helper (SECURITY DEFINER avoids RLS self-recursion on `players`)
CREATE OR REPLACE FUNCTION is_room_member(target_room_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM players
    WHERE room_id = target_room_id AND user_id = auth.uid()
  );
$$;

-- 3. RPCs for the two membership-changing operations

CREATE OR REPLACE FUNCTION create_room_as_player(p_code TEXT, p_game_type TEXT, p_invite_message TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id UUID;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  INSERT INTO rooms (code, game_type, invite_message)
  VALUES (p_code, p_game_type, p_invite_message)
  RETURNING id INTO v_room_id;

  INSERT INTO players (room_id, player_number, user_id, is_online)
  VALUES (v_room_id, 1, v_uid, true);

  RETURN v_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION join_room_as_player(p_code TEXT)
RETURNS TABLE(room_id UUID, player_number INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id UUID;
  v_player_number INT;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT id INTO v_room_id FROM rooms WHERE code = upper(p_code);
  IF v_room_id IS NULL THEN
    RAISE EXCEPTION 'room not found';
  END IF;

  -- Rejoin case: drop any previous membership this user had in this room
  DELETE FROM players WHERE room_id = v_room_id AND user_id = v_uid;

  IF EXISTS (SELECT 1 FROM players WHERE room_id = v_room_id AND player_number = 1) THEN
    -- Evict a stale guest (matches prior app behavior) and take slot 2
    DELETE FROM players WHERE room_id = v_room_id AND player_number = 2;
    v_player_number := 2;
  ELSE
    v_player_number := 1;
  END IF;

  INSERT INTO players (room_id, player_number, user_id, is_online)
  VALUES (v_room_id, v_player_number, v_uid, true);

  RETURN QUERY SELECT v_room_id, v_player_number;
END;
$$;

GRANT EXECUTE ON FUNCTION create_room_as_player(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION join_room_as_player(TEXT) TO authenticated;

-- 4. Replace "allow all" policies

DROP POLICY IF EXISTS "Allow all on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all on players" ON players;
DROP POLICY IF EXISTS "Allow all on messages" ON messages;
DROP POLICY IF EXISTS "Allow all on game_responses" ON game_responses;

-- rooms: members only (room creation/lookup-by-code happens inside the RPCs above,
-- which run as SECURITY DEFINER and bypass RLS)
CREATE POLICY "rooms_select_members" ON rooms FOR SELECT
  USING (is_room_member(id));
CREATE POLICY "rooms_update_members" ON rooms FOR UPDATE
  USING (is_room_member(id));

-- players: members can see each other; you can only touch your own row directly
-- (membership-changing writes go through the RPCs above)
CREATE POLICY "players_select_members" ON players FOR SELECT
  USING (is_room_member(room_id));
CREATE POLICY "players_update_self" ON players FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "players_delete_self" ON players FOR DELETE
  USING (user_id = auth.uid());

-- messages: members only
CREATE POLICY "messages_select_members" ON messages FOR SELECT
  USING (is_room_member(room_id));
CREATE POLICY "messages_insert_members" ON messages FOR INSERT
  WITH CHECK (is_room_member(room_id));
CREATE POLICY "messages_update_members" ON messages FOR UPDATE
  USING (is_room_member(room_id));

-- game_responses: members only
CREATE POLICY "game_responses_select_members" ON game_responses FOR SELECT
  USING (is_room_member(room_id));
CREATE POLICY "game_responses_insert_members" ON game_responses FOR INSERT
  WITH CHECK (is_room_member(room_id));
