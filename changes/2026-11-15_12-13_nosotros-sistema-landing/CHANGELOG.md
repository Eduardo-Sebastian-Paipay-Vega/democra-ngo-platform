# Changelog — /nosotros alineada con el sistema visual del landing

- **Fecha y hora:** 2026-11-15 12:13
- **Autor:** Claude (Claude Code), mediante `/landing-aplicar /nosotros`, a pedido del usuario.
- **Objetivo:** que `/nosotros` use el mismo lenguaje visual que `/` (sistema `.lp`), corrigiendo los defectos que encontró `/landing-auditar` (`.claude/landing-design/AUDIT.md`, N-01 a N-24).

## Contexto

`/nosotros` usaba el diseño anterior: Tailwind, unos 40 estilos en línea, `motion/react`, una paleta `#0055FF`/`#7000FF` y fondo negro. Además tenía:
- textos con tildes corruptas en pantalla («QUIÃ©NES SOMOS»);
- foco de teclado invisible;
- ningún menú en móvil;
- contraste insuficiente en la etiqueta y en el copyright;
- animaciones que no respetaban `prefers-reduced-motion`.

El usuario decidió alinearla con el landing y reformular dos afirmaciones no verificadas.

## Solución

- `NosotrosPage.tsx` se reescribió con la misma estructura que `LandingPage.tsx` y reutiliza `SiteHeader`, `FinalCta`, `SiteFooter`, `useReveal`, `Icons` y `ContactModal` (este último solo importado).
- `SiteHeader` y `SiteFooter` aceptan ahora `anchorBase`, para que desde `/nosotros` las anclas apunten a `/#seccion`. `FinalCta` acepta `title` y `lede`. Los valores por defecto dejan el landing igual.
- En `landing.css` solo se **añaden** reglas `lp-about-*`, `.lp-cta-lede` y `.lp-feature-copy .lp-kicker`.
- Textos reformulados (decisión del usuario):
  - Misión: «…acompañan a tu equipo a medida que crece.»
  - Cierre: «Crea el espacio de tu organización y empieza a coordinar a tu equipo con democra.pro.»
- Contenido conservado: los tres valores y el equipo («Eduardo Bastian · Fundador & CEO», «Equipo de Producto», «Asesores»).

## Verificación

- **Navegador** (Vite dev + Playwright/Chrome):
  - sin desbordes en 390, 768 y 1440;
  - sin errores de consola y sin texto corrupto;
  - foco azul de 3px;
  - menú móvil con anclas `/#…` y Escape que devuelve el foco;
  - reduced motion sin elementos ocultos.
- **Regresión de `/`:** geometría y enlaces idénticos antes y después (`.claude/landing-design/evidence/home-before-apply.json` frente a `home-after-apply.json`).
- **`tsc --noEmit`:** 6 errores previos y ajenos (módulos `ong`). Ninguno en los archivos cambiados.
- **`npm run build`:** **bloqueado** en `transforming...` (corte a 280 s). Es el mismo problema previo del entorno, así que el bundle de producción no se ha verificado.
- No se ejecutaron `npm test` ni `npm run test:web`.

## Riesgos

- Se cambian `SiteHeader` y `SiteFooter`, que el landing comparte. Se mitiga con props opcionales cuyos valores por defecto conservan el comportamiento, y está medido.
- Se pierde el botón «Volver al inicio»; ahora la marca enlaza a `/`.
- Se pierde la etiqueta «Acceder al sistema», sustituida por «Iniciar sesión».

## Otros cambios en el árbol, ajenos a este cambio

Durante la ejecución, otro proceso trabajó en `/login`:
- modificó `.claude/landing-design/scope.json`;
- creó `AUDIT-login.md`;
- volvió a tomar la foto de control;
- editó `src/app/LoginGateway.tsx`, `src/pages/login/LoginPage.tsx` y `src/pages/login/login.css`.

Este cambio no los incluye.

## Módulos afectados

Landing pública: `src/pages/nosotros/` y `src/pages/landing/sections/` + `landing.css`.

## Estado

**Parcial:** completado y verificado en el navegador, con el build de producción pendiente. Sin commit.

## Reversión

`git checkout HEAD -- src/pages/nosotros/NosotrosPage.tsx src/pages/landing/sections/SiteHeader.tsx src/pages/landing/sections/SiteFooter.tsx`. En `landing.css`, eliminar el bloque «Página /nosotros (prefijo lp-about-*)».
