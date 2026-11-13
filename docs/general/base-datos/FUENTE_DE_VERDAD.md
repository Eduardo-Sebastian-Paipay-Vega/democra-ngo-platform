# Fuente de referencia de la base de datos

## Propósito

Este documento establece cómo consultar y actualizar la información de estructura de la base de datos Democra sin confundir un snapshot con la base viva ni perder el historial. No ejecuta cambios sobre Supabase.

## Rama de referencia

- Rama estable: `database/source-of-truth`.
- Su contenido se actualiza solo mediante Pull Request; no se usa para desarrollar funcionalidades.
- No se permite force-push ni borrar la rama. Git conserva snapshots anteriores en el historial de commits.
- El trabajo de aplicación sigue naciendo de `dev` en ramas cortas (`feature/ong`, `feature/landing-publica`, `feature/db-<cambio>`). Los cambios de esquema requieren revisión de base de datos, migración versionada y actualización de la referencia cuando la estructura resultante haya sido verificada.
- La rama `database/source-of-truth` conserva la referencia y su historial. `dev` sigue siendo la rama de integración del código. Ninguna de estas ramas por sí sola sustituye una comprobación de la base viva.

## Jerarquía de fuentes

1. **Base viva consultada en modo de solo lectura**, cuando hay conexión autorizada: evidencia actual para confirmar qué existe ahora.
2. **Migraciones versionadas aprobadas**: historial ejecutable de los cambios. Antes de reproducir un entorno, hay que confirmar orden, baseline, configuración y aplicación de cada trail.
3. **`BD.json`**: snapshot de catálogo del esquema, útil para consultar objetos capturados; no contiene el historial completo de cambios ni prueba que ese esquema siga vivo.
4. **Diccionarios, scripts maestros y auditorías Markdown**: material explicativo; pueden quedar obsoletos y nunca deben prevalecer sobre una migración posterior o una verificación actual.

## Estado observado en esta revisión

- `BD.json` está versionado en Git. Declara `audit_timestamp` **27/08/2026 11:12:52** y el commit que lo incorporó es `4e926e8` (`feat(academico): refactor module cursos, move to academico route and update UX`). El archivo lista, entre otros objetos, tablas/columnas, índices, funciones, constraints, políticas RLS, triggers y extensiones.
- La fecha de `AGENTS.md` que indicaba 21/08/2026 no coincidía con ese `audit_timestamp`; se corrigió la instrucción para advertir que el inventario no es en vivo.
- Hay dos trails: `supabase/migrations/` y `ONG/supabase/migrations/`. En el checkout revisado contienen 24 y 6 archivos SQL respectivamente; el segundo incluye `diagnose_hierarchy.sql`, que el informe identifica como diagnóstico y no como migración.
- No se encontró `supabase/config.toml`. El informe `docs/general/base-datos/AUDIT_REPORT_S1.md` del 03/07/2026 registra baseline ausente, trails sin orden global y documentación histórica contradictoria. Ese informe es anterior al snapshot actual y debe leerse como diagnóstico, no como estado vivo.
- No se consultó la base remota durante esta revisión. Por tanto, la vigencia de `BD.json` respecto del proyecto Supabase actual no queda certificada aquí.

**Conclusión:** hoy existe un snapshot estructural y hay historial parcial de migraciones, pero el repo no demuestra una reconstrucción limpia y reproducible del esquema completo. No tratar `BD.json` ni una de las carpetas por separado como baseline completo.

## Procedimiento para cambiar estructura

1. Crear una rama de trabajo desde `dev` con nombre `feature/db-<cambio>` y consultar `.agents/skills/supabase-postgres-best-practices/SKILL.md`.
2. Antes de escribir DDL, revisar ambas carpetas de migraciones, `BD.json`, dependencias de funciones/policies, y auditorías. Documentar el trail que corresponde y no duplicar entidades.
3. No ejecutar migraciones sobre la base viva desde la rama de referencia. Usar solo un entorno aislado y verificar la secuencia completa antes de considerar una reconstrucción segura.
4. Para cambios remotos, requerir revisión explícita, respaldo/plan de reversión y autorización de despliegue. Consultas de inspección deben usar credenciales de solo lectura cuando sea posible.
5. Después de aplicar una migración aprobada y verificar la estructura resultante, regenerar `BD.json` con una extracción reproducible de metadatos de esquema, sin filas de negocio ni secretos. Registrar fecha, proyecto/entorno (sin credenciales), herramienta/versión y commit de migraciones fuente.
6. Abrir PR con la migración y la actualización del snapshot hacia `dev`. Luego actualizar `database/source-of-truth` mediante PR desde el estado integrado. No editar manualmente `BD.json` para simular un cambio de base.
7. Actualizar el diccionario o documentación afectada y añadir la evidencia de verificación al PR. Si el snapshot contiene cambios inesperados, detenerse y resolver la diferencia antes de integrarlo.

## Invariantes de seguridad

- No guardar filas reales de usuarios, donaciones, beneficiarios u otras entidades en snapshots.
- No añadir `.env`, contraseñas, tokens, service-role/secret keys ni cadenas de conexión al branch o sus artefactos.
- No usar una clave `service_role` para consultas exploratorias si basta una cuenta read-only.
- Las skills y esta rama documentan el proceso; no autorizan acceso remoto, ejecución SQL, migraciones ni despliegues.
