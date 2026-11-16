# Auditoría UI — módulo ONG (`/ong`)

**Fecha:** 2026-11-16 · **Autor:** Claude (Claude Code) · **Tipo:** solo lectura (no se modificó código)
**Método:** lectura de código + pruebas en vivo con la cuenta demo («Red Solidaria Andina (demo)») en `localhost:5173`, Chromium 1440×900 + consultas a Supabase (PT_solaris).

---

## Resumen

El problema de fondo no son detalles sueltos: **`/ong` tiene tres sistemas de tema que no se hablan entre sí**, y por eso el modo claro/oscuro "no funciona", hay texto negro sobre negro y las preferencias guardadas no tienen efecto. Arreglando esa raíz se resuelven de golpe A-1 a A-4.

| # | Hallazgo | Gravedad | Visible para el usuario |
|---|---|---|---|
| A-1 | Botón claro/oscuro no cambia nada | **Crítica** | Sí |
| A-2 | Panel principal en negro con título negro (ilegible) | **Crítica** | Sí |
| A-3 | Preferencias se guardan en BD pero no se aplican | **Alta** | Sí |
| A-4 | Página de configuración con tokens de un 3.er sistema | Alta | Sí |
| B-1 | Acentos rotos (mojibake) en el Panel principal | **Alta** | Sí |
| B-2 | Agenda muestra 0 voluntarios asignados (hay 3) | Alta | Sí |
| B-3 | Gráfico dice «últimos meses» y muestra días | Media | Sí |
| B-4 | Autocompletado de inputs forzado a oscuro | Media | Sí (claro) |
| C-1 | ~1 900 colores fijos que ignoran el tema | Alta (deuda) | Indirecto |
| C-2 | Densidad y tamaño de letra se guardan y no hacen nada | Media | Sí |
| C-3 | Intensidad del tema solo en localStorage | Baja | No |
| D-1 | Copia duplicada del módulo ONG (`src/modules/ong`) | Media (deuda) | No |
| D-2 | ~970 líneas con mojibake en código no servido | Baja | No |
| D-3 | Los tests no detectan nada de lo anterior | Media | No |

---

## A. Tema y preferencias (la raíz)

### Los tres sistemas

| Sistema | Archivo | Valores | Qué controla | Persistencia |
|---|---|---|---|---|
| **1. ThemeProvider** | `ong/src/app/lib/theme-context.tsx` | `claro` / `oscuro` + intensidad | Variables `--t-*` → **casi todos los colores reales de `/ong`** | `localStorage['app-theme']` |
| **2. SettingsContext** | `src/core/context/SettingsContext.tsx` (montado en `ong/src/main.tsx`) | `dark` / `light` / `system` | Clase `dark` y `data-theme` en `<html>`, densidad, tamaño de letra, idioma | `profiles.preferences` (BD) |
| **3. Tokens fijos** | `ong/src/styles/theme.css` (`--color-bg-main`…) y `src/core/styles/core-ui.css` (`--tx`, `--bg`…) | — / `data-theme="light"` | Panel principal, Roles / página de Configuración | — |

### A-1 · El botón claro/oscuro no hace nada — Crítica
- `src/core/shell/Topbar.tsx:276-279`: el botón llama a `saveSettings({ theme })` (**sistema 2**), pero los colores salen de `--t-*` (**sistema 1**), que nunca se entera. No hay ningún código que sincronice ambos (`AppShell.tsx` no usa `useSettings`).
- **Prueba en vivo:** dos clics → `data-theme` pasa `dark → light → dark` y la clase `dark` se alterna, pero `--t-bg` sigue en `#F8F7F5` y el fondo no cambia en ningún momento.
- Además el icono y el `aria-label` se calculan con el sistema 1 y la acción con el sistema 2 → el icono nunca cambia.

