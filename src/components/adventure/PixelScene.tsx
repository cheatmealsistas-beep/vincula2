// @ts-nocheck
// Escenarios pixel art para las aventuras
import React from 'react';
import type { ReactNode } from 'react';

interface PixelSceneProps {
  sceneId: string;
  children?: ReactNode;
  className?: string;
}

// Componentes de elementos pixel reutilizables
function PixelCloud({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <rect x="8" y="8" width="32" height="16" fill="white" />
      <rect x="4" y="12" width="8" height="8" fill="white" />
      <rect x="36" y="12" width="8" height="8" fill="white" />
      <rect x="12" y="4" width="12" height="8" fill="white" />
      <rect x="28" y="4" width="8" height="8" fill="white" />
    </g>
  );
}

function _PixelTree({ x, y, variant = 'round' }: { x: number; y: number; variant?: 'round' | 'pine' }) {
  if (variant === 'pine') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect x="14" y="32" width="8" height="16" fill="#8B4513" />
        <polygon points="18,0 36,32 0,32" fill="#228B22" />
        <polygon points="18,12 32,36 4,36" fill="#2E8B2E" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="12" y="28" width="8" height="20" fill="#8B4513" />
      <ellipse cx="16" cy="16" rx="16" ry="18" fill="#228B22" />
      <ellipse cx="12" cy="14" rx="4" ry="4" fill="#2E8B2E" />
      <ellipse cx="20" cy="12" rx="3" ry="3" fill="#32CD32" />
    </g>
  );
}

function PixelBush({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="12" cy="12" rx="12" ry="10" fill="#228B22" />
      <ellipse cx="8" cy="10" rx="4" ry="4" fill="#32CD32" />
      <circle cx="6" cy="14" r="2" fill="#FF6B6B" />
      <circle cx="16" cy="10" r="2" fill="#FF6B6B" />
    </g>
  );
}

function PixelFloor({ color = '#7BC67B', pattern = 'grass' }: { color?: string; pattern?: string }) {
  return (
    <g>
      <rect x="0" y="200" width="400" height="80" fill={color} />
      {pattern === 'grass' && (
        <>
          {[...Array(20)].map((_, i) => (
            <rect key={i} x={i * 20 + 5} y="198" width="2" height="6" fill="#228B22" />
          ))}
        </>
      )}
      {pattern === 'tiles' && (
        <>
          {[...Array(10)].map((_, i) => (
            <rect key={i} x={i * 40} y="200" width="40" height="80" stroke="#666" strokeWidth="1" fill="none" />
          ))}
        </>
      )}
    </g>
  );
}

// Escena: Entrada del Supermercado
function SupermarketEntrance() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Cielo */}
      <rect x="0" y="0" width="400" height="200" fill="#87CEEB" />

      {/* Nubes */}
      <PixelCloud x={40} y={20} size={0.8} />
      <PixelCloud x={280} y={40} size={0.6} />

      {/* Edificio supermercado */}
      <rect x="50" y="60" width="300" height="140" fill="#F5F5DC" />
      <rect x="50" y="50" width="300" height="20" fill="#E74C3C" />

      {/* Cartel "SUPER" */}
      <rect x="120" y="55" width="160" height="40" fill="#FFD700" />
      <text x="200" y="85" textAnchor="middle" fill="#E74C3C" fontSize="24" fontWeight="bold" fontFamily="monospace">
        SUPER
      </text>

      {/* Puertas automáticas */}
      <rect x="150" y="120" width="45" height="80" fill="#4A90D9" opacity="0.7" />
      <rect x="205" y="120" width="45" height="80" fill="#4A90D9" opacity="0.7" />
      <rect x="195" y="120" width="10" height="80" fill="#666" />

      {/* Ventanas */}
      <rect x="70" y="80" width="60" height="50" fill="#87CEEB" opacity="0.8" />
      <rect x="270" y="80" width="60" height="50" fill="#87CEEB" opacity="0.8" />

      {/* Carrito en la entrada */}
      <g transform="translate(290, 160)">
        <rect x="0" y="0" width="30" height="20" fill="#C0C0C0" />
        <rect x="2" y="-10" width="26" height="12" fill="#C0C0C0" stroke="#999" />
        <circle cx="5" cy="22" r="4" fill="#666" />
        <circle cx="25" cy="22" r="4" fill="#666" />
      </g>

      {/* Suelo */}
      <rect x="0" y="200" width="400" height="80" fill="#808080" />
      <rect x="0" y="200" width="400" height="4" fill="#666" />

      {/* Líneas de parking */}
      {[...Array(5)].map((_, i) => (
        <rect key={i} x={i * 80 + 30} y="220" width="4" height="40" fill="#FFD700" />
      ))}
    </svg>
  );
}

