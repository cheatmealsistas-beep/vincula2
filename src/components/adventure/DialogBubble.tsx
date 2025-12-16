// Bocadillo de diálogo estilo RPG pixel art

interface DialogBubbleProps {
  text: string;
  position?: 'left' | 'right' | 'center';
  variant?: 'speak' | 'think' | 'exclaim';
  className?: string;
}

export function DialogBubble({
  text,
  position = 'center',
  variant = 'speak',
  className = '',
}: DialogBubbleProps) {
  // Estilos según variante
  const variantStyles = {
    speak: {
      bg: 'bg-white',
      border: 'border-[#4A4A6A]',
      textColor: 'text-[#4A4A6A]',
    },
    think: {
      bg: 'bg-blue-50',
      border: 'border-[#4A90D9]',
      textColor: 'text-[#4A90D9]',
    },
    exclaim: {
      bg: 'bg-yellow-50',
      border: 'border-[#FFD700]',
      textColor: 'text-[#4A4A6A]',
    },
  };

  const styles = variantStyles[variant];

  // Posición del pico del bocadillo
  const tailPosition = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4',
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        imageRendering: 'pixelated',
      }}
    >
      {/* Bocadillo principal - estilo pixel con bordes escalonados */}
      <div
        className={`
          relative px-4 py-3
          ${styles.bg} ${styles.textColor}
          border-4 ${styles.border}
          font-mono text-sm leading-relaxed
        `}
        style={{
          // Efecto pixel en bordes
          clipPath: `polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          )`,
        }}
      >
        {/* Decoración de esquinas pixel */}
        <div className={`absolute top-0 left-0 w-1 h-1 ${styles.bg}`} />
        <div className={`absolute top-0 right-0 w-1 h-1 ${styles.bg}`} />
        <div className={`absolute bottom-0 left-0 w-1 h-1 ${styles.bg}`} />
        <div className={`absolute bottom-0 right-0 w-1 h-1 ${styles.bg}`} />

        {/* Texto */}
        <p className="relative z-10">{text}</p>

        {/* Icono según variante */}
        {variant === 'exclaim' && (
          <span className="absolute -top-2 -right-2 text-lg">❗</span>
        )}
        {variant === 'think' && (
          <span className="absolute -top-2 -right-2 text-lg">💭</span>
        )}
      </div>

      {/* Cola del bocadillo - estilo pixel */}
      <div className={`absolute -bottom-3 ${tailPosition[position]}`}>
        {variant === 'think' ? (
          // Burbujas para pensamiento
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-3 h-3 rounded-full ${styles.bg} border-2 ${styles.border}`} />
            <div className={`w-2 h-2 rounded-full ${styles.bg} border-2 ${styles.border}`} />
          </div>
        ) : (
          // Triángulo pixelado para hablar
          <svg width="16" height="12" viewBox="0 0 16 12" className="drop-shadow-sm">
            <polygon
              points="0,0 16,0 8,12"
              fill={variant === 'exclaim' ? '#FEFCE8' : 'white'}
              stroke="#4A4A6A"
              strokeWidth="3"
            />
            <polygon
              points="2,0 14,0 8,8"
              fill={variant === 'exclaim' ? '#FEFCE8' : 'white'}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

// Bocadillo de NPC con estilo diferente
interface NPCBubbleProps {
  text: string;
  npcName?: string;
  className?: string;
}

export function NPCBubble({ text, npcName, className = '' }: NPCBubbleProps) {
  return (
    <div className={`relative ${className}`}>
      {npcName && (
        <div className="absolute -top-3 left-3 px-2 py-0.5 bg-[#9D8DF1] text-white text-xs font-bold rounded">
          {npcName}
        </div>
      )}
      <div
        className="
          px-4 py-3 pt-4
          bg-gradient-to-b from-[#F0E8F8] to-white
          border-4 border-[#9D8DF1]
          text-[#4A4A6A] font-mono text-sm
          shadow-lg
        "
        style={{
          clipPath: `polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          )`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
