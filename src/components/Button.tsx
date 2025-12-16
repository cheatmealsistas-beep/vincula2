interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = `
    w-full py-3.5 px-5 rounded-2xl font-semibold text-base
    transition-all duration-200 ease-out
    disabled:opacity-80 disabled:cursor-not-allowed disabled:saturate-50
    active:scale-[0.97]
    min-h-[48px]
  `;

  const variants = {
    primary: `
      bg-gradient-to-br from-[#9D8DF1] to-[#FF4081]
      text-white shadow-soft
      hover:shadow-soft-lg hover:translate-y-[-1px]
    `,
    secondary: `
      bg-white/70 backdrop-blur-sm text-[var(--color-text)]
      border border-[var(--color-warm-gray)]
      hover:bg-white hover:shadow-soft
    `,
    ghost: `
      bg-transparent text-[var(--color-text)]
      hover:bg-white/50
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