// Escena: Sección de Congelados
function FrozenAisle() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo pasillo */}
      <rect x="0" y="0" width="400" height="280" fill="#E8F4F8" />

      {/* Techo con luces */}
      <rect x="0" y="0" width="400" height="30" fill="#333" />
      {[...Array(4)].map((_, i) => (
        <rect key={i} x={i * 100 + 30} y="20" width="40" height="8" fill="#FFFACD" />
      ))}

      {/* Neveras a ambos lados */}
      {[0, 1, 2].map((i) => (
        <g key={`left-${i}`} transform={`translate(${10 + i * 60}, 50)`}>
          <rect x="0" y="0" width="50" height="120" fill="#4A90D9" />
          <rect x="5" y="5" width="40" height="50" fill="#B8E1FF" opacity="0.8" />
          <rect x="5" y="60" width="40" height="50" fill="#B8E1FF" opacity="0.8" />
          {/* Escarcha */}
          <rect x="8" y="8" width="8" height="4" fill="white" opacity="0.9" />
          <rect x="20" y="15" width="6" height="3" fill="white" opacity="0.9" />
          <rect x="30" y="10" width="10" height="4" fill="white" opacity="0.9" />
        </g>
      ))}

      {[0, 1, 2].map((i) => (
        <g key={`right-${i}`} transform={`translate(${200 + i * 60}, 50)`}>
          <rect x="0" y="0" width="50" height="120" fill="#4A90D9" />
          <rect x="5" y="5" width="40" height="50" fill="#B8E1FF" opacity="0.8" />
          <rect x="5" y="60" width="40" height="50" fill="#B8E1FF" opacity="0.8" />
          {/* Productos congelados */}
          <rect x="10" y="70" width="12" height="15" fill="#FFB6C1" />
          <rect x="25" y="70" width="12" height="15" fill="#98FB98" />
        </g>
      ))}

      {/* Copos de nieve flotando */}
      {[...Array(12)].map((_, i) => (
        <text
          key={i}
          x={30 + (i % 4) * 100}
          y={100 + Math.floor(i / 4) * 50}
          fontSize="16"
          fill="#B8E1FF"
          opacity="0.8"
        >
          ❄
        </text>
      ))}

      {/* Pingüino NPC */}
      <g transform="translate(180, 140)">
        {/* Cuerpo */}
        <ellipse cx="20" cy="35" rx="18" ry="25" fill="#1A1A2E" />
        <ellipse cx="20" cy="38" rx="12" ry="18" fill="white" />
        {/* Cabeza */}
        <circle cx="20" cy="12" r="14" fill="#1A1A2E" />
        {/* Ojos */}
        <circle cx="14" cy="10" r="4" fill="white" />
        <circle cx="26" cy="10" r="4" fill="white" />
        <circle cx="15" cy="11" r="2" fill="#1A1A2E" />
        <circle cx="27" cy="11" r="2" fill="#1A1A2E" />
        {/* Pico */}
        <polygon points="20,14 16,20 24,20" fill="#FFA500" />
        {/* Patas */}
        <ellipse cx="12" cy="62" rx="8" ry="4" fill="#FFA500" />
        <ellipse cx="28" cy="62" rx="8" ry="4" fill="#FFA500" />
      </g>

      {/* Suelo con nieve */}
      <rect x="0" y="200" width="400" height="80" fill="#F0F8FF" />
      <rect x="0" y="200" width="400" height="4" fill="#B8E1FF" />

      {/* Montículos de nieve */}
      {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx={i * 70 + 30} cy="210" rx="25" ry="10" fill="white" />
      ))}
    </svg>
  );
}

// Escena: Sección de Frutas
function FruitSection() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo */}
      <rect x="0" y="0" width="400" height="280" fill="#F0FFF0" />

      {/* Techo con hojas decorativas */}
      <rect x="0" y="0" width="400" height="40" fill="#228B22" />
      {[...Array(8)].map((_, i) => (
        <ellipse key={i} cx={i * 55 + 25} cy="45" rx="20" ry="15" fill="#32CD32" />
      ))}

      {/* Estanterías de frutas */}
      <g transform="translate(20, 70)">
        <rect x="0" y="0" width="160" height="100" fill="#8B4513" />
        {/* Manzanas */}
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx={15 + (i % 4) * 40} cy={20 + Math.floor(i / 4) * 40} r="14" fill="#E74C3C" />
        ))}
      </g>

      <g transform="translate(220, 70)">
        <rect x="0" y="0" width="160" height="100" fill="#8B4513" />
        {/* Naranjas */}
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx={15 + (i % 4) * 40} cy={20 + Math.floor(i / 4) * 40} r="14" fill="#FFA500" />
        ))}
      </g>

      {/* Frutas flotando mágicamente */}
      <g className="animate-bounce" style={{ animationDuration: '2s' }}>
        <circle cx="100" cy="50" r="12" fill="#E74C3C" />
        <circle cx="200" cy="40" r="10" fill="#FFD700" />
        <circle cx="300" cy="55" r="14" fill="#9370DB" />
      </g>

      {/* Estrellas mágicas */}
      {[...Array(6)].map((_, i) => (
        <text key={i} x={50 + i * 60} y={60 + (i % 2) * 30} fontSize="14" opacity="0.7">
          ✨
        </text>
      ))}

      {/* Suelo verde */}
      <rect x="0" y="200" width="400" height="80" fill="#90EE90" />
      <rect x="0" y="200" width="400" height="4" fill="#228B22" />
    </svg>
  );
}

