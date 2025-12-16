// Iconos SVG ilustrados para los juegos - estilo minimalista pareja

export function CardsIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dos cartas superpuestas - una de cada persona */}
      <rect x="6" y="8" width="16" height="22" rx="3" fill="#9D8DF1" transform="rotate(-6 6 8)" />
      <rect x="18" y="10" width="16" height="22" rx="3" fill="#FF4081" transform="rotate(6 18 10)" />
      {/* Corazón pequeño donde se unen */}
      <circle cx="20" cy="20" r="3" fill="white" />
    </svg>
  );
}

export function WouldYouRatherIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dos burbujas de diálogo enfrentadas */}
      <path d="M6 12C6 8 9 6 14 6C19 6 22 8 22 12C22 16 19 18 14 18C12 18 10 18 8 20L9 17C7 16 6 14 6 12Z"
        fill="#9D8DF1" />
      <path d="M34 22C34 18 31 16 26 16C21 16 18 18 18 22C18 26 21 28 26 28C28 28 30 28 32 30L31 27C33 26 34 24 34 22Z"
        fill="#FF4081" />
    </svg>
  );
}

export function QuizIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dos cabezas pensando juntas */}
      <circle cx="13" cy="18" r="9" fill="#9D8DF1" />
      <circle cx="27" cy="18" r="9" fill="#FF4081" />
      {/* Signos de interrogación */}
      <text x="10" y="22" fill="white" fontSize="10" fontWeight="bold">?</text>
      <text x="24" y="22" fill="white" fontSize="10" fontWeight="bold">?</text>
    </svg>
  );
}

export function DrawIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lápiz (quien dibuja) */}
      <path d="M8 32L12 18L18 24L8 32Z" fill="#9D8DF1" />
      <path d="M12 18L26 4L32 10L18 24L12 18Z" fill="#9D8DF1" opacity="0.7" />
      <path d="M26 4L32 10L34 8L28 2L26 4Z" fill="#9D8DF1" />
      {/* Ojo (quien adivina) */}
      <ellipse cx="30" cy="28" rx="7" ry="5" fill="#FF4081" />
      <circle cx="30" cy="28" r="2.5" fill="white" />
    </svg>
  );
}

export function AdventureIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dos figuras cogidas de la mano */}
      {/* Persona 1 */}
      <circle cx="12" cy="10" r="5" fill="#9D8DF1" />
      <path d="M12 15L12 25L8 34" stroke="#9D8DF1" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 25L16 34" stroke="#9D8DF1" strokeWidth="3" strokeLinecap="round" />
      {/* Persona 2 */}
      <circle cx="28" cy="10" r="5" fill="#FF4081" />
      <path d="M28 15L28 25L24 34" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 25L32 34" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" />
      {/* Manos unidas */}
      <path d="M12 18L20 20L28 18" stroke="#4A4A6A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function MirrorIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dos caras reflejadas */}
      <circle cx="12" cy="16" r="7" fill="#9D8DF1" />
      <circle cx="28" cy="16" r="7" fill="#FF4081" />
      {/* Línea de espejo */}
      <line x1="20" y1="6" x2="20" y2="34" stroke="#4A4A6A" strokeWidth="2" strokeDasharray="3 2" />
      {/* Corazones pequeños */}
      <circle cx="12" cy="28" r="3" fill="#9D8DF1" opacity="0.5" />
      <circle cx="28" cy="28" r="3" fill="#FF4081" opacity="0.5" />
    </svg>
  );
}

export function TimelineIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Línea temporal horizontal */}
      <line x1="6" y1="20" x2="34" y2="20" stroke="#4A4A6A" strokeWidth="2" strokeLinecap="round" />
      {/* Puntos en la línea - momentos compartidos */}
      <circle cx="10" cy="20" r="4" fill="#9D8DF1" />
      <circle cx="20" cy="20" r="4" fill="#FF4081" />
      <circle cx="30" cy="20" r="4" fill="#9D8DF1" />
      {/* Corazón arriba */}
      <circle cx="20" cy="10" r="3" fill="#FF4081" opacity="0.6" />
    </svg>
  );
}

export function TimeCardsIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Reloj de arena estilizado */}
      <path d="M10 6H30V14L20 20L10 14V6Z" fill="#9D8DF1" />
      <path d="M10 34H30V26L20 20L10 26V34Z" fill="#FF4081" />
      {/* Líneas de marco */}
      <line x1="8" y1="6" x2="32" y2="6" stroke="#4A4A6A" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="34" x2="32" y2="34" stroke="#4A4A6A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CalmIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Olas calmantes */}
      <path d="M4 24C8 20 12 24 16 20C20 16 24 20 28 16C32 12 36 16 40 12" stroke="#9D8DF1" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M4 30C8 26 12 30 16 26C20 22 24 26 28 22C32 18 36 22 40 18" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Círculo central - respiración */}
      <circle cx="20" cy="14" r="6" fill="#9D8DF1" opacity="0.5" />
      <circle cx="20" cy="14" r="3" fill="#FF4081" />
    </svg>
  );
}

export function LovePhrasesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sobre de carta de amor */}
      <rect x="5" y="10" width="30" height="22" rx="3" fill="#9D8DF1" />
      {/* Solapa del sobre */}
      <path d="M5 13L20 24L35 13" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Corazón saliendo */}
      <path d="M20 8C20 8 16 4 13 6C10 8 12 12 20 18C28 12 30 8 27 6C24 4 20 8 20 8Z" fill="#FF4081" />
    </svg>
  );
}

export function RandomPlanIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dado */}
      <rect x="8" y="8" width="24" height="24" rx="4" fill="#9D8DF1" />
      {/* Puntos del dado */}
      <circle cx="14" cy="14" r="2.5" fill="white" />
      <circle cx="26" cy="14" r="2.5" fill="white" />
      <circle cx="20" cy="20" r="2.5" fill="#FF4081" />
      <circle cx="14" cy="26" r="2.5" fill="white" />
      <circle cx="26" cy="26" r="2.5" fill="white" />
    </svg>
  );
}

// Mapa de iconos por ID de juego
export const gameIconMap: Record<string, React.FC<{ className?: string }>> = {
  cards: CardsIcon,
  wouldyourather: WouldYouRatherIcon,
  quiz: QuizIcon,
  draw: DrawIcon,
  adventure: AdventureIcon,
  mirror: MirrorIcon,
  timeline: TimelineIcon,
  timecards: TimeCardsIcon,
  calm: CalmIcon,
  lovephrases: LovePhrasesIcon,
  randomplan: RandomPlanIcon,
};

export function GameIcon({ gameId, className = "w-8 h-8" }: { gameId: string; className?: string }) {
  const Icon = gameIconMap[gameId];
  if (!Icon) return null;
  return <Icon className={className} />;
}
