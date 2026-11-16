# CHANGELOG — Fase 3 (lote 1): colores fijos → tokens de tema

- **Fecha y hora:** 2026-11-16 09:40 (America/Lima)
- **Autor:** Claude (Claude Code), a pedido del usuario («Sigue con la fase 3»)
- **Origen:** `docs/audits/AUDIT-ong-ui-2026-11-16.md`, hallazgo **C-1** (~1 900 colores fijos que ignoran el tema)
- **Estado:** Parcial. El lote 1 está completado. Quedan los demás archivos de C-1 para lotes siguientes.

## Objetivo
Que las páginas de `/ong` sin ningún token de tema se vean correctamente en modo claro y oscuro. La auditoría propone empezar por **Horas, Evidencias, Catálogos y Roles**. También se busca dejar una herramienta reproducible para los siguientes lotes.

## Contexto del problema
- Estas páginas usaban la paleta oscura fija:
  - `bg-zinc-900`, `text-zinc-300`, `border-zinc-800`…
  - hex `#100F0D`, `#171512`, `#F9F7F3`, `#A4A29F`…
- En modo claro quedaban como bloques oscuros o con texto claro sobre fondo claro.
- Al verificar en vivo apareció un problema más profundo:
  - `src/core/styles/core-ui.css` define `input, select, textarea { width:100%; background:var(--s3); padding:7px 11px; … }` y `label { display:block; … }` **sin capa CSS**.
  - En Tailwind v4 las utilidades viven en `@layer utilities`, y el CSS sin capa **gana siempre** a cualquier capa.
  - Por eso, en todo `/ong` (y en EDUC), cada input, select y label ignoraba sus clases de fondo, ancho, borde, padding y display. Resultado: filtros estirados al 100 %, fondo gris en modo claro y padding que pisaba `pl-9` en buscadores con icono.
- `Hours.tsx` (3 líneas) y `Attendance.tsx` (1) tenían `// @ts-ignore` **dentro de JSX como texto**, que se mostraba literalmente en pantalla («// @ts-ignore» encima de los filtros de Horas).

## Solución implementada
1. **Codemod reproducible** `scripts/codemods/colors-to-theme-tokens.mjs`:
   - Convierte las utilidades neutras (`zinc/gray/neutral/stone/slate`) y los hex de la paleta oscura antigua a tokens `--t-*`, según la propiedad:
     - fondo: `bg-*` → surface / elevated / hover / input-bg;
     - texto: text → text / secondary / tertiary / dim;
     - borde: border → border / border-strong.
   - Conserva los prefijos de estado (`hover:`, `focus:`…).
   - Usa `--t-input-bg` en `<input>`, `<select>` y `<textarea>`.
   - Convierte `text-white` solo cuando no hay fondo de color.
   - No toca colores de marca ni de estado.
   - Es idempotente y tiene modo `--dry`.
2. **Aplicado** a `Hours.tsx` (173), `Evidence.tsx` (181), `Catalogs.tsx` (45) y `Roles.tsx` (32): 431 reemplazos.
3. **Ajustes manuales**:
   - Botón «Reintentar» (rojo translúcido con `text-white`, invisible en claro) → `text-[var(--t-danger)]` en Horas y Evidencias.
   - Hover multilínea en Catálogos.
   - Ítem seleccionado de Catálogos: el codemod descarta la opacidad y ambos estados quedaron iguales. Ahora es `--t-active` contra `bg-transparent`.
   - `bg-black/20` → `--t-hover` en Roles.
4. **`core-ui.css`**: las reglas de elementos de formulario (`input/select/textarea`, `:focus`, `::placeholder`, `select option`, `label`) pasan a **`@layer base`**:
   - siguen siendo los estilos por defecto (ganan al preflight de Tailwind, que se importa antes);
   - pero ahora las clases utilitarias de cada componente los pueden sobrescribir.
5. Filtros de Horas y Evidencias con `w-auto`, para que se distribuyan en su fila `flex-wrap` en lugar de apilarse a ancho completo.
6. Eliminados los 4 `// @ts-ignore` que se mostraban como texto en la UI.

## Verificación
- Capturas 1440×900 en claro y oscuro de las 4 páginas con la org demo (`.claude/landing-design/evidence/ong-{hours,evidence,catalogs,roles}-{light,dark}.png`, no versionadas):
  - todas legibles en ambos modos;
  - sin texto `// @ts-ignore`;
  - filtros en una sola fila;
  - 0 errores de consola.
- Vitest de las páginas tocadas: 5 archivos, 10 tests OK. Suite completa y build: ver SUMMARY.md.

## Riesgos identificados
- **`core-ui.css` es compartido (ONG, EDUC y las páginas core de Perfil y Ajustes).**
  - Donde un input o label tenía clases de Tailwind que antes se ignoraban, ahora se aplican.
  - Es el comportamiento que esos componentes pedían, pero puede cambiar ligeramente el aspecto de formularios en páginas no revisadas una por una.
  - Donde no hay clases, el aspecto no cambia.
- El codemod descarta la opacidad `/NN` de los neutros. Si algún ternario distinguía estados solo por opacidad, quedarían iguales. Se buscaron ternarios colapsados en los 4 archivos y solo apareció el de Catálogos, ya corregido.
- Los colores de estado claros (`text-emerald-300`, `text-indigo-300`…) siguen fijos. En modo claro tienen contraste bajo; queda para un lote posterior.

## Impacto esperado
Horas, Evidencias, Catálogos y Roles se ven bien en ambos modos. Todos los formularios de `/ong` respetan por fin las clases de sus componentes.

## Módulos afectados
`ong/src/app/pages` (Hours, Evidence, Catalogs, Roles, Attendance), `src/core/styles/core-ui.css` (compartido), `scripts/codemods` (nuevo).

## Dependencias involucradas
Ninguna nueva (el codemod usa solo `node:fs`).

## Posibles efectos secundarios
Ver Riesgos: formularios de EDUC y de Perfil/Ajustes core ahora respetan sus utilidades de Tailwind.

## Pendiente (siguientes lotes de C-1)
- `ProjectsWorkspace.tsx`, `MedicalRecordPanels.tsx`, `Attendance.tsx`, `AccessControl.tsx`, `MedicalRecords.tsx` y el resto de la tabla C-1.
- Colores de estado con contraste bajo en modo claro.
- La página Catálogos muestra «Panel Principal» y «Agenda de Hoy»: es contenido copiado del dashboard. Es un problema de contenido, no de color.

## Cómo revertir
`git revert <hash>`. Sin cambios de BD.
