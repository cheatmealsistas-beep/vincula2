import { useRef, useEffect, useState, useCallback } from 'react';

interface DrawCanvasProps {
  onDrawingChange: (dataUrl: string) => void;
  disabled?: boolean;
  remoteDrawing?: string; // Para mostrar el dibujo del otro jugador
}

export function DrawCanvas({ onDrawingChange, disabled, remoteDrawing }: DrawCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const colors = ['#000000', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Mostrar dibujo remoto
  useEffect(() => {
    if (!remoteDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = remoteDrawing;
  }, [remoteDrawing]);

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    lastPoint.current = coords;
  }, [disabled, getCoordinates]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPoint.current) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPoint.current = coords;
  }, [isDrawing, disabled, color, brushSize, getCoordinates]);

  const stopDrawing = useCallback(() => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      lastPoint.current = null;
      // Enviar el dibujo actualizado - usar JPEG con compresión para reducir tamaño
      onDrawingChange(canvasRef.current.toDataURL('image/jpeg', 0.6));
    }
  }, [isDrawing, onDrawingChange]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onDrawingChange(canvas.toDataURL('image/jpeg', 0.6));
  }, [onDrawingChange]);

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-soft">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full aspect-square touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {disabled && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <p className="text-[var(--color-text)] opacity-50 text-sm">
              Esperando dibujo...
            </p>
          </div>
        )}
      </div>

      {/* Controles (solo si no está deshabilitado) */}
      {!disabled && (
        <div className="flex items-center justify-between gap-2">
          {/* Colores */}
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-110 ring-2 ring-offset-1 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Tamaño del pincel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBrushSize(2)}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                brushSize === 2 ? 'bg-gray-200' : ''
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            </button>
            <button
              onClick={() => setBrushSize(4)}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                brushSize === 4 ? 'bg-gray-200' : ''
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
            </button>
            <button
              onClick={() => setBrushSize(8)}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                brushSize === 8 ? 'bg-gray-200' : ''
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-gray-600" />
            </button>
          </div>

          {/* Borrar */}
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}
