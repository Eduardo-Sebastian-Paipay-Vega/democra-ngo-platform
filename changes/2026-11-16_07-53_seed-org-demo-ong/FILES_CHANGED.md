# FILES_CHANGED — Organización demo ficticia (ONG)

| Archivo | Acción | Cambio |
|---|---|---|
| `supabase/seeds/demo-org.sql` | Creado | Seed idempotente del tenant demo; correo configurable con `set demo.email` |
| `supabase/seeds/demo-org-cleanup.sql` | Creado | Limpieza del tenant demo en orden de claves foráneas |
| `changes/2026-11-16_07-53_seed-org-demo-ong/*` | Creados | Este registro |

**Fuera del repo (base de datos PT_solaris):** 1 usuario en `auth.users` y `auth.identities`, y las filas del tenant `de300000-0000-4000-8000-000000000001`. El detalle está en CHANGELOG.md.
