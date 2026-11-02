# CHANGELOG — Reconexión de componentes shadcn a tokens de tema (src/core)

- **Fecha y hora:** 2026-11-02, ~06:10
- **Autor:** Claude (Claude Code)
- **Alcance:** `src/core/components/ui/` (7 primitivos shadcn)

## Objetivo del cambio
Que los primitivos base de shadcn/ui de la app (estructura canónica `src/core/components/ui/`)
usen los **tokens semánticos** del tema (`--primary`, `--background`, `--muted`, etc.,
definidos en `src/modules/ong/styles/theme.css`) en lugar de una paleta fija
`neutral-*`/`white`/`red-*` con variantes `dark:` manuales.

## Contexto del problema
Tras sincronizar el repo local con `origin/main` (ver nota de sincronización abajo), se
re-auditó el uso de shadcn/ui sobre la **estructura real y canónica** del proyecto:

- Los tokens del tema están bien definidos y son el set shadcn v4 estándar
  (`theme.css` con `:root`/`.dark` + `@theme inline`), con `--primary` = azul de marca
  `#002efe` (claro) / `#3d6bff` (oscuro).
- Pero 7 primitivos de `src/core/components/ui/` estaban escritos con paleta fija e
  **ignoraban los tokens**. En particular el `Button` por defecto era `bg-neutral-900`
  (negro) en vez del azul de marca.

> **Nota de sincronización previa:** el clon local `D:\espelo` había divergido de
> `origin/main`. El remote (canónico, desplegado por Vercel) estaba ~2 meses adelante con
> una reorganización donde los componentes viven en `src/core/` (ya no en `ong/src/app/`).
> Se creó un branch de respaldo `backup/local-prerefactor-2026-11-02` (commit `85bb810`) y
> se alineó `main` local a `origin/main` (`53f8184`) antes de este trabajo. No hubo
> force-push; el trabajo previo quedó íntegro en el backup.

## Motivo de la modificación
Consistencia del sistema de diseño: un solo origen de color (los tokens) para que el cambio
de marca se propague solo y el producto respete la identidad visual, con coherencia
claro/oscuro automática (los tokens ya cambian con `.dark`, así que se eliminaron los
`dark:` manuales redundantes).

## Solución implementada
Reconexión a tokens de los **7 primitivos shadcn estándar** hardcodeados:

- `button.tsx`: variantes `default/destructive/outline/ghost/link`
  - `bg-neutral-900 text-neutral-50` → `bg-primary text-primary-foreground hover:bg-primary/90`
  - `bg-red-500/10 text-red-600` → `bg-destructive/10 text-destructive`
  - `border-neutral-200/60 … hover:bg-neutral-100` → `border-input … hover:bg-accent hover:text-accent-foreground`
  - `text-neutral-900` (link) → `text-primary`
- `badge.tsx`: `default`→`bg-primary`, `secondary`→`bg-secondary`, `destructive`→`bg-destructive/10 text-destructive`, `outline`→`border-border text-foreground`. `success`/`warning` se mantienen (no hay token equivalente).
- `card.tsx`: `bg-white border-neutral-200/60` → `bg-card text-card-foreground border-border`; `CardDescription` `text-neutral-500` → `text-muted-foreground`.
- `input.tsx`: `bg-white border-neutral-200/60 ring-neutral-900 placeholder:text-neutral-500 ring-offset-white` → `bg-input-background border-input ring-ring placeholder:text-muted-foreground ring-offset-background`. Quitados los `dark:` redundantes.
- `table.tsx`: `TableFooter` `bg-neutral-100/50` → `bg-muted/50`; `TableRow` borde/hover/selected → `border-border`/`bg-muted/50`/`bg-muted`; `TableHead` y `TableCaption` `text-neutral-500` → `text-muted-foreground`.
- `dialog.tsx`: panel `bg-white border-neutral-200/60` → `bg-background border-border`; botón de cierre `ring-offset-white ring-neutral-900 data-[state=open]:bg-neutral-100` → `ring-offset-background ring-ring data-[state=open]:bg-accent`; `DialogDescription` → `text-muted-foreground`. Overlay `bg-black/50` sin cambios (estándar shadcn).
- `dropdown-menu.tsx`: `Content`/`SubContent` `bg-white text-neutral-900 border-neutral-200/60` → `bg-popover text-popover-foreground border-border`; `Item`/`CheckboxItem`/`RadioItem`/`SubTrigger` `focus:bg-neutral-100 focus:text-neutral-900` → `focus:bg-accent focus:text-accent-foreground`; `Separator` `bg-neutral-100` → `bg-muted`.

## NO incluido a propósito
- **`status-dot.tsx` / `status-pill.tsx`** (componentes custom, no primitivos shadcn):
  usan colores de estado deliberados (`emerald-400`/`amber-400`/`red-400` y hex para
  info/secondary/default) pensados para legibilidad sobre el sidebar oscuro. No existen
  tokens `--success`/`--warning`, y mapear `destructive` al token oscuro (`#7f1d1d`)
  reduciría el contraste del indicador. Se dejan para una Fase 2 de wrappers custom.
- **`src/pages/landing/components/ui/button.tsx`**: su variante `default` **ya usa tokens**
  (`bg-primary`); los `white/5`/`text-white` de `ghost`/`outline` son el diseño intencional
  del hero oscuro de la landing (que no importa `theme.css`). No es mal uso: se deja igual.
- `package.json` / dependencias: esta línea canónica **sí usa** MUI/dnd-kit/hookform, así
  que NO se tocaron dependencias (a diferencia del trabajo previo sobre la estructura vieja).

## Verificación
- `npm install`: exit 0 (node_modules se reconcilió con el `package.json` canónico).
- `npm run build`: ✅ exit 0, compila. Solo el aviso preexistente de tamaño de chunks.
- `npm run test:web` (vitest): **531/535** en verde. Los 4 fallos están TODOS en tests de
  la capa de servicios (`ong/src/app/services/...`, mocks de Supabase) que **no se tocaron**:
  - 3 son `Test timed out in 5000ms` (ambientales; TST-ERR-118 pasa en aislamiento con timeout holgado).
  - 1 (`TST-ERR-087` `archiveProject`) falla también aislado con 30s → aserción
    **preexistente en `origin/main`**, ajena a este cambio (cero relación con los componentes UI).
- No existen tests dedicados para los primitivos de `src/core/components/ui`, y ninguno de
  los fallos involucra los archivos modificados.

## Riesgos identificados
- Cambio **visual** intencional: botón/badge primario pasan de negro a azul de marca;
  superficies (card/dialog/input/dropdown) derivan del token de fondo. Requiere revisión
  visual en la app.
- Ninguno funcional: solo cambian strings de `className`.

## Impacto esperado
UI coherente con la identidad de marca y con el tema claro/oscuro, sin tocar lógica.

## Módulos afectados
Capa de componentes `src/core/components/ui`. No afecta backend, servicios, ni la landing.

## Dependencias involucradas
Ninguna modificada. `package.json` y `package-lock.json` sin cambios en este commit.

## Posibles efectos secundarios
- Cualquier lugar que dependiera visualmente del botón negro verá el azul de marca (esperado).

## Estado del cambio
**Completado** (reconexión de los 7 primitivos shadcn estándar).

## Cómo revertir
`git revert <hash>` o restaurar los 7 archivos listados en FILES_CHANGED.md.
