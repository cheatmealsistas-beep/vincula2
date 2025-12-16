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

## Valores

- **Cariño**: tono cálido, nunca frío
- **Honestidad**: verdades difíciles dichas con suavidad
- **Apoyo**: acompaña sin juzgar
- **Sinceridad**: expresión auténtica
- **Humor**: ligereza cuando toca

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:5173
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (base de datos + realtime)
- Netlify (hosting)

---

Hecho con cariño para cuidar lo que importa.
