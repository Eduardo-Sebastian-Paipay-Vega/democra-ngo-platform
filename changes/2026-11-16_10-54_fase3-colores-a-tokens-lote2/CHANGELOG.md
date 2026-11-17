# CHANGELOG — Fase 3 (lote 2): colores fijos a tokens de tema

- **Fecha y hora:** 2026-11-16 10:54 (America/Lima)
- **Autor:** Claude (Claude Code), a pedido del usuario («Siguiente lote»)
- **Origen:** `docs/audits/AUDIT-ong-ui-2026-11-16.md`, hallazgo **C-1**
- **Antecedente:** lote 1 en `changes/2026-11-16_09-40_fase3-colores-a-tokens-lote1/`
- **Estado:** Parcial. El lote 2 está completado; quedan archivos menores de C-1.

## Objetivo
Convertir los archivos con más colores fijos de la tabla C-1:
- Proyectos (`ProjectsWorkspace.tsx`, 466 fijos), que cubre Proyectos, Actividades, Tareas y Asignaciones.
- Paneles de ficha médica (242).
- Asistencia (235).
- Control de acceso (207).
- Ficha médica (123).

## Contexto del problema
- Los cinco archivos usaban la paleta oscura fija (`zinc-*` y hex `#171512`…).
- Además, **`MedicalRecords.tsx` redefinía los tokens `--t-*` en un `style` en línea** con valores oscuros fijos (`--t-surface: #171512`, `--t-text: #F9F7F3`…). Así, aunque las clases ya usaran tokens, toda la página quedaba en negro en modo claro, con el título «Panel Principal» y los nombres de las personas invisibles (texto claro sobre fondo claro).
- En Asistencia, los filtros se estiraban a ancho completo (el mismo síntoma que Horas en el lote 1).

## Solución implementada
1. **Codemod** (`scripts/codemods/colors-to-theme-tokens.mjs`) aplicado: **1 115 reemplazos**.
   | Archivo | Reemplazos |
   |---|---|
   | ProjectsWorkspace | 450 |
   | MedicalRecordPanels | 197 |
   | Attendance | 214 |
   | AccessControl | 166 |
   | MedicalRecords | 88 |
2. **Mejoras al codemod**, aprendidas en este lote:
   - `ring-offset-*` pasa a `--t-surface`.
   - `hover:text-white` y `group-hover:text-white` sobre superficies neutras pasan a `--t-text` (en modo claro eran blanco sobre blanco).
   - Plantillas `` `…` `` multilínea, como `className={`… ${cond ? 'a' : 'b'}`}`.
   - Prefijos con barra (`group-hover/task:`).
   - Verificado: idempotente (0 cambios sobre los 10 archivos ya convertidos) y probado con un caso sintético.
3. **Ajustes manuales**:
   - Proyectos: `text-zinc-100` y `bg-zinc-950/40` en plantillas multilínea, 5 `hover:text-white` en botones neutros y `focus:ring-offset-zinc-900`.
   - Paneles de ficha médica: el aviso «Trazabilidad activa» usaba amarillos claros (`#FCD34D`, `#FDE68A`), ilegibles sobre fondo claro. Ahora usa `--t-warning` y `--t-text-secondary`. También `#374151` pasa a `--t-border-strong`.
   - Ficha médica: **se eliminó el `style` en línea que fijaba los tokens oscuros**. La página ahora hereda el tema activo.
   - Asistencia: filtros con `w-auto`.
4. **No se tocaron, intencionalmente:**
   - `bg-black` del visor de cámara en Asistencia (vídeo).
   - `bg-white` del contenedor del código QR en Control de acceso (el QR necesita fondo blanco).
   - Los colores de marca y de estado.

## Verificación
- Capturas 1440×900 en claro y oscuro (`.claude/landing-design/evidence/ong-b2-*.png`, no versionadas) de Proyectos, Tareas, Asistencia, Control de acceso, Ficha médica y el modal «Motivo de acceso sensible»:
  - legibles en ambos modos;
  - 0 errores de consola.
- El modal de ficha médica se abrió y se cerró sin abrir ninguna ficha (no generó acceso sensible).
- Tests y build: ver SUMMARY.md.

## Riesgos identificados
- `ProjectsWorkspace.tsx` concentra 4 vistas (Proyectos, Actividades, Tareas, Asignaciones) y vistas kanban. Se revisaron visualmente Proyectos, Actividades, Tareas y Asignaciones (vista tabla). Las vistas Kanban y Agenda solo pasaron por el codemod y los tests.
- Existe un scope oscuro intencional en `ong/src/styles/index.css` (`[data-app-theme="oscuro"] .fichas-medicas-theme`, paleta azul marino). Solo actúa en modo oscuro y no se modificó.
- La conversión a LF de `MedicalRecords.tsx` (antes CRLF) es neutra: git normaliza a LF y el diff contiene solo los cambios reales.

## Pendiente detectado (fuera de color)
- **Asistencia**: la insignia «🟢 85% A tiempo» es un **número fijo** que se muestra aunque no haya asistencias. Hay que calcularlo o quitarlo.
- **Ficha médica** y **Control de acceso** muestran el título «Panel Principal» (contenido copiado del dashboard), igual que Catálogos.
- Colores de estado claros (`text-emerald-400`, `text-indigo-300`…) con contraste bajo en modo claro.

## Impacto esperado
Las pantallas más usadas de Proyectos, Operación, Clínico y Configuración respetan el tema en ambos modos.

## Módulos afectados
`ong/src/app/modules/projects`, `ong/src/app/modules/people/components`, `ong/src/app/pages` (Attendance, AccessControl, MedicalRecords), `scripts/codemods`.

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Las vistas de `ProjectsWorkspace` no revisadas visualmente podrían tener algún contraste mejorable en modo claro. Se corrige con el mismo patrón.

## Cómo revertir
`git revert <hash>`. Sin cambios de BD.
