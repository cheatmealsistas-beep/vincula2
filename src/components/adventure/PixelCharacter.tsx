// Personajes estilo Pin y Pon en pixel art
// Cabezones, simpáticos, proporción 3:2 cabeza:cuerpo

interface PixelCharacterProps {
  characterId: string;
  position?: 'left' | 'right' | 'center';
  speaking?: boolean;
  className?: string;
}

// Definición de personajes con sus colores
const PIXEL_CHARACTERS: Record<string, {
  name: string;
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  accentColor: string;
  hairStyle: 'short' | 'long' | 'ponytail' | 'spiky' | 'curly' | 'bald';
}> = {
  luna: {
    name: 'Luna',
    skinColor: '#FFDBB4',
    hairColor: '#4A3728',
    shirtColor: '#FF6B9D',
    accentColor: '#FFB6C1',
    hairStyle: 'long',
  },
  sol: {
    name: 'Sol',
    skinColor: '#FFDBB4',
    hairColor: '#FFD93D',
    shirtColor: '#4A90D9',
    accentColor: '#87CEEB',
    hairStyle: 'short',
  },
  coral: {
    name: 'Coral',
    skinColor: '#E8B89D',
    hairColor: '#8B4513',
    shirtColor: '#FF4081',
    accentColor: '#FF8FB1',
    hairStyle: 'curly',
  },
  marino: {
    name: 'Marino',
    skinColor: '#FFDBB4',
    hairColor: '#2C1810',
    shirtColor: '#00BCD4',
    accentColor: '#4DD0E1',
    hairStyle: 'spiky',
  },
  violeta: {
    name: 'Violeta',
    skinColor: '#F5DEB3',
    hairColor: '#9D4EDD',
    shirtColor: '#9D8DF1',
    accentColor: '#DDA0DD',
    hairStyle: 'ponytail',
  },
  olivo: {
    name: 'Olivo',
    skinColor: '#D4A574',
    hairColor: '#1A1A1A',
    shirtColor: '#7BC67B',
    accentColor: '#98FB98',
    hairStyle: 'short',
  },
  alba: {
    name: 'Alba',
    skinColor: '#FFE4C4',
    hairColor: '#FF6347',
    shirtColor: '#FFD700',
    accentColor: '#FFEC8B',
    hairStyle: 'long',
  },
  noche: {
    name: 'Noche',
    skinColor: '#8D5524',
    hairColor: '#1A1A1A',
    shirtColor: '#483D8B',
    accentColor: '#6A5ACD',
    hairStyle: 'bald',
  },
};

// Componente de pelo según estilo
function PixelHair({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'long':
      return (
        <>
          {/* Pelo largo que baja por los lados */}
          <rect x="4" y="2" width="24" height="6" fill={color} />
          <rect x="2" y="4" width="4" height="16" fill={color} />
          <rect x="26" y="4" width="4" height="16" fill={color} />
          <rect x="6" y="0" width="20" height="4" fill={color} />
        </>
      );
    case 'ponytail':
      return (
        <>
          <rect x="6" y="0" width="20" height="4" fill={color} />
          <rect x="4" y="2" width="24" height="6" fill={color} />
          {/* Coleta */}
          <rect x="24" y="6" width="6" height="4" fill={color} />
          <rect x="28" y="8" width="4" height="8" fill={color} />
        </>
      );
    case 'spiky':
      return (
        <>
          <rect x="6" y="4" width="20" height="4" fill={color} />
          {/* Pinchos */}
          <rect x="8" y="0" width="4" height="6" fill={color} />
          <rect x="14" y="0" width="4" height="6" fill={color} />
          <rect x="20" y="0" width="4" height="6" fill={color} />
        </>
      );
    case 'curly':
      return (
        <>
          <rect x="4" y="2" width="24" height="6" fill={color} />
          <rect x="6" y="0" width="6" height="4" fill={color} />
          <rect x="14" y="0" width="4" height="4" fill={color} />
          <rect x="20" y="0" width="6" height="4" fill={color} />
          <rect x="2" y="6" width="4" height="8" fill={color} />
          <rect x="26" y="6" width="4" height="8" fill={color} />
        </>
      );
    case 'bald':
      return null;
    case 'short':
    default:
      return (
        <>
          <rect x="6" y="2" width="20" height="6" fill={color} />
          <rect x="8" y="0" width="16" height="4" fill={color} />
        </>
      );
  }
}

