// @ts-nocheck
import type { MapEvent, Avatar } from '../data/adventure';

interface Position {
  x: number;
  y: number;
}

interface AdventureMapProps {
  events: MapEvent[];
  currentEventId: string | null;
  completedEventIds: string[];
  myAvatar: Avatar;
  partnerAvatar: Avatar;
  myPosition: Position;
  partnerPosition: Position;
  onMoveToEvent: (eventId: string) => void;
}

export function AdventureMap({
  events,
  currentEventId,
  completedEventIds,
  myAvatar,
  partnerAvatar,
  myPosition,
  partnerPosition,
  onMoveToEvent,
}: AdventureMapProps) {
  const getEventConnections = () => {
    const sortedEvents = [...events].sort((a, b) => b.y - a.y);
    const connections: { from: MapEvent; to: MapEvent }[] = [];
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      connections.push({ from: sortedEvents[i], to: sortedEvents[i + 1] });
    }
    return connections;
  };

  const connections = getEventConnections();

  const isEventAccessible = (event: MapEvent) => {
    const sortedEvents = [...events].sort((a, b) => b.y - a.y);
    const eventIndex = sortedEvents.findIndex((e) => e.id === event.id);
    if (eventIndex === 0) return true;
    const previousEvent = sortedEvents[eventIndex - 1];
    return completedEventIds.includes(previousEvent.id);
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#E8F4F8] via-[#F0E8F8] to-[#F8E8F0] rounded-3xl overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 text-4xl">🌳</div>
        <div className="absolute top-8 right-8 text-3xl">☁️</div>
        <div className="absolute bottom-20 left-8 text-3xl">🌸</div>
        <div className="absolute bottom-10 right-4 text-4xl">🏠</div>
      </div>

      {/* Líneas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(({ from, to }, index) => (
          <line
            key={index}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke={completedEventIds.includes(from.id) ? '#FF6B6B' : '#D1D5DB'}
            strokeWidth="3"
            strokeDasharray={completedEventIds.includes(from.id) ? '0' : '8 4'}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Eventos */}
      {events.map((event) => {
        const isCompleted = completedEventIds.includes(event.id);
        const isCurrent = currentEventId === event.id;
        const accessible = isEventAccessible(event);

        return (
          <button
            key={event.id}
            onClick={() => accessible && onMoveToEvent(event.id)}
            disabled={!accessible}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isCurrent
                ? 'bg-[var(--color-coral)] scale-125 shadow-xl ring-4 ring-[var(--color-coral)]/30'
                : isCompleted
                  ? 'bg-green-400 shadow-md'
                  : accessible
                    ? 'bg-white shadow-lg hover:scale-110'
                    : 'bg-gray-200 opacity-60'
              }
            `}
            style={{ left: `${event.x}%`, top: `${event.y}%` }}
          >
            <span className="text-xl">{isCompleted ? '✓' : event.emoji}</span>
          </button>
        );
      })}

      {/* Partner avatar */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10"
        style={{ left: `${partnerPosition.x}%`, top: `${partnerPosition.y}%` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          style={{ backgroundColor: partnerAvatar.color }}
        >
          <span className="text-lg">{partnerAvatar.emoji}</span>
        </div>
      </div>

      {/* Mi avatar */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20"
        style={{ left: `${myPosition.x}%`, top: `${myPosition.y}%` }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl border-2 border-white"
          style={{ backgroundColor: myAvatar.color }}
        >
          <span className="text-xl">{myAvatar.emoji}</span>
        </div>
      </div>
    </div>
  );
}
