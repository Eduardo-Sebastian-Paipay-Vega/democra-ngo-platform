# FILES_CHANGED

## Modificados (1)

- `ong/src/app/pages/Areas.tsx`
  14 atributos `style={{ … }}` basados en `var(--t-*)` convertidos a utilidades
  Tailwind de valor arbitrario equivalentes:
  - `color: var(--t-text)` → `text-[var(--t-text)]` (×4: col. ÁREA, 2 headings de
    estados vacío/error, heading de modal)
  - `color: var(--t-text-secondary)` → `text-[var(--t-text-secondary)]` (×3)
  - `color: var(--t-text-dim)` → `text-[var(--t-text-dim)]` (×2: subtítulo modal,
    nota del switch)
  - `color: var(--t-muted)` → `text-[var(--t-muted)]` (icono FolderOpen)
  - `background: var(--t-surface)` + `borderColor: var(--t-border)` +
    `boxShadow: var(--t-shadow)` → `bg-[var(--t-surface)] border-[var(--t-border)]
    shadow-[var(--t-shadow)]` (×2: paneles de error y vacío)
  - `background: var(--t-hover)` → `bg-[var(--t-hover)]` (círculo del estado vacío)
  - `borderColor: var(--t-border)` + `background: var(--t-hover)` →
    `border-[var(--t-border)] bg-[var(--t-hover)]` (fila del switch en modal)

## NO modificado (a propósito)
- 1 `style` en `<Badge variant="outline">` (col. ÁREA): la variante `outline` ya
  fija `text-foreground`; migrar entraría en conflicto de cascada. Documentado en
  CHANGELOG.
- No se tocaron las clases de hex crudo (`bg-[#171512]`, etc.): es otra limpieza
  (hex → tokens bento) con matices de semántica de tema; queda como follow-up.
- No se tocó el gemelo `src/modules/ong/app/pages/Areas.tsx` (otra iteración).

## Creados (auditoría)
- `changes/2026-11-02_11-15_fase2-piloto-inline-areas/CHANGELOG.md`
- `changes/2026-11-02_11-15_fase2-piloto-inline-areas/SUMMARY.md`
- `changes/2026-11-02_11-15_fase2-piloto-inline-areas/FILES_CHANGED.md`

## Carpetas afectadas
- `ong/src/app/pages/`
- `changes/`
