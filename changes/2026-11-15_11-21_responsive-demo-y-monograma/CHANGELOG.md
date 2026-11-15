# Changelog: corrección responsive de la landing y cambio de monograma

- **Fecha y hora:** 2026-11-15 11:21
- **Autor:** Claude (Claude Code), a pedido del usuario.

## Objetivo

1. Usar `/brand/d-core-monogram.png` como logo en lugar de `/brand/d-core-neon.png`. El usuario lo revisó y lo aprobó.
2. Corregir los desbordes en móvil que el usuario detectó a 400 px con DevTools: la ilustración de la demo se salía de su ventana.

## Contexto y causa

- `.lp-demo-canvas` tenía `min-height: 220px` junto con `aspect-ratio: 908/452`. Por eso el navegador le imponía un ancho mínimo de 442 px, y en pantallas de menos de unos 480 px se salía de la ventana de la demo. No había scroll horizontal (`.lp` tiene `overflow-x: clip`), pero la ilustración aparecía cortada en el borde derecho.
- Una medición por elementos en 14 anchos (de 320 a 1440) encontró otros desbordes:
  - Etiquetas de la línea de tiempo cortadas («Cor», «Plani»).
  - Regla de semanas ilegible («S0 S0 S0»).
  - Columnas del pie desbordadas 60 px a 1024.
  - Contenido de la tarjeta de acceso más ancho que la tarjeta a 320.
  - Botón grande sin espacio a 320.
  - Píldora «Nuevo» y chip «24 miembros» cortados.

## Solución (`src/pages/landing/landing.css`)

- `.lp-demo-canvas`: se quita `min-height` y se añade `min-width: 0`. Por debajo de 768 px usa `aspect-ratio: 4/3`.
- `.lp-block`: el icono no se encoge y el texto termina en elipsis. Por debajo de 1024 px solo se muestra el icono, centrado.
- `.lp-timeline-ruler`: las columnas pasan a `minmax(0, 1fr)`. Por debajo de 768 px solo se muestra una etiqueta de cada cuatro (S01, S05, S09, S13), sin recorte.
- `.lp-footer-main`: la primera columna pasa a `minmax(0, 420px)`.
- `.lp-access`: las columnas pasan a `minmax(0, 1fr)`, tanto en móvil como en escritorio.
- `.lp-btn-lg`: por debajo de 360 px puede partirse en dos líneas (`min-height: 54px`).
- `.lp-glass`: el ancho pasa a `max(56%, min(240px, 100% − 32px))`.
- `.lp-screen-top em`: no se encoge. Se oculta por debajo de 420 px y, en las tarjetas, por debajo de 1024 px.

Además, `src/pages/landing/sections/BrandMark.tsx` usa ahora `d-core-monogram.png`.

## Verificación

- Medición de desbordes en 320, 360, 375, 390, 400, 414, 480, 600, 700, 768, 900, 1024, 1280 y 1440 px. Ningún elemento sobrepasa el viewport y `scrollWidth` es igual al viewport en todos los anchos. Solo quedan recortes de 2 a 5 px en adornos dentro de la ilustración, a 320 px.
- Capturas: `.playwright-mcp/resp-*.png` (local, excluido de git).
- Sin errores de consola.
- **No se ejecutaron `npm run build` ni las pruebas** en este cambio.

## Riesgos y efectos secundarios

- En móvil, la ilustración de la demo cambia de proporción (de 2:1 a 4:3) y es más alta.
- Las etiquetas de texto de la línea de tiempo dejan de verse por debajo de 1024 px; solo quedan los iconos.

## Módulos afectados

Solo la landing pública (`src/pages/landing/`).

## Estado

Completado y verificado visualmente. Sin commit.

## Reversión

Restaurar `landing.css` y `BrandMark.tsx` desde el commit `7e7ae0d`. Antes, conservar los cambios ajenos que hay sin commit (sección FAQ, línea `lp-accordion-fade`).
