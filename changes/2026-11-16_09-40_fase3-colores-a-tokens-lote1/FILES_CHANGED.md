# FILES_CHANGED — Fase 3 (lote 1)

## Creados
| Archivo | Contenido |
|---|---|
| `scripts/codemods/colors-to-theme-tokens.mjs` | Codemod reproducible: neutros y hex oscuros a tokens `--t-*` (modo `--dry`, idempotente). |
| `changes/2026-11-16_09-40_fase3-colores-a-tokens-lote1/*` | Este registro. |

## Modificados
| Archivo | Cambio |
|---|---|
| `ong/src/app/pages/Hours.tsx` | 173 colores a tokens. Botón «Reintentar» con `--t-danger`. Filtros con `w-auto`. Eliminados 3 `// @ts-ignore` que se mostraban como texto. |
| `ong/src/app/pages/Evidence.tsx` | 181 colores a tokens. Botón «Reintentar» con `--t-danger`. Filtros con `w-auto`. |
| `ong/src/app/pages/Catalogs.tsx` | 45 colores a tokens. Hover multilínea a `--t-hover`. Ítem seleccionado con `--t-active` y no seleccionado transparente. |
| `ong/src/app/pages/Roles.tsx` | 32 colores a tokens. `bg-black/20` a `--t-hover`. |
| `ong/src/app/pages/Attendance.tsx` | Eliminado 1 `// @ts-ignore` que se mostraba como texto en JSX. |
| `src/core/styles/core-ui.css` | Las reglas de `input/select/textarea/label` pasan a `@layer base`, para que las utilidades de Tailwind puedan sobrescribirlas. |

## Eliminados
Ninguno.

## No incluidos
`.claude/launch.json`, `.claude/landing-design/**` (configuración y evidencia local).
