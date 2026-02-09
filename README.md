# Vínculo

Una web app-juego para parejas que convierte conversaciones difíciles en micro-momentos de cuidado compartido.

## Qué es

Vínculo es un juego para dos personas que conviven. Crea un espacio seguro para decirse cosas pequeñas antes de que se hagan grandes.

**No es terapia. No es mediación. Es un juego.**

## Cómo funciona

1. Una persona crea una sala y recibe un código (ej: LUNA42)
2. Comparte el código con la otra persona
3. Ambos entran y juegan juntos
4. Cada ronda muestra una carta para completar
5. Escriben sus respuestas (máximo 15 palabras)
6. Las respuestas se revelan a la vez
7. Sin ganadores, sin puntos, sin juicio

## Juegos disponibles

| ID | Nombre | Descripción |
|----|--------|-------------|
| cards | Cartas | Preguntas para conocerse mejor |
| wouldyourather | ¿Qué prefieres? | Dilemas divertidos |
| quiz | Quiz | Preguntas sobre la pareja |
| draw | Dibuja | Dibujar y adivinar |
| adventure | Aventura | Historia interactiva |
| mirror | Espejo | Reflexiones mutuas |
| timeline | Nuestra Historia | Recuerdos compartidos |
| timecards | Cartas del Tiempo | Pasado, presente, futuro |
| calm | Momento Calma | Respiración guiada |
| lovephrases | Te quiero porque... | Frases de amor |
| randomplan | Plan Random | Generador de planes |
| sillychallenges | Retos | Retos divertidos |
| absurdphrases | Completa la Frase | Frases absurdas |
| spinwheel | Gira y... | Ruleta sensual con niveles de intensidad |

## Valores

- **Cariño**: tono cálido, nunca frío
- **Honestidad**: verdades difíciles dichas con suavidad
- **Apoyo**: acompaña sin juzgar
- **Sinceridad**: expresión auténtica
- **Humor**: ligereza cuando toca

## Tech stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilos**: Tailwind CSS v4
- **Base de datos**: Supabase (PostgreSQL + Realtime)
- **PWA**: vite-plugin-pwa
- **Hosting**: GitHub Pages

## Estructura del proyecto

```
vinculo-app/
├── src/
│   ├── components/     # Componentes reutilizables (Button, Input, Card)
│   ├── pages/          # Pantallas de la app
│   ├── hooks/          # Hooks de React (useRoom, useGame, etc.)
│   ├── lib/            # Cliente de Supabase
│   ├── data/           # Datos de cartas y juegos
│   ├── types/          # Tipos TypeScript
│   └── utils/          # Utilidades
├── public/             # Assets estáticos
├── CLAUDE.md           # Contexto para desarrollo con IA
└── README.md
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## Base de datos (Supabase)

### Tablas requeridas

```sql
-- Salas de juego
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  game_type text DEFAULT 'cards',
  game_cards text[],
  game_round integer DEFAULT 0,
  invite_message text,
  pause_message text,
  pause_until text,
  created_at timestamptz DEFAULT now()
);

-- Jugadores
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  player_number integer CHECK (player_number IN (1, 2)),
  is_online boolean DEFAULT true,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Mensajes asíncronos
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  from_player integer,
  message_type text,
  prompt text,
  content text,
  gesture text,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Respuestas de juegos
CREATE TABLE game_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  player_number integer,
  round integer,
  card_id text,
  response text,
  response_type text,
  gesture text,
  created_at timestamptz DEFAULT now()
);
```

### Configuración de RLS y Realtime

```sql
-- Habilitar RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_responses ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (sin auth)
CREATE POLICY "Allow all on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all on messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all on game_responses" ON game_responses FOR ALL USING (true);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE game_responses;
```

## Paleta de colores

| Elemento | Hex |
|----------|-----|
| Fondo | #FDF6E3 |
| Expresar | #FFDAB9 |
| Escuchar | #B2E0D6 |
| Reparar | #E6E0F8 |
| Conectar | #FFF3CD |
| Pausa | #E8E4DF |
| Texto | #4A4A4A |
| Botón principal | #F4A583 |

## Gestos de recibido

Cuando recibes un mensaje de tu pareja, puedes responder con:

| Gesto | Significado |
|-------|-------------|
| 💜 | Te quiero |
| 🫂 | Te abrazo |
| 👀 | Te leo |
| 🙏 | Gracias |
| 💭 | Lo pienso |

---

Hecho con cariño para cuidar lo que importa.