// Escena: Panadería con Dragón
function BakeryDragon() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo cálido */}
      <rect x="0" y="0" width="400" height="280" fill="#FFF8DC" />

      {/* Horno grande */}
      <g transform="translate(250, 50)">
        <rect x="0" y="0" width="120" height="120" fill="#8B0000" rx="10" />
        <rect x="10" y="10" width="100" height="60" fill="#FF4500" />
        <rect x="20" y="80" width="80" height="30" fill="#2F2F2F" />
        {/* Fuego */}
        <polygon points="35,75 45,50 55,75" fill="#FF6B00" />
        <polygon points="55,75 65,45 75,75" fill="#FFD700" />
        <polygon points="75,75 85,55 95,75" fill="#FF6B00" />
      </g>

      {/* Estantería con pan */}
      <g transform="translate(20, 60)">
        <rect x="0" y="0" width="180" height="110" fill="#8B4513" />
        {/* Panes */}
        <ellipse cx="30" cy="25" rx="20" ry="12" fill="#DEB887" />
        <ellipse cx="80" cy="25" rx="25" ry="10" fill="#D2691E" />
        <ellipse cx="140" cy="25" rx="22" ry="12" fill="#DEB887" />
        <ellipse cx="50" cy="70" rx="30" ry="15" fill="#CD853F" />
        <ellipse cx="120" cy="70" rx="25" ry="12" fill="#DEB887" />
      </g>

      {/* Dragoncito */}
      <g transform="translate(140, 120)">
        {/* Cuerpo */}
        <ellipse cx="30" cy="40" rx="25" ry="20" fill="#50C878" />
        {/* Cabeza */}
        <circle cx="55" cy="25" r="20" fill="#50C878" />
        {/* Ojos */}
        <circle cx="50" cy="20" r="5" fill="white" />
        <circle cx="62" cy="20" r="5" fill="white" />
        <circle cx="51" cy="21" r="2" fill="#1A1A2E" />
        <circle cx="63" cy="21" r="2" fill="#1A1A2E" />
        {/* Cuernitos */}
        <polygon points="42,8 45,0 48,8" fill="#FFD700" />
        <polygon points="62,8 65,0 68,8" fill="#FFD700" />
        {/* Alitas */}
        <ellipse cx="15" cy="30" rx="15" ry="10" fill="#3CB371" />
        {/* Colita */}
        <path d="M 5 40 Q -10 50, 0 60" stroke="#50C878" strokeWidth="8" fill="none" />
        {/* Fueguito de la boca */}
        <polygon points="75,25 90,20 90,30 85,25" fill="#FF6B00" />
        <polygon points="85,25 95,22 95,28" fill="#FFD700" />
        {/* Gorro de chef */}
        <ellipse cx="55" cy="5" rx="15" ry="8" fill="white" />
        <rect x="45" y="2" width="20" height="8" fill="white" />
      </g>

      {/* Suelo de baldosas */}
      <rect x="0" y="200" width="400" height="80" fill="#DEB887" />
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={i * 50} y="200" width="50" height="80" stroke="#CD853F" strokeWidth="2" fill="none" />
      ))}
    </svg>
  );
}

// Escena: Pasillo del Amor
function LoveAisle() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo rosa */}
      <rect x="0" y="0" width="400" height="280" fill="#FFE4E1" />

      {/* Gradiente de corazones arriba */}
      <defs>
        <linearGradient id="loveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#FFB6C1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="60" fill="url(#loveGradient)" />

      {/* Corazones flotantes */}
      {[...Array(12)].map((_, i) => (
        <text
          key={i}
          x={20 + (i % 6) * 65}
          y={30 + Math.floor(i / 6) * 100 + (i % 3) * 20}
          fontSize={16 + (i % 3) * 6}
          fill="#FF1493"
          opacity={0.6 + (i % 3) * 0.2}
        >
          ❤
        </text>
      ))}

      {/* Estanterías con productos de amor */}
      <g transform="translate(30, 80)">
        <rect x="0" y="0" width="140" height="100" fill="#FFB6C1" rx="5" />
        {/* Bombones */}
        <rect x="10" y="10" width="40" height="30" fill="#8B0000" rx="3" />
        <rect x="60" y="10" width="40" height="30" fill="#FF1493" rx="3" />
        <rect x="110" y="10" width="20" height="30" fill="#8B0000" rx="3" />
        {/* Flores */}
        <circle cx="25" cy="70" r="15" fill="#FF69B4" />
        <circle cx="70" cy="70" r="12" fill="#FF1493" />
        <circle cx="110" cy="70" r="14" fill="#FF69B4" />
      </g>

      <g transform="translate(230, 80)">
        <rect x="0" y="0" width="140" height="100" fill="#FFB6C1" rx="5" />
        {/* Peluches */}
        <circle cx="35" cy="35" r="25" fill="#F5DEB3" />
        <circle cx="100" cy="40" r="20" fill="#FFB6C1" />
      </g>

      {/* Arco de corazones */}
      <path
        d="M 100 200 Q 200 100, 300 200"
        stroke="#FF1493"
        strokeWidth="8"
        fill="none"
        strokeDasharray="20 10"
      />

      {/* Suelo rosa */}
      <rect x="0" y="200" width="400" height="80" fill="#FFB6C1" />
      <rect x="0" y="200" width="400" height="4" fill="#FF69B4" />

      {/* Pétalos en el suelo */}
      {[...Array(10)].map((_, i) => (
        <ellipse
          key={i}
          cx={30 + i * 40}
          cy={220 + (i % 2) * 20}
          rx="8"
          ry="4"
          fill="#FF69B4"
          opacity="0.6"
          transform={`rotate(${i * 30}, ${30 + i * 40}, ${220 + (i % 2) * 20})`}
        />
      ))}
    </svg>
  );
}

// ============================================
// ESCENAS DE LA POCIÓN DE AMOR
// ============================================

