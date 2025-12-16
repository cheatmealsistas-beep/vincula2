import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameResponse } from '../lib/supabase';
import {
  getRandomQuizQuestions,
  QUIZ_QUESTIONS,
  type QuizQuestion,
} from '../data/quiz';

interface UseQuizReturn {
  questions: QuizQuestion[];
  currentRound: number;
  myAnswer: string | null;
  partnerAnswer: string | null;
  bothRevealed: boolean;
  loading: boolean;
  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  nextRound: () => Promise<void>;
  resetGame: () => Promise<void>;
}

export function useQuiz(
  roomId: string | null,
  myPlayerNumber: 1 | 2 | null
): UseQuizReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [responses, setResponses] = useState<Map<string, GameResponse>>(new Map());
  const [loading, setLoading] = useState(false);

  const currentKey = `${currentRound}-${myPlayerNumber}`;
  const partnerKey = `${currentRound}-${myPlayerNumber === 1 ? 2 : 1}`;

  const myResponseData = responses.get(currentKey);
  const partnerResponseData = responses.get(partnerKey);

  const myAnswer = myResponseData?.response || null;
  const partnerAnswer = partnerResponseData?.response || null;
  const bothRevealed = !!myAnswer && !!partnerAnswer;

  // Iniciar juego - SOLO Player 1 genera preguntas
  const startGame = useCallback(async () => {
    if (!roomId || !myPlayerNumber) return;

    setLoading(true);

    // Verificar si ya hay preguntas guardadas
    const { data: room } = await supabase
      .from('rooms')
      .select('game_cards, game_round')
      .eq('id', roomId)
      .single();

    if (room?.game_cards && room.game_cards.length > 0) {
      // Ya hay preguntas, usarlas
      const savedQuestions = room.game_cards
        .map((id: string) => QUIZ_QUESTIONS.find((q) => q.id === id))
        .filter(Boolean) as QuizQuestion[];
      setQuestions(savedQuestions);
      setCurrentRound(room.game_round || 1);
    } else if (myPlayerNumber === 1) {
      // SOLO Player 1 genera nuevas preguntas
      const newQuestions = getRandomQuizQuestions(5);
      const questionIds = newQuestions.map((q) => q.id);

      await supabase
        .from('rooms')
        .update({ game_cards: questionIds, game_round: 1 })
        .eq('id', roomId);

      // Limpiar respuestas anteriores
      await supabase.from('game_responses').delete().eq('room_id', roomId);

      setQuestions(newQuestions);
      setCurrentRound(1);
    } else {
      // Player 2 espera a que Player 1 genere las preguntas
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: roomRetry } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (roomRetry?.game_cards && roomRetry.game_cards.length > 0) {
        const savedQuestions = roomRetry.game_cards
          .map((id: string) => QUIZ_QUESTIONS.find((q) => q.id === id))
          .filter(Boolean) as QuizQuestion[];
        setQuestions(savedQuestions);
        setCurrentRound(roomRetry.game_round || 1);
      }
    }

    setResponses(new Map());
    setLoading(false);
  }, [roomId, myPlayerNumber]);

  // Enviar respuesta
  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!roomId || !myPlayerNumber || questions.length === 0) return;

      const currentQuestion = questions[currentRound - 1];

      await supabase.from('game_responses').insert({
        room_id: roomId,
        player_number: myPlayerNumber,
        round: currentRound,
        card_id: currentQuestion.id,
        response: answer,
      });
    },
    [roomId, myPlayerNumber, currentRound, questions]
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

    setQuestions([]);
    setCurrentRound(1);
    setResponses(new Map());
  }, [roomId]);

  // Cargar preguntas al entrar si ya existen
  useEffect(() => {
    if (!roomId) return;

    const loadQuestions = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('game_cards, game_round')
        .eq('id', roomId)
        .single();

      if (room?.game_cards && room.game_cards.length > 0) {
        const savedQuestions = room.game_cards
          .map((id: string) => QUIZ_QUESTIONS.find((q) => q.id === id))
          .filter(Boolean) as QuizQuestion[];
        setQuestions(savedQuestions);
      }
      if (room?.game_round) {
        setCurrentRound(room.game_round);
      }
    };

    loadQuestions();
  }, [roomId]);

  // Suscripción a cambios en la sala (sincronizar ronda y preguntas)
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`quiz-room-sync:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const room = payload.new as { game_round?: number; game_cards?: string[] };

          if (room.game_round && room.game_round !== currentRound) {
            setCurrentRound(room.game_round);
          }

          if (room.game_cards && room.game_cards.length > 0 && questions.length === 0) {
            const savedQuestions = room.game_cards
              .map((id: string) => QUIZ_QUESTIONS.find((q) => q.id === id))
              .filter(Boolean) as QuizQuestion[];
            setQuestions(savedQuestions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, currentRound, questions.length]);

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
        data.forEach((r) => {
          newResponses.set(`${r.round}-${r.player_number}`, r);
        });
        setResponses(newResponses);
      }
    };

    loadResponses();

    // Suscripción a nuevas respuestas
    const channel = supabase
      .channel(`quiz:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_responses',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const response = payload.new as GameResponse;
          if (response) {
            setResponses((prev) => {
              const newMap = new Map(prev);
              newMap.set(`${response.round}-${response.player_number}`, response);
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
    questions,
    currentRound,
    myAnswer,
    partnerAnswer,
    bothRevealed,
    loading,
    startGame,
    submitAnswer,
    nextRound,
    resetGame,
  };
}
