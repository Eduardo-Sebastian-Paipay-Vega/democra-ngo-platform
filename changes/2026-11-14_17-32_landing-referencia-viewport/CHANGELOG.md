# Changelog — landing pública con composición de referencia Viewport

- **Fecha y hora:** 2026-11-14 17:32 (America/Lima)
- **Autor:** Claude (Claude Code), a pedido de Eduardo Paipay.
- **Objetivo:** reconstruir la landing pública `/` de Democra reproduciendo con alta fidelidad la estructura, geometría, tipografía, color, responsive e interacciones de <https://viewport.theresonance.studio/?ref=onepagelove>, con textos, marca e ilustraciones propios de Democra y conservando las acciones funcionales existentes.

## Contexto del problema

La landing en `HEAD` (`d116c79`) mostraba solo Navbar + Hero + Footer; el resto de secciones estaba oculto con `SHOW_MOCK_SECTIONS = false` porque contenía datos simulados (REQ-001). En el árbol de trabajo había un intento anterior sin commit basado en swashmotion.com (prefijo `.dm-`). El usuario pidió reemplazar la base del landing por la composición de Viewport, manteniendo los botones necesarios (inicio de sesión, etc.).

## Motivo

Dar a la ruta pública una página completa, coherente y responsive, sin datos inventados (sin logos de clientes, precios ni métricas no verificadas), alineada con lo que la plataforma ofrece hoy (módulo ONG).

## Solución implementada

- Inspección real de la referencia con Playwright MCP (estilos calculados, colores convertidos a sRGB, interacciones de FAQ y menú móvil) en 1440/1024/768/390.
- Documentación: `docs/reference-audit.md`, `docs/design-tokens.json` (cada token marcado como confirmado, inferido o adaptado), `docs/assets-manifest.md` y `docs/visual-comparison.md`.
- Nueva estructura en componentes, en `src/pages/landing/sections/`: `SiteHeader` (nav en píldora + menú móvil accesible), `Hero`, `ProductDemo` (ventana de aplicación ilustrativa en CSS), `AudienceStrip` (franja en bucle con tipos de organización), `Features` (3 tarjetas), `Access` (sustituye a «precios» sin mostrar precio), `Faq` (acordeón accesible), `FinalCta` + `SiteFooter`, más `DemoParts`, `BrandMark`, `Icons` y el hook `useReveal`.
- `landing.css` reescrito con tokens `--lp-*`, acotado bajo `.lp` y con resets en `:where()` para no afectar al resto de la app.
- Acciones conservadas: Iniciar sesión (`/login`), Comenzar / Crear organización (`/ong/create`), Canjear código ACE (`/ong/join`), Ser voluntario (`/ong/signup`), Contacto / Solicitar demo (`ContactModal` existente, carga diferida).
- Sin backend, sin endpoints nuevos, sin persistencia y sin formularios que envíen datos (el newsletter de la referencia se sustituyó por un botón que abre el modal de contacto ya existente).

## Riesgos identificados

- **Compilación de producción no verificada:** `vite build` y `npm run dev` se bloquean en este entorno (optimizador de dependencias y `transforming...` sin avanzar). El intento anterior registró el mismo síntoma, así que no lo introduce este cambio. Debe verificarse `npm run build` en otro entorno o tras reiniciar los procesos colgados antes de desplegar.
- Inter Tight sustituye a la fuente comercial `ritual`: la tipografía no es idéntica.
- Los textos de marketing en español son nuevos y conviene que negocio los valide.

## Impacto esperado

La ruta `/` pasa a ser una landing completa de 8 secciones, responsive de 390 a 1440+, con marco de página, demo ilustrativa, funciones, acceso, FAQ y CTA.

## Módulos afectados

Solo la landing pública: `src/pages/landing/`. No se tocan `ong/`, `server/`, `api/` ni otras páginas.

## Dependencias involucradas

Ninguna nueva. Se usan `react`, `react-router` (ya presentes) e Inter Tight (ya cargada en `index.html`).

## Posibles efectos secundarios

- Los componentes antiguos de `src/pages/landing/components/` (Navbar, Hero, Pricing…) ya no se importan desde la landing. Se conservan sin borrar.
- El CSS de la landing es global al importarse, pero está acotado bajo `.lp` con prefijo `lp-`.
- `index.html` mantiene el cambio de `og:description` del intento anterior (texto sin claims no verificados).

## Estado

**Parcial.** Implementación completa y verificada visualmente y por interacción (Playwright, 2 pasadas de corrección, sin errores de consola ni scroll horizontal) y chequeo de tipos sin errores en `src/pages/landing`. **Falta** que `vite build` termine en este entorno. Por eso, según las reglas del repo, **no se hizo push**.

## Reversión

`git checkout d116c79 -- src/pages/landing/LandingPage.tsx index.html`, eliminar `src/pages/landing/sections/` y `src/pages/landing/landing.css`, y retirar los documentos de `docs/` listados en `FILES_CHANGED.md` y esta carpeta.
