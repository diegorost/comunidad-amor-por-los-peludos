# Comunidad Amor por los Peludos

Sitio web de la comunidad de dueños de perros del edificio: perfiles de los peludos, recursos útiles (veterinarios, paseadores, etc.) y tips/reglas de la comunidad.

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4 + shadcn/ui
- Cloudflare Pages (hosting) + Cloudflare Pages Functions (API en `functions/api`)
- Cloudflare D1 (base de datos SQL, migraciones en `migrations/`) + Cloudflare R2/Images (fotos)

## Diseño

- Mobile-first, paleta cálida (crema, dorado, verde salvia, azul cielo) definida en `src/index.css` con variables `oklch`
- Tipografías: DM Sans (texto) y Nunito (títulos), cargadas desde Google Fonts en `index.html`
- Acceso siempre gratuito para la comunidad

## Estructura

- `src/pages` — páginas: Home, Dogs (Peludos), Resources (Recursos), Tips (Reglas/Tips), y sus formularios de alta/edición
- `src/components` — componentes compartidos (DogCard, TipCard, PhotoDialog, EmptyState, UI de shadcn)
- `functions/api` — endpoints de la API (dogs, resources, tips, upload de imágenes, community-highlights)
- `migrations` — migraciones SQL para D1

## Desarrollo

```bash
npm install
npm run dev      # entorno de desarrollo
npm run build    # compila (tsc -b && vite build)
npm run lint
```

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name comunidad-amor-por-los-peludos --branch main --commit-dirty=true
```

El deploy automático también está configurado en Cloudflare Pages al hacer push a `main` (build command: `npm run build`).
