import { Button } from '../components';
import logoSvg from '/logo.svg';

interface HomeProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full animate-fade-up">
        {/* Logo / Título */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={logoSvg} alt="vincula2" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2 tracking-tight">
            vincula<span className="bg-gradient-to-br from-[#9D8DF1] to-[#FF4081] bg-clip-text text-transparent">2</span>
          </h1>
          <p className="text-[var(--color-text)] opacity-70">
            Juegos para parejas
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <Button onClick={onCreateRoom}>
            ¡Empezar!
          </Button>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-[var(--color-cream)] px-3 text-xs text-gray-500">
              o si te han invitado
            </span>
          </div>

          <Button variant="secondary" onClick={onJoinRoom}>
            Tengo un código
          </Button>
        </div>

        {/* Nota sutil */}
        <p className="text-center text-xs text-[var(--color-text)] opacity-50 mt-12">
          Sin cuenta. Sin historial. Solo vosotros dos.
        </p>
      </div>
    </div>
  );
}
