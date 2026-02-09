import confetti from 'canvas-confetti';

// Corazones flotantes cuando coinciden
export function celebrateMatch() {
  const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });

  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    shapes: [heart],
    scalar: 2,
    ticks: 200,
    gravity: 0.8,
    drift: 0,
  });

  // Segunda ráfaga con delay
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 80,
      origin: { y: 0.6 },
      shapes: [heart],
      scalar: 2,
      ticks: 200,
      gravity: 0.8,
    });
  }, 150);
}

// Animación "oops" suave cuando no coinciden
// Devuelve true para indicar que se debe aplicar la clase de shake
export function triggerOops(): { emoji: string; message: string } {
  const oopsOptions = [
    { emoji: '🙈', message: '¡Ups! Pensáis diferente' },
    { emoji: '😅', message: '¡Casi! Pero no del todo' },
    { emoji: '🤭', message: '¡Vaya! Cada uno a lo suyo' },
    { emoji: '💭', message: 'Mentes distintas...' },
    { emoji: '🌈', message: '¡Diversidad de opiniones!' },
  ];

  return oopsOptions[Math.floor(Math.random() * oopsOptions.length)];
}

// Confetti genérico para celebraciones finales
export function celebrateFinish() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}
