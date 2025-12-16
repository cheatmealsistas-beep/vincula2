import { useState } from 'react';
import { Button } from '../components';

interface LeaveMessageProps {
  onSend: (type: string, content: string) => void;
  onBack: () => void;
}

const MESSAGE_TYPES = [
  { id: 'feel', prompt: 'Hoy me siento...', placeholder: 'cansado/a, feliz, agobiado/a...' },
  { id: 'need', prompt: 'Necesitaría...', placeholder: 'un abrazo, silencio, hablar...' },
  { id: 'thanks', prompt: 'Gracias por...', placeholder: 'escucharme, estar ahí...' },
  { id: 'sorry', prompt: 'Perdona por...', placeholder: 'lo de antes, no haber dicho...' },
  { id: 'free', prompt: 'Quiero decirte que...', placeholder: 'lo que quieras' },
];

export function LeaveMessage({ onSend, onBack }: LeaveMessageProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const selectedMessage = MESSAGE_TYPES.find((m) => m.id === selectedType);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const maxWords = 20;
  const isOverLimit = wordCount > maxWords;

  const handleSend = () => {
    if (selectedType && content.trim() && !isOverLimit) {
      onSend(selectedType, content.trim());
    }
  };

  // Paso 1: Elegir tipo
  if (!selectedType) {
    return (
      <div className="min-h-screen flex flex-col px-6 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-[var(--color-text)] opacity-50 text-sm mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            ¿Qué quieres decir?
          </h1>
          <p className="text-[var(--color-text)] opacity-70 mt-2">
            Elige cómo empezar. Tu pareja lo verá cuando entre.
          </p>
        </div>

        <div className="space-y-3">
          {MESSAGE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="w-full text-left p-4 bg-white rounded-2xl border-2 border-transparent hover:border-[var(--color-coral)] transition-colors"
            >
              <span className="text-lg text-[var(--color-text)]">
                {type.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Paso 2: Escribir mensaje
  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => setSelectedType(null)}
          className="text-[var(--color-text)] opacity-50 text-sm mb-4"
        >
          ← Cambiar
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {selectedMessage?.prompt}
        </h1>
      </div>

      <div className="flex-1">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedMessage?.placeholder}
            rows={5}
            autoFocus
            className={`
              w-full p-4 rounded-2xl bg-white
              text-[var(--color-text)] text-lg
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/50
              resize-none
              ${isOverLimit ? 'ring-2 ring-amber-500' : ''}
            `}
          />
          <span
            className={`
              absolute bottom-3 right-4 text-sm
              ${isOverLimit ? 'text-amber-600' : 'text-gray-400'}
            `}
          >
            {wordCount}/{maxWords}
          </span>
        </div>

        <p className="text-sm text-[var(--color-text)] opacity-50 mt-3 text-center">
          Esto no se envía hasta que pulses el botón
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <Button onClick={handleSend} disabled={!content.trim() || isOverLimit}>
          Dejar mensaje
        </Button>

        <Button variant="ghost" onClick={onBack}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
