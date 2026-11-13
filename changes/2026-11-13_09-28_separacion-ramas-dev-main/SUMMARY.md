# Resumen ejecutivo

Se estableció `dev` como rama de integración y se reservó `main` para producción de Vercel. Las instrucciones del repositorio ahora recomiendan ramas breves por tarea, PR hacia `dev` y PR de release hacia `main`, para reducir conflictos y evitar desplegar trabajo incompleto.

La rama `dev` fue creada desde el `main` sincronizado. Aún falta confirmar en el dashboard de Vercel que `main` sea la Production Branch y habilitar protección de `main` en GitHub; esta sesión no tiene acceso autenticado a esos ajustes.
