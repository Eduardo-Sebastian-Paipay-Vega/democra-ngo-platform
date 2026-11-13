# Changelog: optimización de carga del landing

## Registro

- **Fecha:** 2026-11-13, zona horaria America/Lima.
- **Autor:** Codex, a solicitud del usuario.
- **Estado:** Parcial; cambios implementados, validación final limitada por el entorno local.

## Objetivo

Reducir los recursos que se descargan y ejecutan al abrir la página principal (`/`), posponiendo código de páginas que el visitante todavía no necesita.

## Contexto del problema

La medición previa del sitio publicado encontró una carga de 6,0–6,5 s en Chrome móvil simulado (latencia 150 ms, 200 KB/s y CPU 4×), frente a 1,2–3,5 s en dos cargas de escritorio. La transferencia inicial en producción estuvo entre 0,83 y 0,94 MB. El chunk de proveedor general fue el mayor recurso descargado (576 KB transferidos); también aparecía un chunk de Supabase de 55 KB.

En el código, `/login` y `/nosotros` se importaban estáticamente desde `src/App.tsx`; `src/main.tsx` envolvía todas las páginas públicas con `SettingsProvider`, que monta la consulta de preferencias y carga Supabase; y `ContactModal` se importaba aunque no estuviera abierto.

## Solución implementada

1. `/login` y `/nosotros` usan `lazy` de React Router y solo importan su componente al visitar esa ruta.
2. El entrypoint principal deja de montar `SettingsProvider`. Las páginas atendidas por ese entrypoint no consumen `useSettings`; el componente `App` exportado conserva su wrapper para otros consumidores.
3. `ContactModal` usa `React.lazy` y solo se monta después de abrirse desde el CTA.

No se añadieron paquetes, endpoints, datos simulados, consultas, tablas ni migraciones. El módulo independiente `/ong/` y su autenticación compartida no se modificaron.

## Riesgos identificados

- La carga diferida hace que la primera visita a `/login`, `/nosotros` o al modal requiera descargar un chunk adicional; debe confirmarse que esas transiciones rendericen correctamente.
- Quitar el proveedor del entrypoint público depende de que esas páginas no necesiten sus preferencias; el código consultado solo usa `useSettings` en `Topbar` y `SettingsPage`, que no forman parte de esas rutas.
- La prueba local de navegador y el build no terminaron porque Vite quedó sin responder durante la transformación. No se debe interpretar el resultado local como una medición del sitio publicado.

## Impacto esperado

La portada deja de solicitar los chunks de Login, Nosotros, ContactModal y SettingsContext/Supabase cuando no son necesarios. La cifra de ahorro deberá confirmarse contra un build de producción funcional y una nueva medición Lighthouse con caché fría.

## Módulos afectados

- Enrutamiento del entrypoint web principal (`src/App.tsx`).
- Arranque de páginas públicas (`src/main.tsx`).
- Landing y modal de contacto (`src/pages/landing/LandingPage.tsx`).

## Dependencias

Se utilizan React y React Router ya instalados. No se añadieron ni actualizaron dependencias.

## Efectos secundarios posibles

- La vista de contacto aparece después de la descarga del módulo al primer clic.
- Las páginas públicas ya no ejecutan la carga de preferencias globales; sus componentes actuales no consumen ese contexto.

## Validación

- `npm ls --depth=0`: completó sin errores de resolución.
- `.env`: existe y las tres variables Supabase requeridas están configuradas (los valores no se copiaron a este registro).
- `npm test` previo al cambio: 29 suites y 369 pruebas pasaron; 4 suites fallaron por imports de backend inexistentes (`supabase.js`, `config.js`, `stripe.js`).
- `npm run test:web` previo al cambio: 101 archivos y 535 pruebas pasaron.
- `npm run typecheck` posterior: terminó con errores en `ong/src/app/pages/Courses.tsx` e `src/industries/ong/registry.tsx`; no reportó errores en los tres archivos modificados.
- `npm run build` posterior: se detuvo tras no mostrar progreso de Vite durante varios minutos; no se generó `dist`.
- `npm run test:web` posterior: 46 archivos y 293 pruebas pasaron antes de que Vitest reportara 55 errores al iniciar workers por timeout. Un segundo intento con `--maxWorkers=2` emitió errores de aborto de Happy DOM y fue cancelado al prolongarse sin resumen.
- `npm test` posterior: confirmó el mismo resultado base, 29 suites y 369 pruebas aprobadas, con 4 suites fallidas por imports de backend ausentes.
- Smoke test local: Vite anunció disponibilidad tras 17 s, pero el navegador no obtuvo `DOMContentLoaded` en 60 s.
- `vercel whoami`: el CLI no encontró credenciales e inició el flujo de login; se detuvo el proceso sin completar autenticación.

La autenticación/rutas no se pudieron validar con una compilación de producción en este entorno y no se hizo deploy ni push. La prueba de base de datos no aplica: el cambio no toca persistencia, relaciones, API ni esquema.

## Reversión

Revertir los cambios de `src/App.tsx`, `src/main.tsx` y `src/pages/landing/LandingPage.tsx`, y retirar esta carpeta de auditoría. Si ya se creó un commit dedicado, usar `git revert <hash-del-commit>` para conservar el historial.
