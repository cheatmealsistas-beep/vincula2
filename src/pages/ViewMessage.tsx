import { Button } from '../components';

interface Message {
  type: string;
  prompt: string;
  content: string;
}

interface ViewMessageProps {
  message: Message;
  onClose: () => void;
}

export function ViewMessage({ message, onClose }: ViewMessageProps) {
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
      </div>

      {/* Cerrar */}
      <Button onClick={onClose}>
        Entendido
      </Button>
    </div>
  );
}
