import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { GameResponse } from '../lib/supabase';
import {
  getRandomDrawWords,
  DRAW_WORDS,
  type DrawWord,
} from '../data/drawguess';

interface UseDrawGuessReturn {
  words: DrawWord[];
  currentRound: number;
  isMyTurnToDraw: boolean;
  currentWord: DrawWord | null;
  myDrawing: string | null;
  partnerDrawing: string | null;
  myGuess: string | null;
  partnerGuess: string | null;
  correctGuess: boolean | null;
  loading: boolean;
  startGame: () => Promise<void>;
  submitDrawing: (dataUrl: string) => Promise<void>;
  submitGuess: (guess: string) => Promise<void>;
  nextRound: () => Promise<void>;
  resetGame: () => Promise<void>;
}

// Comprimir imagen para evitar problemas con Supabase Realtime
function compressDataUrl(dataUrl: string, quality: number = 0.5): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Reducir tamaño si es muy grande
      const maxSize = 400;
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function useDrawGuess(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseDrawGuessReturn {
  const [words, setWords] = useState<DrawWord[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Map<string, GameResponse>>(new Map());
  const [loading, setLoading] = useState(false);

  // Determinar quién dibuja en cada ronda (alternando)
  const drawerForRound = currentRound % 2 === 1 ? 1 : 2;
  const isMyTurnToDraw = myPlayerNumber === drawerForRound;

  const currentWord = words[currentRound - 1] || null;

  // Respuestas de la ronda actual
  const myDrawingKey = `${currentRound}-drawing-${myPlayerNumber}`;
  const partnerDrawingKey = `${currentRound}-drawing-${myPlayerNumber === 1 ? 2 : 1}`;
  const myGuessKey = `${currentRound}-guess-${myPlayerNumber}`;
  const partnerGuessKey = `${currentRound}-guess-${myPlayerNumber === 1 ? 2 : 1}`;

  const myDrawingData = responses.get(myDrawingKey);
  const partnerDrawingData = responses.get(partnerDrawingKey);
  const myGuessData = responses.get(myGuessKey);
  const partnerGuessData = responses.get(partnerGuessKey);

  const myDrawing = myDrawingData?.response || null;
  const partnerDrawing = partnerDrawingData?.response || null;
  const myGuess = myGuessData?.response || null;
  const partnerGuess = partnerGuessData?.response || null;

  // Determinar si la adivinanza es correcta
  let correctGuess: boolean | null = null;
  if (currentWord) {
    const guess = isMyTurnToDraw ? partnerGuess : myGuess;
    if (guess) {
      correctGuess = guess.toLowerCase().trim() === currentWord.word.toLowerCase().trim();
    }
  }

  // Iniciar juego - SOLO Player 1 genera palabras
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    setLoading(true);

    // Verificar si ya hay palabras guardadas
    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards, game_round')
      .eq('id', roomId)
      .single();

    if (room?.game_cards && room.game_cards.length > 0) {
      const savedWords = room.game_cards
        .map((id: string) => DRAW_WORDS.find((w) => w.id === id))
        .filter(Boolean) as DrawWord[];
      setWords(savedWords);
      setCurrentRound(room.game_round || 1);
    } else if (myPlayerNumber === 1) {
      // SOLO Player 1 genera palabras
      const newWords = getRandomDrawWords(6);
      const wordIds = newWords.map((w) => w.id);

      await supabase
        .from('rooms')
        .update({ game_cards: wordIds, game_round: 1 })
        .eq('id', roomId);

      // Limpiar respuestas anteriores
      await supabase.from('game_responses').delete().eq('room_id', roomId);

      setWords(newWords);
      setCurrentRound(1);
    } else {
      // Jugador 2: esperar a que el jugador 1 cree los datos (polling con reintentos)
      let retries = 0;
      const maxRetries = 10;
      while (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: roomRetry } = await supabase
          .from('rooms')
          .select('game_cards, game_round')
          .eq('id', roomId)
          .single();

        if (roomRetry?.game_cards && roomRetry.game_cards.length > 0) {
          const savedWords = roomRetry.game_cards
            .map((id: string) => DRAW_WORDS.find((w) => w.id === id))
            .filter(Boolean) as DrawWord[];
          setWords(savedWords);
          setCurrentRound(roomRetry.game_round || 1);
          break;
        }
        retries++;
      }
    }

    setResponses(new Map());
    setLoading(false);
  }, [roomId, myPlayerNumber]);

  // Enviar dibujo - CON COMPRESIÓN
  const submitDrawing = useCallback(
    async (dataUrl: string) => {
      if (!roomId || !myPlayerNumber || !isMyTurnToDraw) return;

      // Comprimir el dibujo antes de enviarlo
      const compressedDataUrl = await compressDataUrl(dataUrl, 0.6);

      await supabase.from('game_responses').insert({
        room_id: roomId,
        player_number: myPlayerNumber,
        round: currentRound,
        card_id: currentWord?.id || '',
        response: compressedDataUrl,
        response_type: 'drawing',
      });
    },
    [roomId, myPlayerNumber, currentRound, currentWord, isMyTurnToDraw]
  );

  // Enviar adivinanza
  const submitGuess = useCallback(
    async (guess: string) => {
      if (!roomId || !myPlayerNumber || isMyTurnToDraw) return;

      await supabase.from('game_responses').insert({
        room_id: roomId,
        player_number: myPlayerNumber,
        round: currentRound,
        card_id: currentWord?.id || '',
        response: guess,
        response_type: 'guess',
      });
    },
    [roomId, myPlayerNumber, currentRound, currentWord, isMyTurnToDraw]
  );

  // Siguiente ronda - SINCRONIZADA
  const nextRound = useCallback(async () => {
    if (!roomId) return;

    const newRound = currentRound + 1;

    await supabase
      .from('rooms')
      .update({ game_round: newRound })
      .eq('id', roomId);

    setCurrentRound(newRound);
  }, [roomId, currentRound]);

  // Resetear juego
  const resetGame = useCallback(async () => {
    if (!roomId) return;

    await supabase
      .from('rooms')
      .update({ game_cards: null, game_round: 1 })
      .eq('id', roomId);

    setWords([]);
    setCurrentRound(1);
    setResponses(new Map());
  }, [roomId]);

  // Ref para rastrear si ya tenemos words (evita problemas de closure)
  const wordsRef = useRef(words);
  wordsRef.current = words;

  // Cargar palabras al entrar si ya existen + polling continuo como fallback
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    const loadWords = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (!isMounted) return;

      if (room?.game_cards && room.game_cards.length > 0) {
        const savedWords = room.game_cards
          .map((id: string) => DRAW_WORDS.find((w) => w.id === id))
          .filter(Boolean) as DrawWord[];
        setWords(savedWords);
      }
      if (room?.game_round) {
        setCurrentRound(room.game_round);
      }
    };

    loadWords();

    const pollInterval = setInterval(() => {
      if (wordsRef.current.length === 0) {
        loadWords();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [roomId]);

  // Suscripción a cambios en la sala (sincronizar ronda y palabras)
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`draw-room-sync:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload: any) => {
          const room = payload.new as { game_round?: number; game_cards?: string[] };

          if (room.game_round && room.game_round !== currentRound) {
            setCurrentRound(room.game_round);
          }

          if (room.game_cards && room.game_cards.length > 0 && words.length === 0) {
            const savedWords = room.game_cards
              .map((id: string) => DRAW_WORDS.find((w) => w.id === id))
              .filter(Boolean) as DrawWord[];
            setWords(savedWords);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, currentRound, words.length]);

  // Suscripción a respuestas en tiempo real
  useEffect(() => {
    if (!roomId) return;

    // Cargar respuestas existentes
    const loadResponses = async () => {
      const { data } = await supabase
        .from('game_responses')
        .select()
        .eq('room_id', roomId);

      if (data) {
        const newResponses = new Map<string, GameResponse>();
        data.forEach((r: any) => {
          const type = r.response_type || 'response';
          newResponses.set(`${r.round}-${type}-${r.player_number}`, r);
        });
        setResponses(newResponses);
      }
    };

    loadResponses();

    // Suscripción a nuevas respuestas
    const channel = supabase
      .channel(`draw:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_responses',
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => {
          const response = payload.new as GameResponse;
          if (response) {
            const type = response.response_type || 'response';
            setResponses((prev) => {
              const newMap = new Map(prev);
              newMap.set(`${response.round}-${type}-${response.player_number}`, response);
              return newMap;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return {
    words,
    currentRound,
    isMyTurnToDraw,
    currentWord: isMyTurnToDraw ? currentWord : null, // Solo el que dibuja ve la palabra
    myDrawing,
    partnerDrawing,
    myGuess,
    partnerGuess,
    correctGuess,
    loading,
    startGame,
    submitDrawing,
    submitGuess,
    nextRound,
    resetGame,
  };
}
