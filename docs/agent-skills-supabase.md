# Agent Skills oficiales de Supabase y PostgreSQL

## Alcance y fecha

- Fecha de instalación y revisión: 2026-11-13.
- Repositorio: Democra monorepo (`D:\espelo`).
- Stack detectado: React 18 + Vite 6 en frontend, Express 5 en backend, Supabase JS 2 y PostgreSQL administrado por Supabase; TypeScript 6, Jest, Vitest y Playwright.
- Entorno detectado: Windows x64, Node.js 26.2.0, npm 11.13.0.
- El proyecto no es Angular/Django ni PostgreSQL local. Hay migraciones SQL en `supabase/migrations/` y `ONG/supabase/migrations/`; no se ejecutaron.
- El CLI de Supabase está instalado en el equipo; no se encontró `supabase/config.toml` ni una configuración de proyecto `.mcp.json`/`mcp.json` en el repositorio. No se revisaron conexiones MCP globales de la cuenta.
- La rama activa al iniciar fue `dev` y el árbol de trabajo estaba limpio.

## Skills instaladas

Las dos skills se obtuvieron del repositorio mantenido por Supabase [`supabase/agent-skills`](https://github.com/supabase/agent-skills), con el instalador `skills` 1.8.1. La versión del CLI de instalación no se agregó a `package.json` ni al lockfile de dependencias del proyecto.

| Skill | Versión declarada | Propósito | Ubicaciones de proyecto |
|---|---:|---|---|
| `supabase` | 0.1.2 | Supabase, SDK, Auth, RLS, Storage, Edge Functions, CLI/MCP y diagnóstico | `.agents/skills/supabase/`, `.claude/skills/supabase/` |
| `supabase-postgres-best-practices` | 1.1.1 | SQL, esquema, índices, migraciones, rendimiento, conexiones, seguridad y RLS | `.agents/skills/supabase-postgres-best-practices/`, `.claude/skills/supabase-postgres-best-practices/` |

El archivo `skills-lock.json` registra los orígenes GitHub, rutas y hashes calculados de las dos skills. No contiene credenciales. La instalación se hizo como copias de proyecto para evitar enlaces simbólicos y no crear instalaciones globales.

## Agentes y descubrimiento

- **Codex:** disponible en este entorno; skills en `.agents/skills/`.
- **Claude Code:** CLI `claude` detectado; skills en `.claude/skills/`.
- No se instalaron agentes ni plugins adicionales.
- La guía de `AGENTS.md` indica qué skill cargar según la tarea. Claude Code detecta las skills de `.claude/skills/` por sus manifiestos `SKILL.md`.

## Cuándo aplicarlas

- Cargar `supabase` para cualquier cambio o diagnóstico real de Supabase, sus productos, SDK, CLI o MCP.
- Cargar `supabase-postgres-best-practices` antes de escribir/modificar SQL, esquemas, migraciones, índices, funciones, triggers, políticas RLS o consultas PostgreSQL; también para rendimiento, concurrencia y aislamiento de datos.
- No cargar la skill general de Supabase para tareas ordinarias de React/Express que no usan sus servicios.
- Estas instrucciones no sustituyen las reglas del monorepo: Core y Ramas, validación de AppSec, integridad CRUD, permisos, RLS y uso exclusivo del `.env` raíz.

## Plugin y MCP

La documentación de Supabase describe el plugin de agentes como un paquete que combina skills y el servidor MCP. El MCP ofrece acciones de plataforma y base de datos, por lo que habilitarlo amplía el acceso del agente y requiere autenticación OAuth. La documentación recomienda limitarlo al proyecto y a funciones read-only cuando sea suficiente.

En esta instalación no se añadió configuración `.mcp.json`, no se autenticó ningún MCP y no se instaló el plugin. El repositorio ya contiene las skills de forma independiente; por ahora el plugin no aporta una ventaja necesaria para la tarea solicitada y su MCP añadiría permisos externos. La decisión puede revisarse después si se requiere acceso de agente a operaciones remotas, usando alcance de proyecto, lectura solamente y las funciones mínimas necesarias.

## Validación efectuada

1. Se consultaron el repositorio y las guías oficiales de [Agent Skills](https://supabase.com/docs/guides/ai-tools/ai-skills), [AI Tools](https://supabase.com/docs/guides/ai-tools), [plugin](https://supabase.com/docs/guides/ai-tools/plugins), [MCP](https://supabase.com/docs/guides/getting-started/mcp) y [PostgreSQL de Supabase](https://supabase.com/docs/guides/database/postgres).
2. Se inspeccionaron los dos `SKILL.md` upstream antes de instalar y se comprobaron los manifiestos locales. Ambos nombres y versiones concuerdan con el contenido instalado.
3. `npx skills@latest add supabase/agent-skills --agent codex --skill supabase --skill supabase-postgres-best-practices --copy --yes` finalizó con código 0; la segunda ejecución añadió Claude Code y reportó las cuatro rutas de proyecto.
4. `npx skills@latest list` finalizó con código 0 y reconoció las cuatro skills locales como disponibles para Codex y Claude Code.
5. `git diff --check` finalizó sin errores. Una búsqueda de formatos comunes de claves/tokens en los nuevos artefactos no encontró coincidencias.
6. Se leyó una migración existente (`supabase/migrations/20260510220000_ace_fase4_optimization.sql`) como prueba de aplicación estática de las guías. Se observó `public.fn_has_context_access` como `SECURITY DEFINER`; la guía pide validar autorización y restringir el permiso `EXECUTE` en funciones privilegiadas del schema expuesto. Esto es un hallazgo para revisión separada, no una verificación remota ni un cambio aplicado.
7. No se ejecutaron migraciones, consultas remotas, pruebas de aplicación ni build: la instalación solo afecta archivos de skills, guía de agentes y documentación. `npm ls --depth=0` quedó sin respuesta durante más de un minuto y se interrumpió; no se reporta como aprobado. Las pruebas de aplicación no se repitieron: en la revisión previa de esta sesión Jest intentó un envío externo de correo y Vitest hizo peticiones al Supabase remoto; no son pertinentes para archivos de instrucciones/documentación.
8. No se verificó la carga de skills desde una sesión nueva de Claude Code o Codex; se comprobó la detección del CLI y las rutas soportadas. Reiniciar/reabrir el agente permite refrescar su descubrimiento.

## Actualización y mantenimiento

Para listar las skills de este proyecto:

```powershell
npx skills list
```

Para revisar actualizaciones:

```powershell
npx skills check
```

Para actualizar las skills de Supabase:

```powershell
npx skills update supabase supabase-postgres-best-practices
```

Revisa el diff de `.agents/skills/`, `.claude/skills/` y `skills-lock.json` antes de conservar una actualización. No ejecutes una instalación global si solo se pretende actualizar este repositorio.

## Seguridad y limitaciones

- No se añadieron claves, contraseñas, tokens ni cadenas de conexión a los archivos nuevos.
- No se instalaron paquetes en las dependencias de la aplicación.
- No se activó MCP, plugin, OAuth ni una conexión remota.
- Las skills se ejecutan con los permisos normales del agente; revisa sus instrucciones antes de usarlas. No sustituyen revisión humana ni controles del proyecto.
- Las versiones indicadas son las declaradas en los `SKILL.md`; los hashes instalados están en `skills-lock.json`. El lock de esta instalación no contiene un SHA de commit upstream.
- La auditoría estática de una migración no certifica el estado de la base viva ni sus permisos efectivos.
