# CHANGELOG — Organización demo ficticia para capturas del módulo ONG

**Fecha y hora:** 2026-11-16 07:53 (America/Lima)
**Autor:** Claude (Claude Code), a pedido y con aprobación explícita del usuario
**Estado:** Completado (datos cargados en producción, PT_solaris)

## Objetivo
Contar con una organización ONG de datos ficticios y creíbles para capturar pantallas reales de `/ong` y usarlas en el landing, sin exponer datos de organizaciones reales.

## Contexto del problema
La demo del landing muestra piezas inventadas que no existen en el sistema, como la tarjeta «Huerto comunitario». El usuario quiere mostrar la interfaz real. Las cuentas existentes son de organizaciones reales, o tienen sus paneles en cero.

## Solución implementada
1. **Usuario demo en `auth.users`, creado por SQL desde el conector oficial de Supabase:**
   - Correo confirmado.
   - **Sin contraseña.** La fija el usuario con «Send password recovery».
   - Con su fila en `auth.identities` (proveedor email).
   - El correo es un alias `+demo` de la cuenta del usuario, elegido por él. No queda escrito en el repo.
2. **Seed `supabase/seeds/demo-org.sql`:**
   - Tenant fijo `de300000-…-0001` «Red Solidaria Andina (demo)», RUC ficticio `20999999901`, industria `ong`.
   - Sede, rol Owner con los 104 permisos del catálogo, perfil vinculado y `user_roles_sedes`. El trigger crea la membership.
   - 3 áreas, 2 ubicaciones, 4 proyectos (uno por etapa), 10 voluntarios, 10 asignaciones a proyecto y 6 actividades con 16 asignaciones.
   - 10 registros de horas: 6 aprobadas, 1 rechazada y 3 pendientes, cada una pendiente con su fila en `ong.aprobaciones`.
   - 6 beneficiarios vinculados a un proyecto.
   - El correo del usuario se lee de `current_setting('demo.email')`; si no está definido, usa `demo@democra.pro`.
3. **`supabase/seeds/demo-org-cleanup.sql`:** borra solo ese tenant, en orden de claves foráneas.

## Verificación
- Antes de aplicarlo, el seed se probó en una transacción revertida: crea 4 proyectos, 10 voluntarios, 6 actividades, 10 horas, 3 aprobaciones y 6 beneficiarios, sin dejar rastro.
- Tras aplicarlo:
  - Los mismos conteos coinciden.
  - El perfil demo está vinculado al tenant demo.
  - **La cuenta real del usuario sigue en su organización original (verificado).**

## Riesgos identificados
- Son datos ficticios en la base de **producción**. Están aislados por `tenant_id` y RLS, pero aparecerán en cualquier consulta global de administración, por ejemplo en listados de tenants.
- La cuenta demo tiene rol Owner de su propio tenant y ningún acceso a otros.

## Impacto esperado
Pantallas de `/ong` con contenido realista para capturas publicables.

## Módulos afectados
Datos de `public` (tenants, sedes, roles, role_permissions, profiles, user_roles_sedes, memberships) y de `ong` (áreas, ubicaciones, proyectos, voluntarios, asignaciones, actividades, horas, aprobaciones, beneficiarios, participaciones). Sin cambios de esquema.

## Dependencias involucradas
Ninguna nueva.

## Posibles efectos secundarios
Los triggers de auditoría (`tr_audit_*`) registraron las inserciones en `audit_logs`.

## Reversión
1. Ejecutar `supabase/seeds/demo-org-cleanup.sql`.
2. Borrar el usuario demo en el dashboard de Supabase (Authentication → Users).
