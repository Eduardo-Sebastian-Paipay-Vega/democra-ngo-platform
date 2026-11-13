# Archivos afectados

## Código

- `src/App.tsx` — se retiraron las importaciones estáticas de Login y Nosotros y se cambiaron por importaciones `lazy` de React Router.
- `src/main.tsx` — se retiró `SettingsProvider` del punto de entrada principal, evitando iniciar preferencias y Supabase en las rutas públicas que no consumen ese contexto.
- `src/pages/landing/LandingPage.tsx` — el modal de contacto se carga con `React.lazy` y solo se monta cuando se abre.

## Auditoría

- `changes/2026-11-13_08-31_optimizacion-rendimiento-landing/CHANGELOG.md` — contexto, decisiones, riesgos, validaciones y reversión.
- `changes/2026-11-13_08-31_optimizacion-rendimiento-landing/SUMMARY.md` — resumen ejecutivo del cambio.
- `changes/2026-11-13_08-31_optimizacion-rendimiento-landing/FILES_CHANGED.md` — inventario de archivos y efecto de cada cambio.

No se cambiaron archivos de backend, bases de datos, migraciones, dependencias, módulos ONG ni configuración de despliegue.
