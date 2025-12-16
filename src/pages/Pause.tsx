import { useState } from 'react';
import { Button } from '../components';

interface PauseProps {
  onConfirm: (returnTime?: string) => void;
  onCancel: () => void;
}

export function Pause({ onConfirm, onCancel }: PauseProps) {
  const [returnTime, setReturnTime] = useState('');

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col justify-center text-center">
        <div className="text-6xl mb-6">🌙</div>

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">
          Está bien parar
        </h1>

        <p className="text-[var(--color-text)] opacity-70 mb-8">
          Tu pareja verá que necesitas un momento.
          <br />
          No es un adiós, es un respiro.
        </p>

        {/* Tiempo de retorno opcional */}
        <div className="bg-white rounded-2xl p-5 mb-6">
          <label className="block text-sm text-[var(--color-text)] opacity-60 mb-2 text-left">
            ¿Cuándo crees que volverás? (opcional)
          </label>
          <input
            type="text"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            placeholder="Ej: mañana por la noche, en un rato..."
            className="w-full p-3 rounded-xl bg-[var(--color-cream)] text-[var(--color-text)] placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        <p className="text-sm text-[var(--color-text)] opacity-50">
          Cuando vuelvas, solo tienes que entrar de nuevo.
        </p>
      </div>

      <div className="space-y-3">
        <Button onClick={() => onConfirm(returnTime || undefined)}>
          Necesito este momento
        </Button>

        <Button variant="ghost" onClick={onCancel}>
          Mejor no, sigo aquí
        </Button>
      </div>
    </div>
  );
}
