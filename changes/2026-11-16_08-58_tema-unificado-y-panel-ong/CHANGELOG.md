# CHANGELOG — Tema unificado y correcciones del Panel principal ONG

- **Fecha y hora:** 2026-11-16 08:58 (America/Lima)
- **Autor:** Claude (Claude Code), a pedido del usuario («Fases 1 y 2»)
- **Origen:** `docs/audits/AUDIT-ong-ui-2026-11-16.md` (hallazgos A-1…A-4, B-1…B-4, D-3)
- **Estado:** Completado (verificado en local con la org demo; pendiente de release a producción)

## Objetivo

1. **Fase 1 — tema:** que `/ong` tenga **una sola fuente de verdad** para claro/oscuro e intensidad, que el botón del Topbar funcione, que el Panel principal sea legible en ambos modos y que la preferencia guardada del usuario se aplique.
2. **Fase 2 — contenido:** corregir textos corruptos (mojibake), el contador de voluntarios de la agenda, la hora de la agenda, el subtítulo del gráfico y el autocompletado forzado a oscuro.

## Contexto del problema

En `/ong` convivían tres sistemas de tema sin sincronizar:

| Sistema | Archivo | Persistencia | Qué controlaba |
|---|---|---|---|
| ThemeProvider | `ong/src/app/lib/theme-context.tsx` | `localStorage app-theme` | tokens `--t-*` (colores reales de la UI) |
| SettingsContext | `src/core/context/SettingsContext.tsx` | `profiles.preferences` (BD) | clase `.dark` + `data-theme` |
| Tokens fijos | `ong/src/styles/theme.css` (`--color-bg-main`…) | — | Panel principal (hex oscuros fijos) |

Consecuencias observadas en vivo:
- El botón sol/luna del Topbar llamaba a `SettingsContext.saveSettings`, pero los colores salen del ThemeProvider → **no cambiaba nada visible** (`--t-bg` seguía en `#F8F7F5` tras varios clics).
- `SettingsContext` arrancaba en `'dark'` y ponía `.dark` aun en modo claro → variantes `dark:` activas sobre fondo claro.
- El Panel principal usaba `#100F0D` fijo + `text-zinc-*` y títulos con `--t-text` (oscuro en claro) → **negro sobre negro**.
- La preferencia se guardaba en BD (`preferences.theme = "dark"` verificado), pero el ThemeProvider leía `localStorage`, que nadie escribía → **preferencias no aplicadas**.
- `Dashboard.tsx` tenía 67 líneas con mojibake (`mÃ©tricas`, `AcciÃ³n`, `â€¢`, `ðŸ‘¥`…).
- La agenda mostraba siempre «0 voluntarios asignados» (`assignedCount` nunca se calculaba) y siempre «09:00» (leía `item.timeLabel`, campo inexistente).
- El gráfico decía «en los últimos meses» mostrando 7 días.
- El autocompletado de Chrome forzaba texto `#F5F5F5` sobre `#18181b` también en modo claro.

## Solución implementada

### Fase 1 — una sola fuente de verdad
- **`SettingsContext`** es ahora la única fuente:
  - nuevo campo `themeIntensity: 'suave' | 'normal' | 'vibrante'` (persistido en `profiles.preferences`);
  - caché local `democra.settings.v1` (tema, intensidad, densidad, tamaño de fuente, animaciones, sidebar) leída en el estado inicial → **sin parpadeo** al recargar antes de que responda la BD;
  - prop `defaultTheme` en `SettingsProvider` (el módulo ONG usa `"light"`, su diseño base);
  - `refreshSettings()` se re-ejecuta en `SIGNED_IN` (la preferencia del usuario se aplica tras iniciar sesión, no solo al montar);
  - `resolveTheme` exportado.
