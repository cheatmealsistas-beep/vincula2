# CLAUDE.md - Contexto para Claude Code

Este archivo contiene todo el contexto necesario para continuar el desarrollo de este proyecto.

## Qué es este proyecto

**Vínculo** es una web app móvil (mobile-first) diseñada como un juego para dos personas que conviven. Su objetivo es facilitar la comunicación sincera y la reparación emocional sin generar culpa, obligaciones ni sensación de juicio.

## Problema que resuelve

La dificultad de las parejas para comunicar frustraciones y necesidades a tiempo, lo que lleva a discusiones escaladas, silencios tensos o acumulación de resentimiento. Esto amenaza la estabilidad de la relación, no por falta de amor, sino por comunicación ineficaz que deteriora la convivencia.

## Usuario target

Parejas que:
- Se aman y desean mejorar su convivencia
- Luchan con conversaciones que derivan en discusiones
- Les cuesta expresar emociones "en caliente"
- Necesitan espacio para regularse antes de comunicarse
- Buscan un equilibrio entre decirlo todo y callarlo todo
- Quieren un puente seguro para reconectar

Especialmente parejas donde:
- Una persona necesita espacio para regularse
- La otra necesita claridad para sentirse segura
- Ambas quieren encontrar un equilibrio más amable

## Diferenciación vs competencia

Los competidores (apps de comunicación, terapia tradicional) son:
- Demasiado técnicos o exigentes
- Requieren análisis profundos
- Se enfocan en "arreglar problemas" en lugar de "cuidado continuo"
- Carecen de enfoque lúdico y de bajo umbral

**Vínculo ofrece**:
- Espacio compartido, lúdico y de baja presión
- Dinámicas guiadas breves
- "Botón de pausa segura" para regularse sin generar abandono
- Expresión sin juicio ni exigencia
- Cuidado preventivo, no reactivo

## Valores del proyecto

1. **Cariño** - Tono afectuoso, nunca frío ni clínico
2. **Honestidad** - Facilitar verdades difíciles dichas con suavidad
3. **Apoyo** - Acompañar sin juzgar ni evaluar
4. **Sinceridad** - Expresión auténtica sin máscaras
5. **Humor** - Ligereza cuando sea apropiado

## Principios de diseño (CRÍTICOS)

1. **No diagnosticar** - La app no analiza ni juzga
2. **No puntuar** - Sin métricas de "éxito" o "fracaso"
3. **No archivar reproches** - Sin históricos punitivos
4. **No obligar** - Todo es voluntario
5. **Lenguaje neutro** - Evitar palabras que culpen
6. **Todo es opt-in** - Nada forzado
7. **Menos es más** - Simplicidad ante todo

---

## Stack técnico

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Backend**: Supabase (Realtime para sincronización)
- **Hosting**: GitHub Pages
- **Sin login obligatorio**: Acceso por código de sala

## Arquitectura de datos (IMPORTANTE)

**Supabase Real** - La app usa Supabase para sincronizar entre dispositivos:
- URL: `https://duluwcxuwudjlpeyvehv.supabase.co`
- Credenciales en `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Cliente en `src/lib/supabase.ts`

**Tablas en Supabase**:
- `rooms` - Salas con código, estado, juego actual
- `players` - Jugadores en cada sala (player_number 1 o 2)
- `messages` - Mensajes asíncronos entre jugadores
- `game_responses` - Respuestas de los juegos

**Sincronización Realtime**:
- Los hooks usan canales de Supabase Realtime (broadcast)
- Cada juego tiene su propio canal: `cards:{roomId}`, `wyr:{roomId}`, etc.
- Los mensajes se envían con `channel.send()` y se reciben con `.on('broadcast')`

**Persistencia de sesión**:
- `src/hooks/useSessionPersistence.ts` guarda la sesión en localStorage
- Clave: `vincula2_session`
- Contiene: roomId, roomCode, playerNumber, inviteMessage, gameType
- Expira a las 4 horas
- Permite recuperar la sala al refrescar el navegador

## Estructura del proyecto

```
vinculo-app/
├── src/
│   ├── components/     # Button, Input, Card
│   ├── pages/          # Home, Room, Game, LeaveMessage, ViewMessage, Pause, End
│   ├── hooks/          # (pendiente: useRoom, useRealtime)
│   ├── lib/            # (pendiente: supabase client)
│   ├── types/          # Room, Player, Card, CardPlayed
│   └── data/           # cards.ts (mazo de cartas)
├── docs/
│   └── GAME_DESIGN.md  # Diseño detallado del juego
├── CLAUDE.md           # Este archivo
└── README.md
```

## Flujo de usuario (NUEVO)

**Creador (Host)**:
1. Home → "¡Empezar!"
2. ShareAndInvite → Comparte link + mensaje opcional
3. GameSelect → Elige juego (ve si la pareja ya entró)
4. Juego → Ambos juegan sincronizados
5. End → Otra ronda o salir

**Invitado (Guest)**:
1. Entra por link con `?code=XXXX`
2. WelcomeMessage → Ve mensaje del creador (si existe)
3. WaitingForGame → Espera mientras el creador elige juego
4. Juego → Ambos juegan sincronizados
5. End → Otra ronda o salir

## Pantallas implementadas

| Pantalla | Descripción | Quién la ve |
|----------|-------------|-------------|
| Home | Crear sala / Tengo un código | Ambos |
| JoinRoom | Introducir código manualmente | Invitado |
| ShareAndInvite | Compartir link + mensaje opcional | Creador |
| GameSelect | Elegir juego | Creador |
| WelcomeMessage | Ver mensaje del creador | Invitado |
| WaitingForGame | Esperar a que elijan juego | Invitado |
| Room | Sala principal (mensajes, pausa) | Ambos |
| LeaveMessage | Escribir mensaje asíncrono | Ambos |
| ViewMessage | Ver mensaje recibido | Ambos |
| Pause | Pedir pausa | Ambos |
| [Juegos] | 14 juegos diferentes | Ambos |
| End | Fin del juego | Ambos |

## Estado actual del desarrollo

- [x] Documentación inicial
- [x] Proyecto inicializado (Vite + React + TypeScript)
- [x] Tailwind CSS configurado
- [x] Componentes base (Button, Input, Card)
- [x] Todas las pantallas implementadas
- [x] Flujo completo funcional
- [x] Pausa segura
- [x] Modo asíncrono (dejar mensaje)
- [x] Supabase Realtime para sincronización
- [x] Deploy en GitHub Pages
- [x] PWA configurada
- [x] Lazy loading de juegos (code splitting)
- [x] Nuevo flujo simplificado (ShareAndInvite, GameSelect, WaitingForGame)
- [x] Persistencia de sesión en localStorage

## Juegos implementados

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

## Comandos útiles

```bash
npm run dev       # Desarrollo local (http://localhost:5173)
npm run build     # Build para producción
```

---

## URL de producción y sistema de invitación

**URL de producción**: `https://cheatmealsistas-beep.github.io/vincula2/`

