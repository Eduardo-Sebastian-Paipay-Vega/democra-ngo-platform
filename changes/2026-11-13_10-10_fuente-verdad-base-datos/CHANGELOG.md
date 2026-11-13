# Changelog — Rama de referencia de base de datos

## Fecha y autoría

- Fecha: 2026-11-13 10:10 (America/Lima).
- Autor de la ejecución: Codex.
- Rama: `database/source-of-truth`, derivada de `origin/dev`.
- Estado: documentación y rama creadas; PR a `dev` pendiente de revisión.

## Objetivo

Establecer un lugar estable y un procedimiento de cambios para que la estructura de la base de datos no dependa de recuerdos, archivos dispersos ni documentación desactualizada.

## Contexto del problema

El repositorio ya incluye `BD.json`, pero su marca de auditoría (27/08/2026 11:12:52) no coincidía con la fecha descrita en `AGENTS.md` (21/08/2026). Hay dos directorios de migraciones y no existe `supabase/config.toml`. El informe de auditoría disponible advierte que falta un baseline reproducible y que existen inconsistencias documentales.

## Solución

- Se creó la rama duradera `database/source-of-truth` desde `origin/dev`.
- Se creó `docs/general/base-datos/FUENTE_DE_VERDAD.md` con jerarquía de fuentes, estado observado, procedimiento de actualización y límites de seguridad.
- Se corrigió en `AGENTS.md` la fecha atribuida a `BD.json` y se indicó expresamente que es un inventario versionado, no lectura en vivo.
- No se copió ni regeneró el snapshot, no se conectó a Supabase y no se ejecutó SQL o migración.
- Se planifica proteger la rama con reglas de GitHub para exigir PR y bloquear borrado/force-push; la configuración se verifica separadamente tras publicar el branch.

## Riesgos identificados

- `BD.json` puede no reflejar la estructura viva actual; no hubo conexión de solo lectura disponible en esta tarea.
- Los dos trails de migración y baseline ausente impiden certificar una reconstrucción limpia.
- La rama puede desviarse si no se actualiza mediante PR cuando un cambio de esquema se integre a `dev`; por eso el documento define el flujo de sincronización.

## Impacto esperado

Los agentes y desarrolladores tendrán una ruta explícita para conocer qué fuente consultar, cómo registrar cambios y cuándo parar ante drift. Los snapshots previos quedarán recuperables desde el historial de Git.

## Módulos afectados

- Documentación transversal de base de datos.
- Instrucciones de desarrollo en `AGENTS.md`.
- No se afectaron ONG, landing, backend, frontend ni esquemas de Supabase.

## Dependencias y posibles efectos secundarios

- Sin dependencias nuevas.
- La rama es una referencia documental; el esquema no se despliega desde ella y requiere PR para cada actualización.
- El documento y la protección propuesta no corrigen el baseline faltante ni consolidan las carpetas de migraciones.

## Reversión

Revertir el commit de documentación en `database/source-of-truth` y eliminar la regla de protección asociada si ya fue creada. No requiere reversión de base de datos.
