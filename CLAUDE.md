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
- **Base de datos**: Supabase (PostgreSQL + Realtime)
- **Hosting**: Netlify
- **Sin login obligatorio**: Acceso por código de sala

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

## Pantallas implementadas

1. **Home** - Crear sala / Tengo un código
2. **JoinRoom** - Introducir código
3. **Room** - Sala de la pareja (hogar)
   - Estado de presencia
   - "Jugar juntos" / "Dejar algo para ti"
   - Mensajes pendientes
   - Pausa segura
4. **LeaveMessage** - Elegir tipo y escribir mensaje asíncrono
5. **ViewMessage** - Ver mensaje con gestos de recibido
6. **Pause** - Pedir pausa con tiempo de retorno opcional
7. **Game** - Cartas, escribir, revelar, gestos
8. **End** - Cierre con opción de jugar otra ronda

## Gestos de recibido

| Gesto | Significado |
|-------|-------------|
| 💜 | Te quiero |
| 🫂 | Te abrazo |
| 👀 | Te leo |
| 🙏 | Gracias |
| 💭 | Lo pienso |

## Estado actual del desarrollo

- [x] Documentación inicial
- [x] Proyecto inicializado (Vite + React + TypeScript)
- [x] Tailwind CSS configurado
- [x] Componentes base (Button, Input, Card)
- [x] Todas las pantallas implementadas
- [x] Flujo completo funcional (simulado)
- [x] Gestos de recibido
- [x] Pausa segura
- [x] Modo asíncrono (dejar mensaje)
- [ ] **Supabase** - Pendiente configurar
- [ ] **Deploy en Netlify** - Pendiente

## Próximos pasos

1. Configurar Supabase (crear proyecto, tablas)
2. Conectar sala real con código persistente
3. Sincronización en tiempo real
4. Deploy en Netlify

## Comandos útiles

```bash
npm run dev       # Desarrollo local (http://localhost:5173)
npm run build     # Build para producción
```

## Variables de entorno necesarias

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

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