**Sistema de códigos de sala**:
- Los códigos se generan dinámicamente al crear una sala (ej: `LUNA42`, `SOL87`, `MAR15`)
- Formato: palabra memorable + número de 2 dígitos
- Palabras posibles: LUNA, SOL, MAR, CIELO, RIO, LUZ, PAZ, AIRE

**Compartir link de invitación**:
- En `WaitingRoom.tsx` hay un botón "Enviar link a tu pareja"
- El link tiene formato: `https://cheatmealsistas-beep.github.io/vincula2/?code=LUNA42`
- Usa Web Share API en móvil (abre menú nativo de compartir)
- En escritorio copia al portapapeles
- El parámetro `?code=` se lee en `App.tsx` (líneas 81-89) y auto-une a la sala

**Importante sobre URLs en GitHub Pages**:
- GitHub Pages solo sirve archivos estáticos, no hay servidor
- Las query params (`?code=X`) SÍ funcionan porque la URL base siempre es `/vincula2/`
- No usar rutas con paths (ej: `/vincula2/room/LUNA42`) porque dan 404

---

## Principios de copys/UX

**Lenguaje inclusivo**:
- Usar siempre "tu pareja" (neutro, sin género)
- No asumir orientación sexual ni estructura familiar
- Evitar "sala" y términos técnicos - usar "espacio", "código"

**Copys cálidos**:
- Estados de espera: "Tu pareja está pensando..." en vez de "Esperando..."
- Botones de fin: "¡Listo!", "¡Qué aventura!" en vez de "Terminar"
- Salir: "Hasta luego" en vez de "Salir de la sala"

---

## Meta-instrucciones (Eficiencia)

**Criterio experto**:
- Usar juicio técnico, no seguir ciegamente
- Cuestionar si algo perjudica al producto
- Proponer alternativas mejores
- Priorizar: eficiencia > usuario final > petición literal

**Durante ejecución**:
- Documentar deuda técnica si se detecta
- Registrar decisiones arquitectónicas

---

## Principios de Desarrollo

**Simplicidad**: Solución más simple que funcione
**YAGNI**: No implementar "por si acaso"
**No romper lo previo**: Añadir antes que modificar

---

## Principios UX/UI

**Prioridad**: Carga < 200ms, Mínimos clicks, Perfección visual

**"Un mono debe poder hacerlo"**: Auto-explicativo, sin decisiones complejas

**Mobile WOW**: Touch targets generosos (mín 44px), gestos naturales

**Lo que NO hacer**: Animaciones sin propósito, modales innecesarios

---

## Colores

| Elemento | Hex |
|----------|-----|
| Fondo | #FDF6E3 |
| Expresar | #FFDAB9 |
| Escuchar | #B2E0D6 |
| Reparar | #E6E0F8 |
| Conectar | #FFF3CD |
| Pausa | #E8E4DF |
| Texto | #4A4A4A |
| Botón | #F4A583 |
