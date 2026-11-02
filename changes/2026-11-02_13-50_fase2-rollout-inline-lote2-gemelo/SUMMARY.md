# SUMMARY — Fase 2 UI (rollout inline, lote 2): árbol gemelo

## Qué se hizo
Se aplicó el transform validado al segundo árbol de páginas ONG
(`src/modules/ong/app/pages/`): **540** estilos inline `style={{ var(--t-*) }}`
migrados a utilidades Tailwind de valor arbitrario en **27** archivos; **258**
dejados inline a propósito.

## Por qué se hizo
Completar el patrón limpio de migración en ambos árboles de páginas (el lote 1 cubrió
`ong/src/app/pages/`). Sin cambio visual: `--t-*` es conmutable por tema y se
preserva la variable dentro de la utilidad.

## Cómo se hizo
Misma herramienta conservadora que el lote 1, sin cambios. Solo migra casos seguros
(tag HTML minúscula, props `var(--t-*)` puras, `className` estático en la línea, sin
conflicto de cascada); el resto se deja inline y se reporta.

## Qué beneficio aporta
- 540 estilos inline menos en 27 páginas del gemelo.
- Con el lote 1 (584), los dos árboles de páginas quedan migrados en su patrón limpio.

## Qué funcionalidades quedaron afectadas
Ninguna. Mismo render, mismos colores, mismo cambio de tema.

## Verificación
- `npm run build`: OK (exit 0). Tokens presentes en el CSS emitido.
- `npm run test:web`: 535/535, 0 fallos.
- Revisión manual del diff (Roles.tsx, MyProfile.tsx y páginas comunes).

## Pendiente
- SKIP multilínea de ambos árboles (~566).
- Limpieza hex → tokens bento; definir/quitar `--t-shadow`.
