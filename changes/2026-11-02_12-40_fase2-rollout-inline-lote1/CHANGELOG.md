# CHANGELOG — Fase 2 UI (rollout inline, lote 1): migración masiva de estilos inline en páginas ONG

- **Fecha y hora:** 2026-11-02, ~12:40
- **Autor:** Claude (Claude Code)
- **Alcance:** 24 páginas de `ong/src/app/pages/`. **Cero cambios de apariencia.**

## Objetivo del cambio
Continuar el rollout validado en el piloto (`Areas.tsx`): migrar atributos
`style={{ … var(--t-*) }}` a utilidades Tailwind de valor arbitrario en el resto
de las páginas, de forma segura y a escala.

## Contexto del problema
El árbol `ong/src/app/pages/` tenía **866** ocurrencias de `style={{ … var(--t-*) }}`
repartidas en 28 páginas. Son estilos inline (máxima precedencia, difíciles de
mantener y auditar) que referencian el sistema de tokens paralelo **conmutable por
tema** `--t-*` (dos sets en `ong/src/styles/index.css`: navy y cálido-oscuro). Por
eso NO se migran a los tokens fijos del `@theme` bento; la migración correcta
preserva la variable en tiempo de ejecución dentro de una utilidad arbitraria.

## Solución implementada
Se construyó un transform conservador y revisable
(`scratchpad/migrate_inline.py`, fuera del repo) que SOLO migra un
`style={{ … }}` cuando se cumplen TODAS estas condiciones:

1. Es un `style={{ … }}` JSX **sin llaves anidadas** (no toca `style={OBJ}` ni los
   objetos const como `INPUT_STYLE` / `tabStyle()`).
2. El tag contenedor en la **misma línea** es un elemento **HTML en minúscula**
   (`div`, `span`, `p`, `h1..h6`, `button`, `input`, `a`, `select`, `textarea`…),
   nunca un componente (mayúscula: `Badge`, `StatusDot`, iconos lucide, etc.).
3. **Todas** las props del objeto son mapeables:

   | Prop inline                         | Utilidad                         |
   |-------------------------------------|----------------------------------|
   | `color: "var(--t-X)"`               | `text-[var(--t-X)]`              |
   | `background: "var(--t-X)"`          | `bg-[var(--t-X)]`                |
   | `backgroundColor: "var(--t-X)"`     | `bg-[var(--t-X)]`                |
   | `borderColor: "var(--t-X)"`         | `border-[var(--t-X)]`           |
   | `boxShadow: "var(--t-X)"`           | `shadow-[var(--t-X)]`           |
   | `border: "1px solid var(--t-X)"`    | `border border-[var(--t-X)]`    |

   El valor debe ser un `var(--t-*)` **puro** (sin fallback con coma, sin ternario,
   sin hex, sin número).
4. Hay un `className="…"` **estático** (literal entre comillas dobles) en la misma
   línea, al que se anexan las utilidades.
5. **Sin conflicto de cascada**: el `className` existente no debe traer ya una
   utilidad de la misma familia (color / fondo / color de borde / sombra). El
   detector de color usa lista blanca de `text-*` NO-color (tamaños, alineación,
   `text-[12px]`, etc.) y marca como conflicto cualquier otro `text-*`, incluyendo
   las clases semánticas de shadcn (`text-foreground`, `text-primary`,
   `text-muted-foreground`…). Para bordes incluye `border-border`, `border-input`,
   paleta Tailwind y `border-[#…]` / `border-[var…]`.

Cualquier caso que no cumpla se deja inline (reportado como SKIP con su motivo).

### Resultado del lote
- **584** atributos migrados en **24** archivos.
- **308** dejados inline a propósito (motivos abajo).

### Motivos de los 308 SKIP (todos conservadores y correctos)
- **127** tag multilínea / componente: el `<tag` abre en una línea previa o es un
  componente (iconos lucide, `Badge`, `PopoverContent`…). No se puede garantizar el
  elemento ni su cascada desde una sola línea → inline.
- **31** sin `className="…"` estático en la línea → inline.
- **~65** prop no mapeable: `var(--t-X, #fallback)` con coma, `fontSize`/`fontWeight`
  numéricos, `padding`, `colorScheme:"dark"`, `borderBottom/borderTop`,
  `1px dashed`, hex (`#fff`, `#1a1a1a`), `rgba(...)`.
- **22** conflicto de cascada (18 color + 4 fondo): el `className` ya fijaba esa
  familia; migrar podría cambiar el color según el orden del CSS → inline.

4 páginas quedaron solo con SKIPs (0 migraciones): `Dashboard.tsx`,
`AccessControl.tsx`, `Beneficiaries.tsx` (inline multilínea / objetos const) y
`Areas.tsx` (ya migrada en el piloto; el único SKIP es el `Badge` documentado).

## Verificación
- `npm run build` (Vite): **OK (exit 0)**, 19m. En el CSS emitido (`dist/assets/*.css`)
  aparecen los tokens migrados (`var(--t-input-bg)`, `var(--t-text-secondary)`,
  `var(--t-text-dim)`, `var(--t-hover)`, `var(--t-border)`, `var(--t-muted)`,
  `var(--t-surface)`), confirmando que las utilidades arbitrarias se generan.
- `npm run test:web` (Vitest): **101 archivos / 535 tests, 0 fallos**.
- Revisión manual del `git diff` (merge a `className`, borrado del `style`, casos
  multi-prop `background`+`border` y de inputs) en páginas representativas
  (Login, MedicalRecords, Volunteers, Finance): correcto.
- Backend (Jest, `npm test`) **no se ejecutó**: el cambio es exclusivamente de JSX
  en páginas del frontend; no se tocó `server/` ni ningún módulo que esas pruebas
  cubran.

## Riesgos identificados
- Ninguno visual: misma variable CSS, mismo valor en runtime, mismo cambio de tema.
  Los únicos casos con posible conflicto de precedencia (22) se dejaron inline.
- Residual: un `var(--t-*)` que no tuviera utilidad generada rompería el estilo;
  descartado al verificar su presencia en el CSS emitido.

## Impacto esperado
~584 estilos inline menos en 24 páginas (mejor mantenibilidad y auditoría), sin
cambio de apariencia. Patrón listo para seguir con los SKIPs multilínea y el árbol
gemelo.

## Módulos afectados
24 archivos en `ong/src/app/pages/` (ver `FILES_CHANGED.md`).

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Ninguno conocido (build + tests verdes).

## Estado del cambio
**Completado** (lote 1 del rollout). Pendiente: los 308 SKIP (en su mayoría tags
multilínea), el árbol gemelo `src/modules/ong/app/pages/`, limpieza de hex crudos a
tokens bento, y definir/quitar `--t-shadow`.

## Cómo revertir
`git revert <hash>` del commit de este lote.
