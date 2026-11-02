# CHANGELOG — Fase 2 UI (rollout inline, lote 2): árbol gemelo `src/modules/ong/app/pages/`

- **Fecha y hora:** 2026-11-02, ~13:50
- **Autor:** Claude (Claude Code)
- **Alcance:** 27 páginas de `src/modules/ong/app/pages/` (árbol gemelo). **Cero
  cambios de apariencia.**

## Objetivo del cambio
Aplicar el mismo transform validado en los lotes previos al segundo árbol de
páginas ONG (`src/modules/ong/app/pages/`), que es un duplicado paralelo de
`ong/src/app/pages/` y renderiza los mismos componentes compartidos de `src/core`.

## Contexto del problema
El árbol gemelo tenía **782** ocurrencias de `style={{ … var(--t-*) }}` en 29
páginas. Mismo sistema de tokens `--t-*` conmutable por tema; misma motivación que
el lote 1 (quitar estilos inline difíciles de mantener/auditar sin cambio visual).

## Solución implementada
Se reutilizó, sin cambios, el transform conservador
`scratchpad/migrate_inline.py` (documentado en el CHANGELOG del lote 1). Reglas
idénticas: solo `style={{…}}` sin llaves anidadas, en tag HTML minúscula, con todas
las props mapeables a `var(--t-*)` puro, con `className="…"` estático en la misma
línea, y sin conflicto de cascada (detector color/fondo/borde/sombra incl. clases
semánticas shadcn).

### Resultado del lote
- **540** atributos migrados en **27** archivos.
- **258** dejados inline a propósito.

### Motivos de los 258 SKIP (conservadores)
- **158** tag multilínea / componente.
- **41** sin `className="…"` estático en la línea.
- **~49** prop no mapeable: `borderBottom:"1px solid var(--t-border)"` (23),
  `var(--t-X, #fallback)` con coma, `fontSize`/`opacity` numéricos, `border`/`bg`
  con `var(--t-danger…)` con fallback.
- **10** conflicto de cascada (color): `className` ya fijaba el color → inline.

2 páginas quedaron solo con SKIPs (0 migraciones): `AccessControl.tsx` (objetos
const `INPUT_STYLE`/`tabStyle()`) y `MyAccountSettings.tsx` (inline multilínea).

## Verificación
- `npm run build` (Vite): **OK (exit 0)**, ~17m. Tokens migrados presentes en el
  CSS emitido (`dist/assets/*.css`).
- `npm run test:web` (Vitest): **101 archivos / 535 tests, 0 fallos**.
- Revisión manual del `git diff` en páginas exclusivas del gemelo (`Roles.tsx`,
  `MyProfile.tsx`) y comunes: correcto (merge a `className`, borrado del `style`).
- Backend (Jest, `npm test`) **no se ejecutó**: cambio exclusivo de JSX en páginas
  frontend; no se tocó `server/`.

## Riesgos identificados
- Ninguno visual: misma variable CSS, mismo valor en runtime, mismo cambio de tema.
  Los 10 casos con posible conflicto de precedencia se dejaron inline.

## Impacto esperado
~540 estilos inline menos en 27 páginas del gemelo, sin cambio de apariencia. Con el
lote 1, el patrón limpio de `style={{ var(--t-*) }}` queda migrado en ambos árboles
de páginas.

## Módulos afectados
27 archivos en `src/modules/ong/app/pages/` (ver `FILES_CHANGED.md`).

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Ninguno conocido (build + tests verdes).

## Estado del cambio
**Completado** (lote 2). Pendiente global: los SKIP multilínea de ambos árboles
(~566 en total), limpieza de hex crudos a tokens bento, y definir/quitar
`--t-shadow`.

## Cómo revertir
`git revert <hash>` del commit de este lote.
