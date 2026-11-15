# Verificación de rendimiento — landing Democra

- **Fecha:** 14/11/2026
- **Entorno:** Vite en modo desarrollo, `http://localhost:5173/`, Chrome con Playwright, escala 1x.
- **Nota:** los bytes reportados por Vite en desarrollo incluyen módulos ESM individuales, cliente de Vite y runtime de React Refresh. No son el peso comprimido del bundle de producción y no deben compararse directamente con una medición de producción.

## Resultados de carga y responsive

| Viewport | HTTP | DOMContentLoaded | `load` | LCP observado* | CLS observado* | Transferencia dev | Overflow |
|---:|---:|---:|---:|---:|---:|---:|---|
| 1440 × 900 | 200 | 494 ms | 498 ms | 1156 ms | 0.0122 | 4,577,580 B | No |
| 1024 × 900 | 200 | 572 ms | 574 ms | 820 ms | 0.0106 | 4,577,580 B | No |
| 768 × 900 | 200 | 638 ms | 643 ms | 904 ms | 0.0038 | 4,577,580 B | No |
| 390 × 900 | 200 | 521 ms | 524 ms | 996 ms | 0.0028 | 4,577,580 B | No |

\* Una sola navegación por ancho; valores de laboratorio, no métricas de usuarios reales. El LCP/CLS se observó durante una ventana corta de 1.5 s; no es un informe Lighthouse ni un promedio estable.

## Interacciones y errores

- React renderizó el H1 y las seis secciones de contenido en los cuatro tamaños.
- El menú móvil abrió y cerró correctamente a 390 px.
- El acordeón actualizó `aria-expanded` al pulsar la pregunta.
- No se capturaron errores JavaScript de página ni solicitudes fallidas.
- En la primera inspección de recursos del servidor Vite, la transferencia fue 4.58 MB/35 recursos; los elementos más grandes incluyeron chunks de dependencias compartidas, Supabase, CSS global y runtime de desarrollo. Este dato refuerza la necesidad de medir el bundle de producción antes de afirmar que el peso final está optimizado.

## Build y publicación

`npm run build` se inició dos veces y quedó en `transforming...` durante varios minutos sin terminar. Se interrumpió sin resultado; por eso no se conoce el peso de producción ni se considera validado el build. No se hizo commit ni push. Siguiente paso: volver a ejecutar el build en un entorno que termine la compilación, revisar los tamaños de `dist/assets` y medir Lighthouse en preview de producción antes de publicar.
