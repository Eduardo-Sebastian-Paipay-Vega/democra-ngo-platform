# Archivos cambiados

## Modificados

| Archivo | Cambio |
|---|---|
| `src/pages/landing/LandingPage.tsx` | Reescrito: compone las secciones nuevas, marco de página, enlace «saltar al contenido», hook de revelado y `ContactModal` con carga diferida |
| `index.html` | (del intento anterior, se conserva) `og:description` sin claims no verificados |

## Creados

| Archivo | Contenido |
|---|---|
| `src/pages/landing/landing.css` | Sistema de estilos de la landing: tokens `--lp-*`, resets en `:where(.lp)`, layout, componentes, responsive (640/768/1024/1280) y `prefers-reduced-motion` |
| `src/pages/landing/sections/SiteHeader.tsx` | Nav en píldora, enlaces, Iniciar sesión, Comenzar y menú móvil (Escape, devolución de foco, cierre al pasar a escritorio) |
| `src/pages/landing/sections/BrandMark.tsx` | Monograma + wordmark «democra.pro» |
| `src/pages/landing/sections/Hero.tsx` | Titular, lede, CTA y nota con inicio de sesión y demo |
| `src/pages/landing/sections/ProductDemo.tsx` | Ventana de aplicación ilustrativa (`role="img"`) |
| `src/pages/landing/sections/DemoParts.tsx` | Piezas reutilizables: línea de tiempo, panel de aprobación, control segmentado, pantalla de proyecto |
| `src/pages/landing/sections/AudienceStrip.tsx` | Franja en bucle de tipos de organización (con lista accesible oculta) |
| `src/pages/landing/sections/Features.tsx` | Sección de funciones con 3 tarjetas |
| `src/pages/landing/sections/Access.tsx` | Bloque de acceso: módulos incluidos + tarjeta destacada con Crear organización |
| `src/pages/landing/sections/Faq.tsx` | Acordeón de 7 preguntas con ARIA |
| `src/pages/landing/sections/SiteFooter.tsx` | CTA final y footer (contacto, enlaces, línea legal) |
| `src/pages/landing/sections/Icons.tsx` | Iconos SVG en línea propios |
| `src/pages/landing/sections/useReveal.ts` | Revelado por opacidad al entrar en viewport |
| `docs/reference-audit.md` | Auditoría de la referencia (secciones, tipografía, paleta, geometría, responsive, interacciones, limitaciones, decisiones) |
| `docs/design-tokens.json` | Tokens con estado confirmado/inferido/adaptado |
| `docs/assets-manifest.md` | Recursos de la referencia y sus sustitutos |
| `docs/visual-comparison.md` | Método, geometría comparada, pasadas de corrección, métricas e interacciones |
| `changes/2026-11-14_17-32_landing-referencia-viewport/*` | Esta auditoría |

## Sin cambios (conservados)

- `src/pages/landing/components/*` (componentes de la landing anterior, ya no importados) y `src/pages/landing/ContactModal.tsx`.

## Restos del intento anterior (sin commit)

- `changes/2026-11-14_10-11_reconstruccion-landing-democra/` y `docs/performance-check.md` describen el diseño Swash Motion, que este cambio reemplaza. No se borraron automáticamente: queda a decisión del autor.

## Carpetas afectadas

`src/pages/landing/`, `src/pages/landing/sections/` (nueva), `docs/`, `changes/`.
