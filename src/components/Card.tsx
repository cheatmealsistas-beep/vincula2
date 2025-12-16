import type { CardType } from '../types';

interface CardProps {
  type: CardType;
  prompt: string;
  children?: React.ReactNode;
  className?: string;
}

const cardColors: Record<CardType, string> = {
  express: 'bg-[var(--color-peach)]',
  listen: 'bg-[var(--color-mint)]',
  repair: 'bg-[var(--color-lavender)]',
  pause: 'bg-[var(--color-warm-gray)]',
};

const cardLabels: Record<CardType, string> = {
  express: 'Expresar',
  listen: 'Escuchar',
  repair: 'Reparar',
  pause: 'Pausa',
};

export function Card({ type, prompt, children, className = '' }: CardProps) {
  return (
    <div
      className={`
        ${cardColors[type]}
        rounded-3xl p-6
        shadow-sm
        ${className}
      `}
    >
      <span className="text-sm font-medium text-[var(--color-text)] opacity-60 uppercase tracking-wide">
        {cardLabels[type]}
      </span>
      <h2 className="text-2xl font-semibold text-[var(--color-text)] mt-2 mb-4">
        {prompt}
      </h2>
      {children}
    </div>
  );
}
