# CHANGELOG — Fase 2 UI (parte 1): tokenizar StatusDot / StatusPill

- **Fecha y hora:** 2026-11-02, ~10:30
- **Autor:** Claude (Claude Code)
- **Alcance:** tokens de color de estado + dos componentes de `src/core`. **Cero
  cambios de apariencia** (los tokens replican los colores vigentes).

## Objetivo del cambio
Completar el ítem diferido de la Fase 1: alinear a tokens los dos wrappers de
indicadores de estado (`status-dot.tsx` y `status-pill.tsx`), que seguían usando
colores sueltos (clases de paleta `emerald-400` / `amber-400` / `red-400` y hex
crudos `#9B7AEA` / `#A7A7A7` / `#F5F5F5`) en vez de un token central.

## Contexto del problema
En la Fase 1 estos componentes se dejaron fuera a propósito: renderizan sobre
superficies oscuras (sidebar / bento), donde el token semántico `--destructive`
(#7f1d1d en oscuro) sería casi ilegible. Por eso no se podían mapear sin más a los
tokens shadcn existentes. Además no existen tokens `--success` / `--warning` /
`--info` en el tema (sólo `--destructive` y los acentos del bento).

Arquitectura relevante: hay **dos** `theme.css` paralelos (uno por árbol de app):
`src/modules/ong/styles/theme.css` y `ong/src/styles/theme.css`. Ambos renderizan
los mismos componentes compartidos de `src/core` (vía alias `@` → `src`). Para que
las utilidades resuelvan en los dos árboles, los tokens deben existir en ambos.

## Solución implementada
Se introduce un grupo de tokens de estado **con los valores actuales** (sin cambio
visual), centralizado en un único punto de ajuste:

En el bloque `@theme inline` de **ambos** `theme.css`:
```css
--color-status-success: #34d399;      /* = emerald-400 */
--color-status-warning: #fbbf24;      /* = amber-400  */
--color-status-destructive: #f87171;  /* = red-400    */
--color-status-info: #9b7aea;         /* = hex previo */
--color-status-secondary: #a7a7a7;    /* = hex previo */
--color-status-default: #f5f5f5;      /* = hex previo */
```

Se mantienen constantes en claro/oscuro para no alterar la apariencia vigente
(los componentes nunca tuvieron variantes `dark:`); queda como follow-up afinar
contraste por tema si se desea.

`status-dot.tsx` y `status-pill.tsx` se reconectan a esas utilidades
(`bg-status-*` / `text-status-*`), conservando **exactamente** los mismos niveles
de opacidad que antes:
- StatusDot: secondary `/50`, default `/40` en el punto; texto sin opacidad.
- StatusPill: secondary `/60`, default `/60` en el punto; texto `/90` (success,
  warning, destructive, info) y default `/80`.

## Decisión de alcance (importante)
La Fase 2 que se había descrito incluía además "migrar estilos inline
página-por-página". Medido el alcance real: **1007 ocurrencias de `style={{…}}` en
38 páginas**, repartidas en árboles duplicados y con **dos** sistemas de tokens
(shadcn `--*` y `--t-*`, este último en 74 archivos). Eso es trabajo multisesión,
no un solo pase, y gran parte ya es `var(--t-*)` (temático). Por eso esta entrega
se acota a la tokenización de los indicadores de estado y la migración de inline
styles se deja como esfuerzo incremental aparte (elegir página piloto).

## Verificación
- `npm run build` (Vite): **OK (exit 0)**. Además, en el CSS emitido aparecen las
  12 utilidades `.bg-status-*` / `.text-status-*`, lo que confirma que los tokens
  resuelven y las clases se generan (sin clases sin resolver → sin regresión).
- `npm run test:web`: **101 archivos / 535 tests, 0 fallos** (StatusDot se renderiza
  dentro de los tests de Areas).
- Revisión visual en vivo: pendiente/ofrecida (cambio de color = idéntico por
  construcción; los tokens tienen el mismo hex que antes).

## Riesgos identificados
- Ninguno visual: los valores de los tokens son idénticos a los colores previos.
- Si en el futuro se cambian los valores de `--color-status-*`, afectará a todos
  los usos de StatusDot/StatusPill a la vez (ese es justamente el objetivo).

## Impacto esperado
Un único punto para ajustar la paleta de indicadores de estado; base para, más
adelante, darles sensibilidad a tema (claro/oscuro) sin tocar los componentes.

## Módulos afectados
- `src/modules/ong/styles/theme.css`
- `ong/src/styles/theme.css`
- `src/core/components/ui/status-dot.tsx`
- `src/core/components/ui/status-pill.tsx`

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Ninguno conocido. Mismas clases de opacidad, mismos colores.

## Estado del cambio
**Completado** (parte 1 de Fase 2; migración de inline styles diferida).

## Cómo revertir
`git revert <hash>`, o restaurar los bloques `dotColors`/`textColors` previos en
los dos componentes y borrar los tokens `--color-status-*` de ambos `theme.css`.