### A-2 · Panel principal negro con texto negro — Crítica
- `SettingsContext` arranca con `theme: 'dark'` por defecto (`SettingsContext.tsx:33`) y pone la clase `dark` aunque la app esté en claro. **Prueba:** `appTheme="claro"` + `<html class="dark">` simultáneamente.
- `ong/src/app/pages/Dashboard.tsx:777` pinta su fondo con `--color-bg-main` = `#100F0D` **fijo** (`theme.css:124`, no cambia con el tema) → fondo negro siempre.
- El `<h1>` «Panel Principal» usa `--t-text` del tema claro = `#1A1915` → **texto casi negro sobre negro** (contraste ≈ 1.1:1, mínimo WCAG 4.5:1).
- Resultado: shell claro + tablero negro + títulos invisibles (la captura del usuario).

### A-3 · Las preferencias se guardan pero no se aplican — Alta
- `saveSettings` **sí escribe** en `profiles.preferences` (verificado en BD: `{"theme":"dark", "density":"normal", …}`).
- Pero al recargar, el sistema 1 (el que pinta) lee `localStorage['app-theme']`, que **nadie escribe** desde el botón ni desde Configuración (verificado: `null`). → la app vuelve siempre a claro, digan lo que digan las preferencias.
- Lo que el usuario percibe: "las preferencias no se guardan". Técnicamente se guardan en el sistema equivocado.

### A-4 · Configuración usa un tercer juego de tokens — Alta
- `src/core/features/settings/SettingsPage.tsx` (ruta `/ong/app/account/settings`) usa `--tx`, `--tx-2`, `--red`, `.btn`… de `core-ui.css`, cuyo tema depende de `data-theme` (sistema 2), no de `--t-*`. Esta página se ve con un estilo distinto al resto de `/ong` y su vista previa de tema tampoco cambia los colores reales.

### C-2 · Densidad y tamaño de letra no tienen efecto — Media
- `SettingsContext` escribe `--page-p`, `--card-p`, `--row-py`, `--nav-py`, `--gap-md`, `--topbar-h`… **0 usos** en `ong/src` ni en `src/core/shell`. El selector de densidad se guarda y no cambia nada. El tamaño de letra sí se aplica a `body`, pero casi todos los textos usan tamaños fijos en px (`text-[12px]`, `fontSize: 13`), así que el efecto es mínimo.

### C-3 · Intensidad solo en el navegador — Baja
- `app-intensity` vive solo en `localStorage`; no viaja con el usuario a otro dispositivo.

---

## B. Errores de contenido y datos

### B-1 · Acentos rotos (mojibake) — Alta
- `ong/src/app/pages/Dashboard.tsx`: **65 líneas** con texto UTF-8 guardado como Latin-1: «mÃ©tricas», «AcciÃ³n RÃ¡pida», «RevisiÃ³n», «EvoluciÃ³n», «Ãºltimos», «â€¢» (viñeta), «ðŸ'¥» (emoji). Es el **único** archivo servido en `/ong` con este problema.
- Causa probable: el archivo se guardó/editó con una herramienta en codificación Windows-1252. Corrección mecánica (re-decodificar), verificable con grep = 0.

### B-2 · Agenda: «0 voluntarios asignados» — Alta (a confirmar en código)
- «Plantación de queñuales» tiene 3 voluntarios en `ong.asignaciones_actividad` (seed demo), pero la tarjeta muestra 0. La consulta de la agenda probablemente lee otra tabla/campo o filtra `is_deleted` mal. Requiere revisar `ong/src/app/modules/home/*`.

### B-3 · Gráfico «Evolución del Voluntariado» — Media
- Subtítulo: «Comparativa … en los últimos meses»; eje X: Mar, Mié, Jue… (días). Además los picos de la curva (≈18 h un miércoles) no corresponden a las horas sembradas (20 h totales repartidas en 3 fechas) → posible curva suavizada/interpolada que inventa valores (`type="monotone"`). Revisar etiqueta y si el dato es por día o por mes.

### B-4 · Autocompletado de formularios forzado a oscuro — Media
- `ong/src/styles/index.css:28-38`: los inputs autocompletados por el navegador se pintan con fondo `#18181b` y texto `#F5F5F5` `!important`, también en modo claro → bloques negros en formularios claros (p. ej. login/búsqueda con autocompletar).

---

## C-1. Colores fijos que ignoran el tema — Alta (deuda)

Conteo de clases/valores de color fijos (`bg-zinc-900`, `text-white`, `#xxxxxx`, `bg-[#…]`) vs. usos de tokens `var(--t-…)`:

