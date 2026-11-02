# FILES_CHANGED

## Modificados (4)

- `src/modules/ong/styles/theme.css`
  En `@theme inline` se añadió el grupo `--color-status-{success,warning,
  destructive,info,secondary,default}` con los valores actuales (emerald-400 /
  amber-400 / red-400 + hex previos).

- `ong/src/styles/theme.css`
  Mismo grupo `--color-status-*`, idénticos valores (segundo árbol de app; ambos
  renderizan los componentes compartidos de `src/core`).

- `src/core/components/ui/status-dot.tsx`
  `dotColors` / `textColors` reconectados de `bg-emerald-400` / `bg-[#9B7AEA]` /
  … a `bg-status-*` / `text-status-*`. Se conservan las opacidades (secondary `/50`,
  default `/40`).

- `src/core/components/ui/status-pill.tsx`
  Igual reconexión a `bg-status-*` / `text-status-*`, conservando las opacidades
  (dot secondary `/60`, default `/60`; texto `/90` y default `/80`).

## NO modificados
- Ningún componente que consume StatusDot/StatusPill (la API no cambió).
- No se migraron estilos inline (diferido; ver CHANGELOG, "Decisión de alcance").
- `badge.tsx` no se tocó: su success/warning ya usa paleta Tailwind con variantes
  claro/oscuro, patrón distinto adecuado a superficies temáticas (no oscuras fijas).

## Creados (auditoría)
- `changes/2026-11-02_10-30_fase2-tokens-status/CHANGELOG.md`
- `changes/2026-11-02_10-30_fase2-tokens-status/SUMMARY.md`
- `changes/2026-11-02_10-30_fase2-tokens-status/FILES_CHANGED.md`

## Carpetas afectadas
- `src/modules/ong/styles/`
- `ong/src/styles/`
- `src/core/components/ui/`
- `changes/`