// Escena: Cocina mágica con libro de pociones
function PotionKitchen() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo púrpura mágico */}
      <rect x="0" y="0" width="400" height="280" fill="#E8E0F0" />

      {/* Ventana con luna */}
      <rect x="250" y="30" width="100" height="80" fill="#1A1A2E" rx="5" />
      <circle cx="300" cy="60" r="20" fill="#FFFACD" />
      {[...Array(5)].map((_, i) => (
        <circle key={i} cx={260 + i * 20} cy={80} r="2" fill="#FFD700" opacity="0.8" />
      ))}

      {/* Estantería con frascos */}
      <rect x="20" y="40" width="180" height="120" fill="#8B4513" />
      {[...Array(6)].map((_, i) => (
        <g key={i} transform={`translate(${35 + (i % 3) * 55}, ${55 + Math.floor(i / 3) * 50})`}>
          <rect x="0" y="10" width="20" height="30" fill={['#9D4EDD', '#FF6B9D', '#00D9C0'][i % 3]} rx="3" />
          <rect x="5" y="5" width="10" height="8" fill="#8B4513" />
        </g>
      ))}

      {/* Libro de pociones flotando */}
      <g transform="translate(280, 140)">
        <rect x="0" y="0" width="60" height="45" fill="#8B0000" rx="3" />
        <rect x="5" y="5" width="50" height="35" fill="#FFFAF0" />
        <text x="30" y="28" textAnchor="middle" fill="#8B0000" fontSize="8" fontFamily="monospace">AMOR</text>
        {/* Brillo mágico */}
        <circle cx="30" cy="22" r="30" fill="#FFD700" opacity="0.2" />
      </g>

      {/* Mesa de trabajo */}
      <rect x="50" y="180" width="300" height="20" fill="#A0522D" />
      <rect x="60" y="175" width="280" height="8" fill="#8B4513" />

      {/* Suelo de piedra */}
      <rect x="0" y="200" width="400" height="80" fill="#696969" />
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={i * 50} y="200" width="50" height="80" stroke="#555" strokeWidth="2" fill="none" />
      ))}
    </svg>
  );
}

// Escena: Despensa con ingredientes
function PotionPantry() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo */}
      <rect x="0" y="0" width="400" height="280" fill="#F0E8F8" />

      {/* Estanterías con ingredientes */}
      <rect x="30" y="40" width="150" height="130" fill="#8B4513" />
      <rect x="220" y="40" width="150" height="130" fill="#8B4513" />

      {/* Pétalos de rosa */}
      <g transform="translate(50, 60)">
        {[...Array(5)].map((_, i) => (
          <ellipse key={i} cx={10 + i * 8} cy={15} rx="6" ry="10" fill="#FF69B4" transform={`rotate(${i * 20 - 40}, ${10 + i * 8}, 15)`} />
        ))}
      </g>

      {/* Chocolate */}
      <g transform="translate(50, 110)">
        <rect x="0" y="0" width="40" height="25" fill="#4A3728" rx="3" />
        <rect x="5" y="5" width="10" height="15" fill="#6B4423" />
        <rect x="18" y="5" width="10" height="15" fill="#6B4423" />
      </g>

      {/* Frasco de lágrimas */}
      <g transform="translate(110, 80)">
        <ellipse cx="15" cy="35" rx="15" ry="20" fill="#87CEEB" opacity="0.7" />
        <rect x="8" y="10" width="14" height="8" fill="#C0C0C0" />
        <text x="15" y="40" textAnchor="middle" fontSize="10">💧</text>
      </g>

      {/* Más ingredientes a la derecha */}
      <g transform="translate(240, 60)">
        <circle cx="20" cy="20" r="15" fill="#9D4EDD" opacity="0.8" />
        <circle cx="60" cy="25" r="12" fill="#00D9C0" />
        <circle cx="100" cy="20" r="18" fill="#FF6B9D" opacity="0.7" />
      </g>

      {/* Burbujas mágicas */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={50 + i * 45}
          cy={30 + (i % 3) * 15}
          r={4 + (i % 3) * 2}
          fill="#9D4EDD"
          opacity={0.3 + (i % 3) * 0.1}
        />
      ))}

      {/* Suelo */}
      <rect x="0" y="200" width="400" height="80" fill="#9D8DF1" opacity="0.3" />
    </svg>
  );
}

// Escena: Caldero burbujeante
function PotionCauldron() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo oscuro mágico */}
      <rect x="0" y="0" width="400" height="280" fill="#2D1B4E" />

      {/* Estrellas de fondo */}
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={20 + (i * 37) % 360}
          cy={20 + (i * 23) % 150}
          r="2"
          fill="#FFD700"
          opacity={0.5 + (i % 3) * 0.2}
        />
      ))}

      {/* Caldero grande */}
      <g transform="translate(120, 80)">
        {/* Base del caldero */}
        <ellipse cx="80" cy="100" rx="80" ry="30" fill="#1A1A2E" />
        <ellipse cx="80" cy="90" rx="70" ry="25" fill="#2F2F4F" />
        {/* Cuerpo */}
        <path d="M 10 50 Q 0 80, 20 100 L 140 100 Q 160 80, 150 50 Z" fill="#2F2F4F" />
        {/* Líquido burbujeante */}
        <ellipse cx="80" cy="55" rx="60" ry="20" fill="#FF69B4" />
        <ellipse cx="70" cy="50" rx="40" ry="12" fill="#FF1493" opacity="0.7" />
        {/* Burbujas */}
        <circle cx="50" cy="45" r="8" fill="#FFB6C1" opacity="0.8" />
        <circle cx="90" cy="40" r="6" fill="#FFB6C1" opacity="0.8" />
        <circle cx="110" cy="48" r="10" fill="#FFB6C1" opacity="0.6" />
        {/* Asas */}
        <ellipse cx="0" cy="60" rx="12" ry="20" fill="#2F2F4F" />
        <ellipse cx="160" cy="60" rx="12" ry="20" fill="#2F2F4F" />
      </g>

      {/* Fuego debajo */}
      <g transform="translate(140, 190)">
        <polygon points="20,30 30,0 40,30" fill="#FF6B00" />
        <polygon points="50,30 65,5 80,30" fill="#FFD700" />
        <polygon points="90,30 100,10 110,30" fill="#FF6B00" />
      </g>

      {/* Humo/vapor mágico */}
      {[...Array(5)].map((_, i) => (
        <ellipse
          key={i}
          cx={180 + i * 15 - 30}
          cy={60 - i * 12}
          rx={15 + i * 3}
          ry={8 + i * 2}
          fill="#9D4EDD"
          opacity={0.4 - i * 0.06}
        />
      ))}

      {/* Suelo */}
      <rect x="0" y="220" width="400" height="60" fill="#1A1A2E" />
    </svg>
  );
}

