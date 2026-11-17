# FILES_CHANGED — Fase 3 (lote 2)

## Modificados
| Archivo | Cambio |
|---|---|
| `ong/src/app/modules/projects/ProjectsWorkspace.tsx` | 450 colores a tokens (codemod). A mano: `text-zinc-100` y `bg-zinc-950/40` en plantillas multilínea, 5 `hover:text-white` neutros a `--t-text`, `focus:ring-offset-zinc-900` a `--t-surface`. |
| `ong/src/app/modules/people/components/MedicalRecordPanels.tsx` | 197 colores a tokens. Aviso «Trazabilidad activa» con `--t-warning` y `--t-text-secondary` (antes amarillos claros fijos). `#374151` a `--t-border-strong`. |
| `ong/src/app/pages/Attendance.tsx` | 214 colores a tokens. Filtros con `w-auto`. |
| `ong/src/app/pages/AccessControl.tsx` | 166 colores a tokens. Se mantiene `bg-white` en el QR. |
| `ong/src/app/pages/MedicalRecords.tsx` | 88 colores a tokens. **Eliminado el `style` en línea que redefinía `--t-*` con valores oscuros fijos.** Finales de línea CRLF a LF (neutro para git). |
| `scripts/codemods/colors-to-theme-tokens.mjs` | Soporta `ring-offset-*`, `hover:`/`group-hover:text-white` neutros, plantillas multilínea y prefijos con barra. |

## Creados
| Archivo | Contenido |
|---|---|
| `changes/2026-11-16_10-54_fase3-colores-a-tokens-lote2/*` | Este registro. |

## Eliminados
Ninguno.
