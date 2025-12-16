import { AVATARS } from '../data/adventure';
import { PixelCharacter, getPixelCharacterInfo } from './adventure/PixelCharacter';

interface AvatarSelectorProps {
  selectedId: string | null;
  partnerSelectedId: string | null;
  onSelect: (avatarId: string) => void;
}

export function AvatarSelector({ selectedId, partnerSelectedId, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        const isPartnerSelected = partnerSelectedId === avatar.id;
        const isDisabled = isPartnerSelected;
        const characterInfo = getPixelCharacterInfo(avatar.id);

        return (
          <button
            key={avatar.id}
            onClick={() => !isDisabled && onSelect(avatar.id)}
            disabled={isDisabled}
            className={`
              relative flex flex-col items-center justify-center p-2 rounded-2xl
              transition-all duration-200
              ${isSelected
                ? 'bg-[var(--color-coral)] scale-105 shadow-lg ring-2 ring-white'
                : isDisabled
                  ? 'bg-gray-100 opacity-40 cursor-not-allowed'
                  : 'bg-white/80 hover:bg-white hover:scale-105'
              }
            `}
          >
            <PixelCharacter characterId={avatar.id} className="mb-1" />
            <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-[var(--color-text)]'}`}>
              {characterInfo?.name || avatar.name}
            </span>

            {isPartnerSelected && (
              <span className="absolute -top-1 -right-1 text-xs bg-pink-400 text-white px-1.5 py-0.5 rounded-full">
                💕
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