// Escena: Mesa para brindar
function PotionTable() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo cálido romántico */}
      <rect x="0" y="0" width="400" height="280" fill="#FFF0F5" />

      {/* Velas flotantes */}
      {[...Array(6)].map((_, i) => (
        <g key={i} transform={`translate(${50 + i * 60}, ${30 + (i % 2) * 20})`}>
          <rect x="0" y="10" width="8" height="20" fill="#FFFAF0" />
          <polygon points="4,-5 0,10 8,10" fill="#FFD700" />
          <circle cx="4" cy="0" r="6" fill="#FFA500" opacity="0.5" />
        </g>
      ))}

      {/* Mesa elegante */}
      <rect x="80" y="150" width="240" height="15" fill="#8B4513" />
      <rect x="90" y="165" width="10" height="50" fill="#8B4513" />
      <rect x="300" y="165" width="10" height="50" fill="#8B4513" />

      {/* Mantel */}
      <rect x="85" y="145" width="230" height="8" fill="#9D4EDD" />

      {/* Copas */}
      <g transform="translate(140, 100)">
        <polygon points="15,50 0,50 5,30 25,30 30,50" fill="#E0E0E0" />
        <rect x="13" y="25" width="4" height="8" fill="#E0E0E0" />
        <ellipse cx="15" cy="15" rx="12" ry="15" fill="#FF69B4" opacity="0.6" />
      </g>
      <g transform="translate(220, 100)">
        <polygon points="15,50 0,50 5,30 25,30 30,50" fill="#E0E0E0" />
        <rect x="13" y="25" width="4" height="8" fill="#E0E0E0" />
        <ellipse cx="15" cy="15" rx="12" ry="15" fill="#FF69B4" opacity="0.6" />
      </g>

      {/* Corazones flotantes */}
      {[...Array(8)].map((_, i) => (
        <text
          key={i}
          x={60 + i * 40}
          y={80 + (i % 3) * 20}
          fontSize={12 + (i % 3) * 4}
          fill="#FF1493"
          opacity={0.5 + (i % 3) * 0.15}
        >
          ❤
        </text>
      ))}

      {/* Suelo */}
      <rect x="0" y="215" width="400" height="65" fill="#DDA0DD" opacity="0.3" />
    </svg>
  );
}

// Escena: Final mágico con corazones
function PotionMagic() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo con gradiente mágico */}
      <defs>
        <linearGradient id="magicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9D4EDD" />
          <stop offset="50%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#FFB6C1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="280" fill="url(#magicGradient)" />

      {/* Explosión de corazones */}
      {[...Array(20)].map((_, i) => (
        <text
          key={i}
          x={50 + (i * 47) % 300}
          y={30 + (i * 31) % 200}
          fontSize={14 + (i % 4) * 6}
          fill="#FF1493"
          opacity={0.6 + (i % 3) * 0.15}
        >
          ❤
        </text>
      ))}

      {/* Estrellas brillantes */}
      {[...Array(15)].map((_, i) => (
        <text
          key={`star-${i}`}
          x={30 + (i * 53) % 340}
          y={40 + (i * 37) % 180}
          fontSize={10 + (i % 3) * 4}
          opacity={0.7}
        >
          ✨
        </text>
      ))}

      {/* Poción brillante en el centro */}
      <g transform="translate(160, 100)">
        <ellipse cx="40" cy="60" rx="35" ry="45" fill="#FFD700" opacity="0.3" />
        <ellipse cx="40" cy="60" rx="25" ry="35" fill="#FF69B4" />
        <ellipse cx="35" cy="50" rx="10" ry="15" fill="#FFB6C1" opacity="0.7" />
        {/* Rayos de luz */}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="40"
            y1="60"
            x2={40 + Math.cos(i * Math.PI / 4) * 60}
            y2={60 + Math.sin(i * Math.PI / 4) * 60}
            stroke="#FFD700"
            strokeWidth="3"
            opacity="0.5"
          />
        ))}
      </g>

      {/* Texto celebratorio */}
      <text x="200" y="250" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="monospace">
        ¡MAGIA DEL AMOR!
      </text>
    </svg>
  );
}

// ============================================
// ESCENAS DEL CINE INTERDIMENSIONAL
// ============================================

