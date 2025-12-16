# Diseño del Juego - Vínculo

## Filosofía

Vínculo existe para cuidar la convivencia y a tu pareja sin convertirlo en una tarea.
Para decir "me importas" incluso cuando no sé muy bien cómo decirlo.

No es terapia. No es un chat. No es un registro de errores.
Es un apoyo. Una invitación. Un "oye, ¿lo intentamos de otra forma?"

### Para quién es

Parejas que quieren seguir, que se quieren lo suficiente como para intentar hacerlo mejor, pero que:
- Sienten que algunas conversaciones se convierten en discusiones
- Se bloquean al expresar emociones "en caliente"
- Prefieren parar y pensar antes que decir algo de lo que luego se arrepientan
- Quieren mejorar la convivencia sin cambiar al otro
- Buscan un punto medio entre hablarlo todo y callárselo todo

Especialmente para parejas donde:
- Una persona necesita espacio para regularse
- La otra necesita claridad para sentirse segura
- Ambas quieren encontrar un equilibrio más amable

### Por qué funciona como juego

- **Las reglas protegen**: límites de palabras, turnos, pausas... quitan presión
- **El formato desactiva defensas**: es "solo un juego"
- **La brevedad evita espirales**: no hay espacio para monólogos
- **El ritual crea hábito**: mismo formato cada vez = seguridad

---

## Valores en acción

| Valor | Cómo se refleja |
|-------|-----------------|
| Cariño | Textos cálidos, nunca imperativos. Sentirse en casa. |
| Honestidad | Preguntas que invitan a la verdad suave |
| Apoyo | Sin juicio, sin puntuación, sin "ganar" |
| Sinceridad | Límite de palabras = ir al grano |
| Humor | Alguna carta ligera, tono no solemne |

---

## Estructura de pantallas

### 1. Bienvenida (primera vez)
- Explicación breve y cálida de qué es esto
- "Crear nuestra sala" → genera código
- "Ya tenemos código" → introducir código

### 2. Sala de la Pareja (hogar)
El centro de todo. Un espacio que se siente propio.

**Elementos:**
- Nombre/código de la sala visible
- Estado de presencia: "Tu pareja está aquí" / "Última vez: hace 2h"
- Dos acciones principales:
  - **"Jugar juntos"** (mejor si ambos están)
  - **"Dejar algo para ti"** (asíncrono)
- Bandeja de mensajes pendientes (si hay algo sin leer)
- Acceso a pausa segura

### 3. Jugar juntos (síncrono)
Cuando ambos están presentes.

**Flujo:**
1. Ambos confirman que están listos
2. Se muestra una carta/dinámica
3. Cada uno escribe su respuesta (privada, máx 15 palabras)
4. Se revelan a la vez
5. Opciones después de ver:
   - Gesto de recibido (💜 🫂 👀 🙏)
   - "Siguiente carta"
   - "Terminamos por hoy"

### 4. Dejar algo para ti (asíncrono)
Cuando quiero decir algo pero no es el momento de hablarlo.

**Flujo:**
1. Elijo tipo de mensaje:
   - "Hoy me siento..."
   - "Necesitaría..."
   - "Gracias por..."
   - "Perdona por..."
2. Escribo (límite de palabras)
3. Envío
4. El otro lo ve cuando entre y puede responder con gesto

### 5. Pausa segura
No es huir. Es respirar.

**Flujo:**
1. Pulso "Necesito un momento"
2. Elijo cuándo creo que volveré (opcional)
3. El otro ve: "Tu pareja está tomando un momento. Te avisará cuando esté lista."
4. Cuando vuelvo, el otro lo ve

---

## Gestos de recibido

Formas de responder sin tener que escribir. Para sostener sin cerrar.

| Gesto | Significado |
|-------|-------------|
| 💜 | Te quiero |
| 🫂 | Te abrazo |
| 👀 | Te leo |
| 🙏 | Gracias |
| 💭 | Lo pienso |

---

## Tipos de cartas

### Expresar (melocotón #FFDAB9)
- "Hoy me siento..."
- "Hoy necesito..."
- "Me ayudaría que..."
- "Algo que no he dicho es..."

### Escuchar (verde agua #B2E0D6)
- "Algo que noté de ti..."
- "Creo que necesitas..."
- "Me gusta cuando tú..."

### Reparar (lavanda #E6E0F8)
- "Algo que quiero cuidar mejor..."
- "Perdona por..."
- "Gracias por..."

### Conectar (amarillo suave #FFF3CD)
- "Un momento bonito de hoy..."
- "Algo que me hizo pensar en ti..."
- "Una cosa tonta que quería contarte..."

---

## Textos y tono

### Pantalla de bienvenida
> "Esto es un rincón para vosotros dos.
> Sin prisa, sin perfección, sin dramas.
> Solo un momento para deciros lo que hay."

### Sala vacía (esperando al otro)
> "Tu pareja aún no ha entrado.
> Mientras, puedes dejarle algo si quieres."

### Después de compartir
> "Ya está. No hace falta más."

### Pausa segura (para quien la pide)
> "Está bien parar.
> Vuelve cuando puedas."

### Pausa segura (para el otro)
> "Tu pareja necesita un momento.
> No es un adiós, es un respiro."

---

## Anti-patrones (no hacer nunca)

1. **No mostrar histórico** de lo que se dijo antes
2. **No notificar** con urgencia
3. **No culpar** ("Llevas 3 días sin entrar")
4. **No comparar** ("Tú escribiste menos")
5. **No analizar** ("Tu comunicación mejoró")
6. **No forzar** respuestas ni tiempos

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

---

## MVP revisado

1. ✅ Crear sala con código memorable
2. ✅ Unirse con código
3. 🔄 Sala de la pareja como "hogar"
4. 🔄 Jugar juntos (cartas, revelar)
5. 🔄 Gestos de recibido
6. 🔄 Dejar algo (asíncrono)
7. 🔄 Pausa segura
8. ⬜ Supabase
9. ⬜ Deploy
