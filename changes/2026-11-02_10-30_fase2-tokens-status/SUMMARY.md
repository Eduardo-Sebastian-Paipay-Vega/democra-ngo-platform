# SUMMARY — Fase 2 UI (parte 1): tokenizar indicadores de estado

## Qué se hizo
Se reconectaron `StatusDot` y `StatusPill` (`src/core/components/ui`) a un grupo de
tokens nuevo `--color-status-*`, eliminando los colores sueltos (clases de paleta
emerald/amber/red y hex crudos). Los tokens se añadieron a los **dos** `theme.css`
del repo (`src/modules/ong/styles` y `ong/src/styles`).

## Por qué se hizo
Era el ítem diferido de la Fase 1. Estos componentes viven sobre superficies
oscuras, por lo que no podían mapearse a los tokens shadcn semánticos sin perder
legibilidad. La solución: crear tokens de estado dedicados con los valores
actuales, centralizando la paleta sin cambiar la apariencia.

## Qué beneficio aporta
- Un único punto para ajustar los colores de estado de toda la app.
- Consistencia: fin de los hex crudos dispersos en estos componentes.
- Base para, a futuro, dar sensibilidad a tema (claro/oscuro) sin tocar los .tsx.

## Qué funcionalidades quedaron afectadas
Ninguna de comportamiento ni de apariencia. Solo la fuente de los colores de
`StatusDot` / `StatusPill`.

## Nota de alcance
La migración de estilos inline (`style={{…}}`, 1007 ocurrencias en 38 páginas,
dos árboles y dos sistemas de tokens) es multisesión y se deja como esfuerzo
incremental aparte; no entra en esta entrega.

## Verificación
- `npm run build`: OK; las 12 utilidades `.bg/.text-status-*` aparecen en el CSS.
- `npm run test:web`: 535/535, 0 fallos.
