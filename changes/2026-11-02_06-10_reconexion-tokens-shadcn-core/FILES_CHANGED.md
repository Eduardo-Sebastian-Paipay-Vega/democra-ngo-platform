# FILES_CHANGED

## Modificados (7)

- `src/core/components/ui/button.tsx`
  Variantes `default/destructive/outline/ghost/link` de paleta fija a tokens
  (`bg-primary`, `bg-destructive/10 text-destructive`, `border-input`, `bg-accent`, `text-primary`).

- `src/core/components/ui/badge.tsx`
  `default`→`bg-primary`, `secondary`→`bg-secondary`, `destructive`→`bg-destructive/10 text-destructive`,
  `outline`→`border-border text-foreground`. `success`/`warning` sin cambios.

- `src/core/components/ui/card.tsx`
  `Card`: `bg-white border-neutral-200/60` → `bg-card text-card-foreground border-border`.
  `CardDescription`: `text-neutral-500` → `text-muted-foreground`.

- `src/core/components/ui/input.tsx`
  `bg-white border-neutral-200/60 ring-neutral-900 placeholder:text-neutral-500 ring-offset-white`
  → `bg-input-background border-input ring-ring placeholder:text-muted-foreground ring-offset-background`.
  Quitados los `dark:` redundantes.

- `src/core/components/ui/table.tsx`
  `TableFooter` `bg-neutral-100/50` → `bg-muted/50`; `TableRow` borde/hover/selected →
  `border-border`/`bg-muted/50`/`bg-muted`; `TableHead` y `TableCaption` → `text-muted-foreground`.

- `src/core/components/ui/dialog.tsx`
  Panel `bg-white border-neutral-200/60` → `bg-background border-border`; botón de cierre
  `ring-offset-white ring-neutral-900 data-[state=open]:bg-neutral-100` →
  `ring-offset-background ring-ring data-[state=open]:bg-accent`; `DialogDescription` → `text-muted-foreground`.
  Overlay `bg-black/50` sin cambios.

- `src/core/components/ui/dropdown-menu.tsx`
  `Content`/`SubContent` `bg-white text-neutral-900 border-neutral-200/60` →
  `bg-popover text-popover-foreground border-border`; `Item`/`CheckboxItem`/`RadioItem`/`SubTrigger`
  `focus:bg-neutral-100 focus:text-neutral-900` → `focus:bg-accent focus:text-accent-foreground`;
  `Separator` `bg-neutral-100` → `bg-muted`.

## NO modificados a propósito
- `src/core/components/ui/status-dot.tsx`, `status-pill.tsx`: componentes custom de estado
  (colores deliberados para el sidebar oscuro; sin token equivalente). Para Fase 2.
- `src/pages/landing/components/ui/button.tsx`: `default` ya usa tokens; `white/*` del hero
  oscuro es intencional. Se deja igual.
- `package.json` / `package-lock.json`: sin cambios (la línea canónica sí usa MUI/dnd-kit/hookform).
- `.claude/launch.json`: tooling local, sin trackear.

## Carpetas afectadas
- `src/core/components/ui/`
