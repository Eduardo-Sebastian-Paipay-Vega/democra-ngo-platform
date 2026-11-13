# Archivos cambiados

## Creados

- `.agents/skills/supabase/` y `.claude/skills/supabase/` — copias de proyecto de la skill oficial. Cada una contiene `CHANGELOG.md`, `SKILL.md`, `assets/feedback-issue-template.md` y `references/skill-feedback.md`.
- `.agents/skills/supabase-postgres-best-practices/` y `.claude/skills/supabase-postgres-best-practices/` — copias de proyecto. Cada una contiene `CHANGELOG.md`, `SKILL.md` y estas referencias: `_contributing.md`, `_sections.md`, `_template.md`, `advanced-full-text-search.md`, `advanced-jsonb-indexing.md`, `conn-idle-timeout.md`, `conn-limits.md`, `conn-pooling.md`, `conn-prepared-statements.md`, `data-batch-inserts.md`, `data-n-plus-one.md`, `data-pagination.md`, `data-upsert.md`, `lock-advisory.md`, `lock-deadlock-prevention.md`, `lock-short-transactions.md`, `lock-skip-locked.md`, `monitor-explain-analyze.md`, `monitor-pg-stat-statements.md`, `monitor-vacuum-analyze.md`, `query-composite-indexes.md`, `query-covering-indexes.md`, `query-index-types.md`, `query-missing-indexes.md`, `query-partial-indexes.md`, `schema-constraints.md`, `schema-data-types.md`, `schema-foreign-key-indexes.md`, `schema-lowercase-identifiers.md`, `schema-partitioning.md`, `schema-primary-keys.md`, `security-privileges.md`, `security-rls-basics.md` y `security-rls-performance.md` (todos bajo `references/`).
- `skills-lock.json` — origen GitHub, rutas, hashes e instalación por copia de las skills.
- `docs/agent-skills-supabase.md` — guía de uso, actualizaciones, validación, stack detectado, decisión MCP y limitaciones.
- `changes/2026-11-13_10-00_instalacion-agent-skills-supabase/CHANGELOG.md` — contexto, solución, riesgos, impacto y reversión.
- `changes/2026-11-13_10-00_instalacion-agent-skills-supabase/SUMMARY.md` — resumen ejecutivo del cambio.
- `changes/2026-11-13_10-00_instalacion-agent-skills-supabase/FILES_CHANGED.md` — inventario de archivos.

## Modificados

- `AGENTS.md` — añadió reglas de activación de skills por tipo de tarea y aclaró que las skills no autorizan acceso MCP ni operaciones remotas.

## Eliminados

- Ninguno.

## Carpetas afectadas

- `.agents/skills/`
- `.claude/skills/`
- `docs/`
- `changes/2026-11-13_10-00_instalacion-agent-skills-supabase/`

No se tocaron código de aplicación, `.env`, `package.json`, migraciones ni estado de Supabase.