export function PixelCharacter({
  characterId,
  position = 'center',
  speaking = false,
  className = ''
}: PixelCharacterProps) {
  const character = PIXEL_CHARACTERS[characterId];

  if (!character) {
    // Personaje por defecto si no existe
    return null;
  }

  const { skinColor, hairColor, shirtColor, accentColor, hairStyle } = character;

  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: position === 'right' ? 'scaleX(-1)' : undefined,
      }}
    >
      {/* Bocadillo de hablar */}
      {speaking && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1"
          style={{ transform: position === 'right' ? 'scaleX(-1)' : undefined }}
        >
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      <svg
        viewBox="0 0 32 48"
        className="w-16 h-24 drop-shadow-lg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Cabeza - Grande estilo Pin y Pon */}
        <rect x="4" y="6" width="24" height="20" rx="2" fill={skinColor} />

        {/* Pelo */}
        <PixelHair style={hairStyle} color={hairColor} />

        {/* Orejas */}
        <rect x="2" y="12" width="4" height="6" fill={skinColor} />
        <rect x="26" y="12" width="4" height="6" fill={skinColor} />

        {/* Ojos - grandes y expresivos */}
        <rect x="8" y="12" width="6" height="6" fill="white" />
        <rect x="18" y="12" width="6" height="6" fill="white" />
        <rect x="10" y="14" width="3" height="3" fill="#2C1810" />
        <rect x="20" y="14" width="3" height="3" fill="#2C1810" />
        {/* Brillo en ojos */}
        <rect x="11" y="14" width="1" height="1" fill="white" />
        <rect x="21" y="14" width="1" height="1" fill="white" />

        {/* Mejillas sonrojadas */}
        <rect x="6" y="18" width="4" height="2" fill="#FFB6C1" opacity="0.6" />
        <rect x="22" y="18" width="4" height="2" fill="#FFB6C1" opacity="0.6" />

        {/* Boca sonriente */}
        <rect x="12" y="20" width="8" height="2" fill="#E57373" />
        <rect x="14" y="22" width="4" height="1" fill={skinColor} />

        {/* Cuerpo - Pequeño */}
        <rect x="8" y="26" width="16" height="12" rx="1" fill={shirtColor} />

        {/* Detalle camiseta */}
        <rect x="14" y="28" width="4" height="6" fill={accentColor} />

        {/* Brazos */}
        <rect x="4" y="28" width="6" height="8" fill={shirtColor} />
        <rect x="22" y="28" width="6" height="8" fill={shirtColor} />

        {/* Manos */}
        <rect x="4" y="34" width="4" height="4" fill={skinColor} />
        <rect x="24" y="34" width="4" height="4" fill={skinColor} />

        {/* Piernas */}
        <rect x="10" y="38" width="5" height="8" fill="#4A4A6A" />
        <rect x="17" y="38" width="5" height="8" fill="#4A4A6A" />

        {/* Zapatos */}
        <rect x="8" y="44" width="7" height="4" fill="#2C1810" />
        <rect x="17" y="44" width="7" height="4" fill="#2C1810" />
      </svg>
    </div>
  );
}

// Exportar lista de personajes para el selector
export const PIXEL_CHARACTER_IDS = Object.keys(PIXEL_CHARACTERS);
export const getPixelCharacterInfo = (id: string) => PIXEL_CHARACTERS[id];