| Archivo | Fijos | Tokens |
|---|---|---|
| `modules/projects/ProjectsWorkspace.tsx` | 466 | 82 |
| `modules/people/components/MedicalRecordPanels.tsx` | 242 | 0 |
| `pages/Attendance.tsx` | 235 | 42 |
| `pages/AccessControl.tsx` | 207 | 8 |
| `pages/Evidence.tsx` | 186 | 0 |
| `pages/Hours.tsx` | 176 | 0 |
| `pages/Dashboard.tsx` | 128 | 65 |
| `pages/MedicalRecords.tsx` | 123 | 6 |
| `pages/AdmissionOnboarding.tsx` | 100 | 34 |
| `pages/SensitiveAccess.tsx` | 96 | 28 |
| `pages/Areas.tsx`, `CreateTenantPage.tsx`, `Catalogs.tsx`, `Roles.tsx`, `LandingPage.tsx`, … | 22–67 c/u | 0–25 |

Las páginas con **0 tokens** (Horas, Evidencias, Historia clínica, Catálogos, Roles) están "pintadas a mano" para un solo tema: cuando el tema funcione (A-1), se verán rotas en el otro modo. Por eso C-1 debe ir **después** de unificar el tema.

---

## D. Deuda estructural

### D-1 · Módulo ONG duplicado — Media
- `ong/src` (353 archivos) es lo que sirve `/ong` (`ong/index.html` → `/ong/src/main.tsx`).
- `src/modules/ong` (245 archivos) es una copia divergente (339 diferencias), usada solo por `src/industries/ong/*` y `src/core/shell/*`. Ninguna ruta del app raíz (`src/App.tsx`: `/`, `/login`, `/nosotros`) la monta. Riesgo: arreglar algo en la copia equivocada. Requiere confirmar que nada la carga antes de eliminarla.

### D-2 · Mojibake en código no servido — Baja
- ~970 líneas en `educ/src/**` (≈50 archivos), `src/modules/ong/**`, `src/industries/**` y componentes antiguos del landing (`src/pages/landing/components/*`, ya no usados por el landing actual). Corregir junto con B-1 por consistencia, o eliminar lo muerto.

### D-3 · Los tests no cubren nada de esto — Media
- 535 tests verdes y ninguno detecta: tema que no cambia, preferencias no aplicadas, contraste ilegible ni mojibake. Faltan: un test de integración del toggle de tema, un test que lea preferencias → tema aplicado, y un chequeo de lint/CI que rechace `Ã©|â€|ðŸ` en el código.

---

## Plan de corrección propuesto (por fases, cada una con su commit y registro en `changes/`)

1. **Fase 1 — Tema único (resuelve A-1, A-2, A-3, A-4, C-3).**
   `SettingsContext` pasa a ser la única fuente de verdad (BD + caché local); `ThemeProvider` deriva `claro/oscuro` de ella en vez de leer su propio localStorage; se elimina el `theme: 'dark'` por defecto (usar `system` o `light`); `--color-bg-main` & cía. pasan a depender del tema; el botón y su icono usan la misma fuente. Intensidad se guarda también en `preferences`.
2. **Fase 2 — Contenido (B-1, B-2, B-3, B-4).** Re-codificar `Dashboard.tsx`, corregir la consulta de la agenda, etiqueta/datos del gráfico, autocompletado según tema.
3. **Fase 3 — Colores fijos → tokens (C-1),** página por página empezando por las de 0 tokens (Horas, Evidencias, Catálogos, Roles), verificando ambos modos con capturas.
4. **Fase 4 — Densidad/tamaño (C-2):** o se conectan a los componentes, o se quitan de Configuración (no ofrecer opciones que no hacen nada).
5. **Fase 5 — Limpieza (D-1, D-2, D-3):** confirmar y eliminar la copia `src/modules/ong`, mojibake restante, tests de tema/preferencias y regla de CI anti-mojibake.

**Nota:** el usuario indicó que la arquitectura completa cambiará. Fase 1 y 2 valen la pena igual (son las que ve el usuario hoy y son acotadas); Fases 3–5 conviene evaluarlas contra el plan de nueva arquitectura antes de invertir en ellas.
