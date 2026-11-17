# SUMMARY — Fase 3 (lote 2): colores fijos a tokens de tema

## Qué se hizo
- Se convirtieron a tokens `--t-*` los colores fijos (paleta oscura) de 5 archivos: 1 115 reemplazos con el codemod, más ajustes manuales.
- Archivos: `ProjectsWorkspace.tsx` (Proyectos, Actividades, Tareas, Asignaciones), `MedicalRecordPanels.tsx`, `Attendance.tsx`, `AccessControl.tsx` y `MedicalRecords.tsx`.
- En **Ficha médica** se eliminó un `style` en línea que redefinía los tokens con valores oscuros fijos. Esa era la causa de que la página quedara en negro en modo claro.
- El codemod ahora también cubre `ring-offset-*`, `hover:text-white` sobre superficies neutras, plantillas multilínea y prefijos con barra.

## Por qué se hizo
Hallazgo C-1 de `docs/audits/AUDIT-ong-ui-2026-11-16.md`. En modo claro estas pantallas mostraban:
- fondos negros;
- texto invisible (blanco sobre blanco);
- avisos ilegibles.

## Qué beneficio aporta
Las pantallas de Proyectos, Asistencia, Control de acceso y Ficha médica respetan el tema elegido por el usuario, tanto claro como oscuro.

## Funcionalidades afectadas
Solo la presentación visual. No cambian la lógica, los datos ni la BD.

## Verificación
- **Tests web (Vitest):** 101 de 101 archivos, 535 de 535 tests en verde.
  - La máquina tenía poca RAM libre. Por eso la ejecución se dividió en tandas (`--pool=threads --maxWorkers=1-2`).
  - Los únicos fallos fueron de arranque de workers. Ningún test falló.
- **Build de producción:** `NODE_ENV=production vite build` correcto.
- **Revisión visual:** capturas en modo claro y oscuro de las pantallas afectadas, con 0 errores de consola.

## Estado
Lote 2 completado. Quedan archivos menores de C-1 y los pendientes de contenido listados en CHANGELOG.md.
