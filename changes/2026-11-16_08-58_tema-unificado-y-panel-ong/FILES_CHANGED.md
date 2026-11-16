# FILES_CHANGED — Tema unificado y Panel principal ONG

## Modificados

| Archivo | Cambio |
|---|---|
| `src/core/context/SettingsContext.tsx` | Tipo `ThemeIntensity` + campo `themeIntensity`; caché `democra.settings.v1` (`readCache`/`writeCache`); prop `defaultTheme`; `resolveTheme` exportado; `refreshSettings` en `SIGNED_IN`; persiste `themeIntensity`. |
| `ong/src/app/lib/theme-context.tsx` | ThemeProvider sin estado propio: deriva tema/intensidad de `useSettings()`; hook `useSystemPrefersDark`; setters vía `saveSettings`; elimina `localStorage app-theme/app-intensity`. |
| `src/core/shell/Topbar.tsx` | Botón de tema usa `toggleTheme` del ThemeProvider; elimina uso directo de `useSettings`. |
| `ong/src/main.tsx` | `<SettingsProvider defaultTheme="light">`. |
| `ong/src/styles/theme.css` | Tokens del Panel (`--color-bg-*`, `--color-text-*`, `--color-accent-*`, `--color-border-subtle`) → `var(--t-*)`. |
| `ong/src/styles/index.css` | Autocompletado WebKit con `var(--t-text)` / `var(--t-surface)` en vez de oscuro fijo. |
| `ong/src/app/pages/Dashboard.tsx` | `zinc-*`/hex → tokens `--t-*`; mojibake reparado (67 líneas); `formatAgendaTime()` para la hora real; subtítulo del gráfico «últimos 7 días». |
| `ong/src/app/modules/home/homeDashboardService.ts` | `fetchTodayTimeline` calcula `assignedCount` real con nueva `getAssignedCountMap()` (consulta `ong.asignaciones_actividad`). |

## Creados

| Archivo | Contenido |
|---|---|
| `docs/audits/AUDIT-ong-ui-2026-11-16.md` | Auditoría de UI/tema de `/ong` que origina este cambio (hallazgos + plan de 5 fases). |
| `changes/2026-11-16_08-58_tema-unificado-y-panel-ong/*` | Este registro. |

## Eliminados
Ninguno.

## No incluidos (intencionalmente)
- `.claude/launch.json` y `.claude/landing-design/**` (configuración/evidencia local).
- `src/modules/ong/**` (copia duplicada no servida; Fase 3).
