# CHANGELOG

- Fecha y hora: 2026-11-15 09:43 (America/Lima)
- Autor: Codex
- Objetivo: corregir la visualización de las respuestas al desplegar preguntas en la landing pública.
- Contexto: el acordeón mostraba las preguntas, pero la animación de apertura podía dejar la respuesta colapsada porque interpolaba `height` desde `0` hasta `auto`.
- Motivo: `auto` no es un destino fiable para animaciones CSS de altura en todos los navegadores.
- Solución implementada: la apertura conserva el renderizado y el atributo `hidden` existente; la animación ahora solo desvanece la respuesta durante 180 ms y no modifica su altura.
- Riesgos identificados: cambio limitado a la transición visual del acordeón; no cambia contenido, estado, persistencia ni datos.
- Impacto esperado: las respuestas quedan visibles y legibles al abrir la pregunta.
- Módulos afectados: landing pública, sección FAQ.
- Dependencias involucradas: ninguna nueva.
- Posibles efectos secundarios: se elimina la expansión animada por altura; el panel aparece con fundido breve.
- Estado del cambio: implementación completada. Build y suite web iniciados pero interrumpidos tras varios minutos sin terminar; Vitest emitió abortos de `happy-dom` y advertencias por tablas ausentes de Supabase. Jest terminó con 29 suites aprobadas y 4 fallidas por imports a módulos inexistentes; 369 pruebas aprobadas.
- Reversión: restaurar en `src/pages/landing/landing.css` el keyframe `lp-accordion` anterior y su declaración.