// Escena: Salón con TV portal brillante
function CinemaLiving() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo oscuro de salón nocturno */}
      <rect x="0" y="0" width="400" height="280" fill="#1A1A2E" />

      {/* Ventana con luna */}
      <rect x="20" y="30" width="80" height="100" fill="#16213E" rx="3" />
      <rect x="25" y="35" width="70" height="90" fill="#0F3460" />
      <circle cx="60" cy="60" r="15" fill="#FFFACD" />
      {[...Array(5)].map((_, i) => (
        <circle key={i} cx={30 + i * 15} cy={100} r="2" fill="#FFD700" opacity="0.6" />
      ))}

      {/* Sofá */}
      <g transform="translate(60, 160)">
        <rect x="0" y="20" width="200" height="40" fill="#4A4A6A" rx="5" />
        <rect x="0" y="0" width="30" height="60" fill="#4A4A6A" rx="5" />
        <rect x="170" y="0" width="30" height="60" fill="#4A4A6A" rx="5" />
        {/* Cojines */}
        <ellipse cx="70" cy="30" rx="25" ry="15" fill="#E94560" />
        <ellipse cx="130" cy="30" rx="25" ry="15" fill="#E94560" />
      </g>

      {/* Televisor con portal */}
      <g transform="translate(120, 20)">
        <rect x="0" y="0" width="160" height="100" fill="#2F2F4F" rx="5" />
        <rect x="5" y="5" width="150" height="85" fill="#0F3460" />
        {/* Portal brillante */}
        <ellipse cx="80" cy="47" rx="50" ry="35" fill="#E94560" opacity="0.8" />
        <ellipse cx="80" cy="47" rx="35" ry="25" fill="#FFD93D" opacity="0.6" />
        <ellipse cx="80" cy="47" rx="20" ry="15" fill="white" opacity="0.8" />
        {/* Rayos de luz */}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="80"
            y1="47"
            x2={80 + Math.cos(i * Math.PI / 4) * 60}
            y2={47 + Math.sin(i * Math.PI / 4) * 45}
            stroke="#FFD93D"
            strokeWidth="2"
            opacity="0.5"
          />
        ))}
        {/* Base TV */}
        <rect x="60" y="95" width="40" height="15" fill="#2F2F4F" />
      </g>

      {/* Palomitas volando */}
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          cx={150 + (i * 23) % 100}
          cy={80 + (i * 17) % 50}
          r="4"
          fill="#FFFACD"
        />
      ))}

      {/* Suelo alfombra */}
      <rect x="0" y="220" width="400" height="60" fill="#16213E" />
      <rect x="50" y="225" width="300" height="50" fill="#4A4A6A" rx="3" />
    </svg>
  );
}

// Escena: Tres puertas de géneros cinematográficos
function CinemaDoors() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo pasillo misterioso */}
      <rect x="0" y="0" width="400" height="280" fill="#0F3460" />

      {/* Estrellas de fondo */}
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={10 + (i * 43) % 380}
          cy={10 + (i * 29) % 200}
          r="1.5"
          fill="#FFD700"
          opacity={0.4 + (i % 3) * 0.2}
        />
      ))}

      {/* Tres puertas */}
      {/* Puerta Romántica - Rosa */}
      <g transform="translate(30, 60)">
        <rect x="0" y="0" width="90" height="130" fill="#E94560" rx="5" />
        <rect x="10" y="10" width="70" height="100" fill="#FF6B9D" rx="3" />
        <circle cx="45" cy="60" r="25" fill="#FFB6C1" opacity="0.8" />
        <text x="45" y="67" textAnchor="middle" fontSize="30">❤️</text>
        <circle cx="70" cy="90" r="6" fill="#FFD700" />
        <text x="45" y="125" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ROMANCE</text>
      </g>

      {/* Puerta Aventuras - Verde/Dorado */}
      <g transform="translate(155, 50)">
        <rect x="0" y="0" width="90" height="140" fill="#2E8B57" rx="5" />
        <rect x="10" y="10" width="70" height="110" fill="#3CB371" rx="3" />
        <circle cx="45" cy="60" r="25" fill="#FFD700" opacity="0.8" />
        <text x="45" y="67" textAnchor="middle" fontSize="28">🗺️</text>
        <circle cx="70" cy="100" r="6" fill="#8B4513" />
        <text x="45" y="135" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AVENTURA</text>
      </g>

      {/* Puerta Comedia - Amarillo */}
      <g transform="translate(280, 60)">
        <rect x="0" y="0" width="90" height="130" fill="#FFD93D" rx="5" />
        <rect x="10" y="10" width="70" height="100" fill="#FFF8DC" rx="3" />
        <circle cx="45" cy="60" r="25" fill="#FFD93D" opacity="0.8" />
        <text x="45" y="67" textAnchor="middle" fontSize="28">😂</text>
        <circle cx="70" cy="90" r="6" fill="#E94560" />
        <text x="45" y="125" textAnchor="middle" fill="#1A1A2E" fontSize="10" fontWeight="bold">COMEDIA</text>
      </g>

      {/* Alfombra roja */}
      <rect x="0" y="200" width="400" height="80" fill="#8B0000" />
      <rect x="50" y="205" width="300" height="5" fill="#FFD700" />

      {/* Luces de cine en el techo */}
      {[...Array(5)].map((_, i) => (
        <g key={i} transform={`translate(${40 + i * 80}, 10)`}>
          <rect x="0" y="0" width="20" height="15" fill="#2F2F4F" />
          <ellipse cx="10" cy="20" rx="12" ry="8" fill="#FFD93D" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

// Escena: Escenario de película
function CinemaStage() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo de escenario */}
      <rect x="0" y="0" width="400" height="280" fill="#1A1A2E" />

      {/* Telón rojo */}
      <path d="M 0 0 Q 50 30, 0 60 L 0 0" fill="#8B0000" />
      <path d="M 400 0 Q 350 30, 400 60 L 400 0" fill="#8B0000" />
      <rect x="0" y="0" width="400" height="30" fill="#8B0000" />
      {/* Pliegues del telón */}
      {[...Array(8)].map((_, i) => (
        <path
          key={i}
          d={`M ${i * 50} 30 Q ${i * 50 + 25} 50, ${i * 50 + 50} 30`}
          stroke="#6B0000"
          strokeWidth="3"
          fill="none"
        />
      ))}

      {/* Escenario de madera */}
      <rect x="30" y="180" width="340" height="100" fill="#8B4513" />
      <rect x="30" y="180" width="340" height="10" fill="#A0522D" />
      {/* Líneas de madera */}
      {[...Array(6)].map((_, i) => (
        <line key={i} x1={30 + i * 60} y1="190" x2={30 + i * 60} y2="280" stroke="#6B3510" strokeWidth="2" />
      ))}

      {/* Foco central */}
      <g transform="translate(160, 40)">
        <rect x="0" y="0" width="80" height="40" fill="#2F2F4F" rx="5" />
        <ellipse cx="40" cy="50" rx="50" ry="30" fill="#FFD93D" opacity="0.3" />
        <ellipse cx="40" cy="50" rx="30" ry="20" fill="#FFD93D" opacity="0.5" />
      </g>

      {/* Corazones flotantes para el minijuego */}
      {[...Array(6)].map((_, i) => (
        <g key={i} transform={`translate(${60 + i * 55}, ${100 + (i % 2) * 30})`}>
          <circle cx="15" cy="15" r="18" fill="#E94560" opacity="0.7" />
          <text x="15" y="22" textAnchor="middle" fontSize="18">❤️</text>
        </g>
      ))}

      {/* Claqueta */}
      <g transform="translate(20, 100)">
        <rect x="0" y="10" width="50" height="35" fill="#2F2F4F" />
        <rect x="0" y="0" width="50" height="15" fill="#1A1A2E" />
        {[...Array(5)].map((_, i) => (
          <rect key={i} x={i * 10} y="0" width="5" height="15" fill={i % 2 === 0 ? 'white' : '#1A1A2E'} />
        ))}
      </g>
    </svg>
  );
}

