import { useState } from 'react';
import { Button, Input } from '../components';

interface JoinRoomProps {
  onJoin: (code: string) => void;
  onBack: () => void;
  error?: string;
}

export function JoinRoom({ onJoin, onBack, error }: JoinRoomProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 4) {
      onJoin(code.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Tu pareja te espera
          </h1>
          <p className="text-[var(--color-text)] opacity-70">
            Introduce el código que te han compartido
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            value={code}
            onChange={(val) => setCode(val.toUpperCase())}
            placeholder="LUNA42"
            maxLength={8}
            autoFocus
            centered
            className="text-2xl font-mono tracking-widest"
          />

          {error && (
            <p className="text-center text-[#D97706]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={code.trim().length < 4}
          >
            Entrar
          </Button>

          <Button variant="ghost" onClick={onBack}>
            Volver
          </Button>
        </form>
      </div>
    </div>
  );
}
