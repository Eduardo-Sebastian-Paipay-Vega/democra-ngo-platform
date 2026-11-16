# SUMMARY — Organización demo ficticia (ONG)

**Qué se hizo.**
- Se creó en producción una organización ONG ficticia, «Red Solidaria Andina (demo)», con proyectos, voluntarios, actividades, horas en distintos estados, aprobaciones pendientes y beneficiarios.
- Se creó un usuario demo sin contraseña, que actúa como su dueño.
- Los scripts de creación y de limpieza quedan en `supabase/seeds/`.

**Por qué.** Para que el landing muestre pantallas reales del sistema en lugar de piezas inventadas, sin exponer datos de organizaciones reales.

**Beneficio.** Las capturas son publicables y se pueden regenerar. Hay una cuenta demo reutilizable para presentaciones.

**Funcionalidades afectadas.** Ninguna funcionalidad ni esquema cambió. Solo se añadieron filas aisladas por `tenant_id`.
