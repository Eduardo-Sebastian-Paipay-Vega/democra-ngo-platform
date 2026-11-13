# Resumen ejecutivo

Se integraron las skills oficiales de Supabase `supabase` y `supabase-postgres-best-practices` en las ubicaciones de proyecto de Codex y Claude Code. `AGENTS.md` ahora indica en qué tareas cargar cada skill y la guía técnica explica las versiones, la actualización y la decisión de mantener MCP desactivado.

Esto aporta orientación actualizada para tareas que usan Supabase y PostgreSQL sin alterar el runtime, instalar dependencias de aplicación ni acceder a la base remota. La revisión de ejemplo encontró una función `SECURITY DEFINER` en una migración que requiere análisis aparte; no se cambió.

**Resultado:** instalación terminada. La validación fue documental y de archivos; `npm ls --depth=0` no concluyó y no se ejecutaron tests ni build.
