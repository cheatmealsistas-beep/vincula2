// Hook para persistir la sesión en localStorage
// Evita perder la sala al refrescar el navegador

const SESSION_KEY = 'vincula2_session';

export type ScreenState =
  | 'home'
  | 'join'
  | 'share-invite'
  | 'game-select'
  | 'welcome-message'
  | 'waiting-game'
  | 'room'
  | 'game'
  | 'leave-message'
  | 'view-message'
  | 'pause'
  | 'end';

export interface SessionData {
  roomId: string;
  roomCode: string;
  playerNumber: 1 | 2;
  inviteMessage?: string;
  gameType?: string;
  currentScreen?: ScreenState;
  gameRound?: number;
  timestamp: number;
}

// Duración máxima de la sesión: 4 horas
const SESSION_DURATION = 4 * 60 * 60 * 1000;

export function saveSession(data: Omit<SessionData, 'timestamp'>): void {
  const session: SessionData = {
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: SessionData = JSON.parse(stored);

    // Verificar si la sesión ha expirado
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function updateSession(updates: Partial<Omit<SessionData, 'timestamp'>>): void {
  const current = getSession();
  if (current) {
    saveSession({
      ...current,
      ...updates,
    });
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