- **`ThemeProvider` (ONG)** ya no tiene estado propio: deriva `theme`/`intensity` de `useSettings()` (`system` → `prefers-color-scheme`), y `setTheme`/`setIntensity`/`toggleTheme` escriben vía `saveSettings`. Sigue aplicando los tokens `--t-*` y la clase `.dark`. Se eliminaron las claves `app-theme` / `app-intensity` de `localStorage`.
- **`Topbar`** usa `toggleTheme` del ThemeProvider (una sola ruta).
- **`theme.css`**: los tokens del Panel (`--color-bg-main`, `--color-bg-card`, `--color-text-*`, `--color-accent-*`…) apuntan a `var(--t-*)` en vez de hex oscuros.
- **`Dashboard.tsx`**: `zinc-*` / `#23211D` / `white/5` reemplazados por tokens (`--t-surface`, `--t-elevated`, `--t-border`, `--t-text`, `--t-text-secondary/-tertiary/-dim`); tooltip del gráfico con tokens. `text-white` se mantiene solo sobre fondos de color.

### Fase 2 — contenido
- Mojibake reparado en `Dashboard.tsx` (67 líneas, recodificación cp1252→utf-8 por línea, 0 fallos).
- `homeDashboardService.fetchTodayTimeline`: nueva `getAssignedCountMap()` cuenta `ong.asignaciones_actividad` (no borradas, mismo tenant) por actividad visible, en paralelo con el mapa de proyectos. Si falla, devuelve mapa vacío (no rompe la agenda).
- Agenda: nueva `formatAgendaTime()` muestra la hora local real (`HH:mm`, es-PE) a partir de `item.time`; «Hoy» si no hay fecha.
- Gráfico: subtítulo corregido a «en los últimos 7 días» (los datos ya eran los 7 días de `fetchWeeklyImpact`).
- `ong/src/styles/index.css`: autocompletado con `var(--t-text)` / `var(--t-surface)` (fallback claro) → correcto en ambos modos.

## Verificación
- Local (`localhost:5173`, org demo «Red Solidaria Andina (demo)»):
  - toggle claro↔oscuro cambia `--t-bg` (`#F8F7F5` ↔ `#100E0C`), clase `.dark`, `data-theme` y el `aria-label` del botón;
  - recarga conserva la elección (caché + BD; `profiles.preferences.theme` verificado);
  - Panel principal y Ajustes legibles en ambos modos (capturas en `.claude/landing-design/evidence/ong-*-after-fix.png`, no versionadas);
  - agenda: «07:53 · Plantación de queñuales · 3 voluntarios asignados»;
  - sin mojibake en el texto renderizado; 0 errores de consola tras recarga limpia.
- `npm run test:web`, `npm test` y build de producción: ver SUMMARY.md.

## Riesgos identificados
- **Efecto lateral en `/login`**: la preferencia (caché/BD) ahora también llega a la `.dark` global usada por `MfaChallenge` (5 variantes `dark:`). La landing (`.lp-*`) no se ve afectada.
- Usuarios con `app-theme` en `localStorage` pierden ese valor; se usa el de BD / caché (o el claro por defecto en ONG). Comportamiento deseado.
- `src/modules/ong` (copia duplicada no servida) **no** se tocó; sigue divergiendo (hallazgo C-1 de la auditoría, Fase 3).
- `getAssignedCountMap` añade una consulta por carga del panel (acotada a ≤ 6 actividades).

## Impacto esperado
Tema consistente y persistente en todo `/ong`, Panel principal legible, datos de agenda correctos y textos sin corrupción.

## Módulos afectados
`src/core/context` (compartido root/ONG/EDUC), `src/core/shell/Topbar`, `ong/src/app/lib/theme-context`, `ong/src/app/pages/Dashboard`, `ong/src/app/modules/home`, `ong/src/styles`.

## Dependencias involucradas
Ninguna nueva. Usa `@supabase/supabase-js` (ya presente) para `onAuthStateChange` y la consulta de asignaciones.

## Posibles efectos secundarios
- EDUC y la app raíz también montan `SettingsProvider`: ahora leen/escriben la caché `democra.settings.v1` y respetan `themeIntensity` (sin uso visible allí). Su `defaultTheme` sigue siendo `'dark'`.
- Componentes ONG que aún usan `zinc-*` fijos fuera del Panel principal pueden verse desentonados en claro (Fase 3 de la auditoría).

## Cómo revertir
`git revert <hash del commit>`. No hay migraciones de BD; `themeIntensity` en `profiles.preferences` es un campo JSON adicional e inocuo.