// Escena: Momento romántico bajo las estrellas
function CinemaRomantic() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Cielo nocturno */}
      <defs>
        <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F0F23" />
          <stop offset="50%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="280" fill="url(#nightSky)" />

      {/* Estrellas brillantes */}
      {[...Array(40)].map((_, i) => (
        <circle
          key={i}
          cx={5 + (i * 37) % 390}
          cy={5 + (i * 23) % 180}
          r={1 + (i % 3)}
          fill="white"
          opacity={0.4 + (i % 4) * 0.15}
        />
      ))}

      {/* Luna grande */}
      <circle cx="320" cy="60" r="40" fill="#FFFACD" />
      <circle cx="330" cy="55" r="35" fill="#0F0F23" opacity="0.2" />

      {/* Colina con hierba */}
      <ellipse cx="200" cy="250" rx="250" ry="80" fill="#1A4D1A" />
      <ellipse cx="200" cy="240" rx="220" ry="60" fill="#228B22" />

      {/* Flores */}
      {[...Array(8)].map((_, i) => (
        <g key={i} transform={`translate(${50 + i * 45}, ${210 + (i % 2) * 15})`}>
          <rect x="3" y="10" width="2" height="15" fill="#228B22" />
          <circle cx="4" cy="8" r="5" fill={['#FF69B4', '#FFD700', '#E94560'][i % 3]} />
        </g>
      ))}

      {/* Banco de parque */}
      <g transform="translate(130, 180)">
        <rect x="0" y="20" width="140" height="8" fill="#8B4513" rx="2" />
        <rect x="0" y="30" width="140" height="15" fill="#A0522D" rx="2" />
        {/* Patas */}
        <rect x="15" y="45" width="8" height="20" fill="#8B4513" />
        <rect x="117" y="45" width="8" height="20" fill="#8B4513" />
        {/* Respaldo */}
        <rect x="0" y="0" width="140" height="6" fill="#8B4513" rx="2" />
        <rect x="0" y="10" width="140" height="6" fill="#8B4513" rx="2" />
      </g>

      {/* Corazones flotando */}
      {[...Array(6)].map((_, i) => (
        <text
          key={i}
          x={100 + i * 40}
          y={60 + (i % 3) * 25}
          fontSize={14 + (i % 3) * 4}
          fill="#E94560"
          opacity={0.6 + (i % 3) * 0.15}
        >
          ❤
        </text>
      ))}

      {/* Lucecitas (luciérnagas) */}
      {[...Array(12)].map((_, i) => (
        <circle
          key={`firefly-${i}`}
          cx={30 + (i * 47) % 340}
          cy={150 + (i * 19) % 60}
          r="3"
          fill="#FFD93D"
          opacity={0.5 + (i % 3) * 0.2}
        />
      ))}
    </svg>
  );
}

// Escena: Créditos finales con estrellas
function CinemaCredits() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo negro de créditos */}
      <rect x="0" y="0" width="400" height="280" fill="#0A0A0A" />

      {/* Estrellas de fondo */}
      {[...Array(50)].map((_, i) => (
        <circle
          key={i}
          cx={5 + (i * 41) % 390}
          cy={5 + (i * 31) % 270}
          r={0.5 + (i % 4) * 0.5}
          fill="white"
          opacity={0.3 + (i % 5) * 0.1}
        />
      ))}

      {/* Marco dorado */}
      <rect x="30" y="30" width="340" height="220" fill="none" stroke="#FFD700" strokeWidth="4" rx="10" />
      <rect x="40" y="40" width="320" height="200" fill="none" stroke="#FFD700" strokeWidth="2" rx="8" />

      {/* Texto de créditos */}
      <text x="200" y="80" textAnchor="middle" fill="#FFD700" fontSize="16" fontFamily="monospace">
        ✨ LA MEJOR PAREJA ✨
      </text>
      <text x="200" y="105" textAnchor="middle" fill="#FFD700" fontSize="12" fontFamily="monospace">
        DEL UNIVERSO
      </text>

      {/* Línea decorativa */}
      <line x1="100" y1="120" x2="300" y2="120" stroke="#FFD700" strokeWidth="2" />

      {/* Estrella grande central */}
      <g transform="translate(170, 140)">
        <polygon
          points="30,0 35,20 55,25 40,40 45,60 30,50 15,60 20,40 5,25 25,20"
          fill="#FFD700"
        />
      </g>

      {/* Texto inferior */}
      <text x="200" y="210" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">
        Una producción de
      </text>
      <text x="200" y="230" textAnchor="middle" fill="#E94560" fontSize="14" fontWeight="bold" fontFamily="monospace">
        VUESTRO AMOR
      </text>

      {/* Pequeñas estrellas decorativas */}
      {[60, 120, 280, 340].map((x, i) => (
        <text key={i} x={x} y={160} fontSize="20" fill="#FFD93D">
          ⭐
        </text>
      ))}

      {/* Corazones en las esquinas */}
      <text x="50" y="60" fontSize="16">❤️</text>
      <text x="335" y="60" fontSize="16">❤️</text>
      <text x="50" y="235" fontSize="16">❤️</text>
      <text x="335" y="235" fontSize="16">❤️</text>
    </svg>
  );
}

