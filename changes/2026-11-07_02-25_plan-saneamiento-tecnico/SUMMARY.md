# SUMMARY — Plan de saneamiento técnico

**Qué se hizo:** se verificó contra código, build, tests y Supabase el plan de mejora
propuesto y se versionó en `docs/PLAN_SANEAMIENTO.md` (8 fases, criterios de aceptación,
riesgos, métricas y decisiones pendientes).

**Por qué:** la evaluación mostró una puerta de calidad no confiable, dos copias del
módulo ONG cargadas a la vez en `/ong`, un bug de producción en `verify-otp` y deuda de
configuración e higiene del repositorio.

**Beneficio:** orden de ejecución claro, cada paso con criterio verificable y reversión
definida; hallazgos respaldados por evidencia reproducible.

**Funcionalidades afectadas:** ninguna (cambio solo documental).
