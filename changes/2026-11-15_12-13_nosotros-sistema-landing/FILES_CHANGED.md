# Archivos cambiados

| Archivo | Cambio |
|---|---|
| `src/pages/nosotros/NosotrosPage.tsx` | Reescrito sobre el sistema `.lp`; tildes corregidas; textos de N-23 reformulados; se quitan `motion/react` y los estilos en línea |
| `src/pages/landing/sections/SiteHeader.tsx` | Prop opcional `anchorBase`; la marca enlaza a `anchorBase` cuando se indica |
| `src/pages/landing/sections/SiteFooter.tsx` | `FinalCta`: props `title` y `lede`. `SiteFooter`: prop `anchorBase` |
| `src/pages/landing/landing.css` | Se añade el bloque `lp-about-*`, `.lp-cta-lede` y `.lp-feature-copy .lp-kicker`. No se cambia ninguna regla existente |
| `.claude/landing-design/AUDIT.md` | Resultado de la aplicación y estado de cada divergencia |
| `.claude/landing-design/evidence/*-apply*`, `nosotros-after-*` | Capturas y JSON de verificación |
| `changes/2026-11-15_12-13_nosotros-sistema-landing/*` | Esta auditoría |

**No incluidos** (cambios ajenos que hay en el árbol): `src/app/LoginGateway.tsx`, `src/pages/login/*`, `scope.json` (edición de /login), `AUDIT-login.md`, `ContactModal.tsx`, `contact-modal.css`, `sections/Faq.tsx` y la regla `lp-accordion-fade` de `landing.css`.
