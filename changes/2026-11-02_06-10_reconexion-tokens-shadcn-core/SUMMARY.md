# SUMMARY — Reconexión shadcn a tokens (src/core)

## Qué se hizo
- Se reconectaron 7 primitivos base de shadcn (`button`, `badge`, `card`, `input`, `table`,
  `dialog`, `dropdown-menu`) de `src/core/components/ui/` para que usen los **tokens del
  tema** en vez de paleta fija `neutral-*`/`white`/`red-*` con `dark:` manuales.
- Trabajo hecho sobre la **estructura canónica** del repo, tras alinear el clon local
  (que estaba ~2 meses atrás) con `origin/main`, con backup previo del estado local.

## Por qué se hizo
El tema ya tenía los tokens bien definidos (incluido `--primary` azul de marca), pero estos
primitivos los ignoraban (el botón primario salía negro). Unificar el color en un solo
origen y dejar la coherencia claro/oscuro automática.

## Qué beneficio aporta
- Identidad de marca consistente (botón/badge primario en azul) y claro/oscuro coherente.
- Un solo sistema de diseño activo (shadcn + Tailwind v4 + tokens).

## Qué funcionalidades quedaron afectadas
Solo apariencia de 7 primitivos UI. Sin cambios de lógica. Build ✅; vitest 531/535 (los 4
fallos son tests de servicios no tocados: 3 timeouts ambientales + 1 aserción preexistente
en `origin/main`). `status-dot`/`status-pill` y la landing se dejaron a propósito (ver CHANGELOG).
