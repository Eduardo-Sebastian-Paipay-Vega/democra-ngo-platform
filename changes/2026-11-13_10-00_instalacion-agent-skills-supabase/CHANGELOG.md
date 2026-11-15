# Changelog — Skills Supabase y PostgreSQL

## Fecha y autoría

- Fecha: 2026-11-13 10:00 (America/Lima).
- Autor de la ejecución: Codex.
- Estado: Completado con validaciones funcionales limitadas; sin conexión MCP.

## Objetivo

Instalar las skills oficiales `supabase` y `supabase-postgres-best-practices` en el repositorio Democra para que Codex y Claude Code dispongan de instrucciones mantenidas por Supabase al trabajar con sus productos y PostgreSQL.

## Contexto y motivo

El monorepo utiliza Supabase como plataforma de datos y PostgreSQL, con migraciones SQL en el repositorio. El equipo necesitaba instrucciones específicas para Auth, RLS, SQL, índices y rendimiento. El sistema no utiliza Angular ni Django: su stack principal es React/Vite y Express.

## Solución implementada

- Se instalaron las dos skills desde `supabase/agent-skills` como copias de proyecto en `.agents/skills/` (Codex) y `.claude/skills/` (Claude Code).
- Se añadió en `AGENTS.md` la regla para cargar la skill apropiada según la tarea.
- Se documentaron origen, versiones, hashes, actualización, agentes, límites de permisos y validaciones en `docs/agent-skills-supabase.md`.
- Se conservó aislada la integración MCP: no se instaló plugin, no se configuró servidor, no se inició OAuth y no se consultó ni modificó el proyecto remoto.

## Riesgos identificados

- El contenido de skills se ejecuta bajo los permisos normales de los agentes; se registró el origen y se revisaron los manifiestos antes de instalar.
- El plugin documentado incluye MCP con capacidades de interacción remota. Habilitarlo sin definir límites y autenticación podría conceder acceso más amplio de lo necesario; se difirió.
- La lectura de una migración detectó una función `SECURITY DEFINER` en `public` que merece revisión de autorización y permisos `EXECUTE`. No se modificó la migración ni la base de datos.
- `npm ls --depth=0` no concluyó dentro del límite de espera. No se afirma que las dependencias estén verificadas.

## Impacto esperado

Codex y Claude Code podrán cargar instrucciones relevantes para cambios de Supabase/PostgreSQL dentro del repositorio. No cambia el comportamiento de la aplicación ni conecta servicios externos.

## Módulos y dependencias afectados

- Agentes: configuración de proyecto para Codex y Claude Code.
- Documentación técnica: guía de integración y esta auditoría.
- No se modificó `package.json`, el lockfile npm, código de aplicación, configuración de base, credenciales o migraciones.

## Posibles efectos secundarios

- Los agentes pueden empezar a cargar estas instrucciones automáticamente cuando las descripciones coincidan con una tarea de Supabase/PostgreSQL.
- Puede requerirse reiniciar/reabrir el agente para refrescar el descubrimiento de skills.

## Reversión

Eliminar las carpetas `.agents/skills/supabase/`, `.agents/skills/supabase-postgres-best-practices/`, `.claude/skills/supabase/` y `.claude/skills/supabase-postgres-best-practices/`; quitar el bloque agregado de skills de `AGENTS.md`; eliminar `skills-lock.json`, `docs/agent-skills-supabase.md` y esta carpeta de auditoría. No hay cambios de base de datos ni de dependencias que revertir.
