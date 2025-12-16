import { Button } from '../components';

interface Message {
  type: string;
  prompt: string;
  content: string;
  gesture?: string;
}

interface ViewMessageProps {
  message: Message;
  onGesture: (gesture: string) => void;
  onClose: () => void;
}

const GESTURES = [
  { emoji: '💜', label: 'Te quiero' },
  { emoji: '🫂', label: 'Te abrazo' },
  { emoji: '👀', label: 'Te leo' },
  { emoji: '🙏', label: 'Gracias' },
  { emoji: '💭', label: 'Lo pienso' },
];

export function ViewMessage({ message, onGesture, onClose }: ViewMessageProps) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Mensaje */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-[var(--color-lavender)] rounded-3xl p-6 mb-8">
          <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">
            Tu pareja dice:
          </p>
          <h2 className="text-xl font-medium text-[var(--color-text)] mb-3">
            {message.prompt}
          </h2>
          <p className="text-lg text-[var(--color-text)]">{message.content}</p>
        </div>

        {/* Gestos de respuesta */}
        {!message.gesture && (
          <div>
            <p className="text-center text-sm text-[var(--color-text)] opacity-60 mb-4">
              ¿Quieres responder con un gesto?
            </p>
            <div className="flex justify-center gap-3">
              {GESTURES.map((g) => (
                <button
                  key={g.emoji}
                  onClick={() => onGesture(g.emoji)}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95"
                  title={g.label}
                >
                  {g.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gesto ya enviado */}
        {message.gesture && (
          <div className="text-center">
            <p className="text-sm text-[var(--color-text)] opacity-60 mb-2">
              Respondiste con
            </p>
            <span className="text-4xl">{message.gesture}</span>
          </div>
        )}
      </div>

      {/* Cerrar */}
      <Button variant="ghost" onClick={onClose}>
        Volver a la sala
      </Button>
    </div>
  );
}
