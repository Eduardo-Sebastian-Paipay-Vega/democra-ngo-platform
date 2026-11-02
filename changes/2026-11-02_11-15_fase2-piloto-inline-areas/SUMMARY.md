# SUMMARY — Fase 2 UI (parte 2, piloto): estilos inline en Areas.tsx

## Qué se hizo
Piloto de migración de estilos inline en `ong/src/app/pages/Areas.tsx`: 14 de 15
`style={{ … }}` que usaban `var(--t-*)` se convirtieron a utilidades Tailwind de
valor arbitrario (`text-[var(--t-text)]`, `bg-[var(--t-surface)]`,
`border-[var(--t-border)]`, etc.). La página pasó de 15 → 1 estilos inline.

## Por qué se hizo
Para fijar un patrón repetible y seguro antes de tocar las ~37 páginas restantes.
Clave: `--t-*` es conmutable por tema (dos sets en `index.css`), así que NO se migra
a los tokens fijos del `@theme`; se preserva la variable en una clase arbitraria,
manteniendo color y cambio de tema idénticos.

## Qué beneficio aporta
- Patrón validado (build + tests) para el resto de la migración.
- Menos estilos inline (mejor mantenibilidad y auditoría), sin cambio visual.

## Qué funcionalidades quedaron afectadas
Ninguna. Mismo render, mismos colores.

## Excepciones / notas
- 1 `style` queda en el `Badge variant="outline"` (su variante ya fija
  `text-foreground`; migrar chocaría en la cascada). Se documenta el criterio.
- `--t-shadow` está sin definir (sombra nula); se preserva el comportamiento y se
  marca como follow-up (definir o quitar).

## Verificación
- `npm run build`: OK; las 8 referencias `var(--t-*)` migradas aparecen en el CSS.
- `npm run test:web`: 535/535, 0 fallos.

## Pendiente
~37 páginas más (y el árbol `src/modules/ong/app/pages/`) con el mismo patrón.