// ============================================
// ESCENAS DEL SUPERMERCADO
// ============================================

// Escena: Caja registradora mágica
function MagicCheckout() {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* Fondo */}
      <rect x="0" y="0" width="400" height="280" fill="#E8E8E8" />

      {/* Mostrador */}
      <rect x="50" y="140" width="300" height="60" fill="#8B4513" />
      <rect x="50" y="130" width="300" height="15" fill="#A0522D" />

      {/* Caja registradora */}
      <g transform="translate(150, 70)">
        <rect x="0" y="0" width="100" height="70" fill="#2F2F2F" rx="5" />
        <rect x="10" y="10" width="80" height="30" fill="#90EE90" />
        <text x="50" y="32" textAnchor="middle" fill="#1A1A2E" fontSize="14" fontFamily="monospace">
          $0.00
        </text>
        {/* Botones */}
        {[...Array(9)].map((_, i) => (
          <rect
            key={i}
            x={15 + (i % 3) * 25}
            y={45 + Math.floor(i / 3) * 8}
            width="20"
            height="6"
            fill="#4A4A6A"
            rx="1"
          />
        ))}
      </g>

      {/* Bruja cajera */}
      <g transform="translate(280, 40)">
        {/* Cuerpo */}
        <rect x="0" y="50" width="50" height="60" fill="#4B0082" rx="5" />
        {/* Cabeza */}
        <circle cx="25" cy="35" r="22" fill="#90EE90" />
        {/* Sombrero de bruja */}
        <polygon points="25,-10 5,30 45,30" fill="#1A1A2E" />
        <rect x="0" y="25" width="50" height="8" fill="#1A1A2E" />
        {/* Ojos */}
        <circle cx="18" cy="32" r="5" fill="white" />
        <circle cx="32" cy="32" r="5" fill="white" />
        <circle cx="19" cy="33" r="2" fill="#1A1A2E" />
        <circle cx="33" cy="33" r="2" fill="#1A1A2E" />
        {/* Sonrisa */}
        <path d="M 15 45 Q 25 55, 35 45" stroke="#1A1A2E" strokeWidth="2" fill="none" />
        {/* Verruga */}
        <circle cx="30" cy="42" r="3" fill="#228B22" />
      </g>

      {/* Estrellas mágicas alrededor */}
      {[...Array(8)].map((_, i) => (
        <text
          key={i}
          x={40 + i * 45}
          y={30 + (i % 2) * 20}
          fontSize="18"
          className="animate-pulse"
        >
          ✨
        </text>
      ))}

      {/* Cartel "GRACIAS" */}
      <g transform="translate(100, 10)">
        <rect x="0" y="0" width="200" height="40" fill="#FFD700" rx="5" />
        <text x="100" y="28" textAnchor="middle" fill="#8B0000" fontSize="20" fontWeight="bold" fontFamily="monospace">
          ¡GRACIAS!
        </text>
      </g>

      {/* Suelo */}
      <rect x="0" y="200" width="400" height="80" fill="#A0522D" />
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={i * 50} y="200" width="50" height="80" stroke="#8B4513" strokeWidth="2" fill="none" />
      ))}
    </svg>
  );
}

// Mapa de escenas disponibles
const SCENES: Record<string, () => React.JSX.Element> = {
  // Supermercado
  'supermarket-entrance': SupermarketEntrance,
  'frozen-aisle': FrozenAisle,
  'fruit-section': FruitSection,
  'bakery-dragon': BakeryDragon,
  'love-aisle': LoveAisle,
  'magic-checkout': MagicCheckout,
  // Poción de Amor
  'potion-kitchen': PotionKitchen,
  'potion-pantry': PotionPantry,
  'potion-cauldron': PotionCauldron,
  'potion-table': PotionTable,
  'potion-magic': PotionMagic,
  // Cine Interdimensional
  'cinema-living': CinemaLiving,
  'cinema-doors': CinemaDoors,
  'cinema-stage': CinemaStage,
  'cinema-romantic': CinemaRomantic,
  'cinema-credits': CinemaCredits,
};

export function PixelScene({ sceneId, children, className = '' }: PixelSceneProps) {
  const SceneComponent = SCENES[sceneId];

  if (!SceneComponent) {
    // Escena por defecto si no existe
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-sky-300 to-green-300 rounded-2xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🎮
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <SceneComponent />
      {/* Capa para personajes y elementos interactivos */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

// Exportar lista de escenas disponibles
export const SCENE_IDS = Object.keys(SCENES);
