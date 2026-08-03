# Métricas de rendimiento — RNF2

## Antes de la optimización

- **Lighthouse Performance Score:** <pega tu número aquí>
- **Largest Contentful Paint (LCP):** <pega tu tiempo aquí, ej. 2.1s>
- **Tiempo de carga percibido del menú:** <tu observación>
- Fecha de medición: <fecha>
- Condiciones: Chrome incógnito, modo Mobile, `npm run preview` (build de producción)

## Cambios aplicados

1. Code splitting de la ruta `/admin` con `React.lazy()` — no se descarga en 
   la visita normal al catálogo.
2. `manualChunks` en Vite: separa `vendor` (React, React Router) del código 
   propio de la app, para mejor cacheo entre despliegues.
3. `preconnect`/`dns-prefetch` al dominio de imágenes.
4. Precarga adelantada de productos (`usePrefetchProducts`) antes de que 
   `ProductCatalog` monte.
5. Confirmado `loading="lazy"` y dimensiones explícitas (`width`/`height`) 
   en todas las imágenes del catálogo (ya existente desde RF1, verificado 
   aquí).

## Después de la optimización

- **Lighthouse Performance Score:** <pega tu número aquí>
- **Largest Contentful Paint (LCP):** <pega tu tiempo aquí>
- **Tamaño de chunks (`npm run build:analyze`):**
  - `vendor-*.js`: <tamaño>
  - `index-*.js` (o el nombre del chunk principal): <tamaño>
  - `AdminPage-*.js` (chunk separado, confirma el code splitting): <tamaño>
- Fecha de medición: <fecha>

## Conclusión

<Escribe aquí, 2-3 líneas, si se cumplió el criterio de ≤3 segundos y qué tanto mejoró 
el score de Lighthouse entre el antes y el después.>