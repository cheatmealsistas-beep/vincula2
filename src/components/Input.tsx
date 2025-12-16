interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
  centered?: boolean;
}

export function Input({
  value,
  onChange,
  placeholder = '',
  maxLength,
  autoFocus = false,
  className = '',
  centered = false,
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={`
        w-full py-4 px-5 rounded-2xl
        bg-white border-2 border-[var(--color-warm-gray)]
        text-[var(--color-text)] text-lg
        placeholder:text-gray-400
        focus:outline-none focus:border-[var(--color-coral)]
        transition-colors duration-150
        ${centered ? 'text-center' : ''}
        ${className}
      `}
    />
  );
}
