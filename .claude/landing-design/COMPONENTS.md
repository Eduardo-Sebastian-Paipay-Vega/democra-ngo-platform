# COMPONENTS — landing `/` (sistema `.lp`)

Fuente: `src/pages/landing/sections/*.tsx` + `src/pages/landing/landing.css`. Las medidas «computed» provienen de `evidence/states-home.json` y `evidence/home-*.json` (Chrome, DPR 1). Certeza: **A** salvo que se indique lo contrario.

## Estructura de página

```
div.lp#inicio
├─ a.lp-skip → #lp-main
├─ div.lp-frame              (fijo, pointer-events:none; oculto <768)
├─ SiteHeader                (header.lp-header, fijo)
└─ main#lp-main
   ├─ div.lp-zone-top        (--lp-grad-hero + .lp-zone-scrim)
   │  ├─ Hero
   │  ├─ ProductDemo         (section#como-funciona)
   │  └─ AudienceStrip
   ├─ Features               (#funciones)
   ├─ Access                 (#acceso)
   ├─ Faq                    (#preguntas)
   └─ div.lp-zone-end        (--lp-grad-end)
      ├─ FinalCta
      └─ SiteFooter
```

## Primitivas reutilizables

| Primitiva | Selector | Anatomía / valores | Variantes |
|---|---|---|---|
| Contenedor | `.lp-container`, `.lp-container-narrow` | `min(1130px \| 960px, 100% − 48px)`, centrado | ancho, estrecho |
| Sección | `.lp-section` | `padding-block: var(--lp-section-y)` → 80/112/144 | — |
| Título | `.lp-display`, `.lp-h1`, `.lp-h2` | Inter Tight 500, tracking −0.03em, `text-wrap: balance` | acento: `.lp-accent-deep`, `.lp-accent-light` (`<span>` dentro del título) |
| Subtítulo | `.lp-sub` | mt 24, 15→18px, `--lp-fg-muted` | — |
| Botón | `.lp-btn` + tamaño | radio 16, fondo `--lp-primary`, texto `--lp-primary-ink`, anillo inset 1px `--lp-primary-ring`, transición 150 ms | `.lp-btn-lg` (54px, 18px), `.lp-btn-sm` (36px, 14px, fondo `--lp-primary-nav`), `.lp-btn-block` |
| Nota | `.lp-note` | 14/20, muted; enlaces subrayados con offset 3 y decoración 35 % → currentColor al hover | — |
| Tarjeta | `.lp-card` | borde 1px `--lp-card-border`, radio 18, fondo `--lp-card-bg` | `.lp-feature`, `.lp-feature-wide`, `.lp-access` |
| Lienzo | `.lp-canvas` | contenedor de ilustración dentro de la tarjeta | `-team`, `-timeline`, `-approval` |
| Chip | `.lp-chip` | fondo `--lp-chip-bg`, borde `--lp-chip-border`; 208×88 desde 768 | — |
| Kicker | `.lp-kicker` | 18px 500, `--lp-primary` | — |
| Foco | `.lp :focus-visible` | outline 3px `rgba(81,157,252,.6)`, offset 3, radio 8 | global en `.lp` |

### Estados medidos del botón (1440, `evidence/states-home.json`)

| Estado | `.lp-hero .lp-btn-lg` | `.lp-nav .lp-btn-sm` |
|---|---|---|
| Reposo | bg `rgb(81,157,252)` | bg `rgb(108,167,255)` |
| Hover | bg `rgb(108,167,255)` | bg `rgb(139,185,255)` |
| Focus-visible | outline `rgba(81,157,252,.6) 3px`, offset 3, **radio pasa a 8px** | ídem |
| Active | `translateY(1px)` (declarado, no medido) | ídem |

> Excepción observada: en el foco la regla `.lp :focus-visible { border-radius: 8px }` sustituye el radio de 16px del botón. El cambio es visible en `focus` (es nivel A: medido). Se registra para `/landing-auditar`, sin corregirlo aquí.

## Secciones

### SiteHeader — `sections/SiteHeader.tsx`
- `header.lp-header`: `position: fixed`, z 60. Padding superior de 16 / 32 / `clamp(43px, 3.5vw, 50px)`. Contenedor `min(920px, 100% − 48|92px)`.
- `nav.lp-nav`: píldora de min-height 62, radio 16, fondo `#070a0f` y borde `#1d2738`. **No cambia con el scroll** (top 0 y mismo fondo al cargar y en scrollY 1800).
- Contenido: `BrandMark`; enlaces de ancla (Funciones, Cómo funciona, Preguntas) y botón Contacto, visibles desde 1024; «Iniciar sesión» → `/login` (`.lp-nav-login`, muted); «Comenzar» → `/ong/create` (`.lp-btn-sm`, visible desde 640).
- Menú móvil (<1024): disparador `button[aria-controls="lp-mobile-menu"][aria-expanded]`, de 40×40. Abre `#lp-mobile-menu` (fondo `#070a0f`, animación `lp-fade`) con 9 acciones: Funciones, Cómo funciona, Preguntas, Acceso, Contacto, Iniciar sesión, Canjear código ACE (`/ong/join`), Ser voluntario (`/ong/signup`) y Crear mi organización (`/ong/create`). Escape lo cierra y **devuelve el foco** (medido). Evidencia: `evidence/state-mobile-menu-open-390.png`.

### BrandMark — `sections/BrandMark.tsx`
`/brand/d-core-neon.png`, 30×30, + `democra<span>.pro</span>` en 20px 500, tracking −0.02em. Variantes `md` y `lg` (`.lp-brand-lg`, gap 14).

### Hero — `sections/Hero.tsx`
Centrado. `.lp-display` (h1 a 70px, top 285 en 1440) → `.lp-hero-lede` (máx. 860, 20px/32 en ≥1024) → `.lp-btn-lg` «Crear mi organización» (mt 32/44) → `.lp-note` con «Inicia sesión» y «Solicita una demo» (abre el modal).

### ProductDemo — `sections/ProductDemo.tsx` + `DemoParts.tsx`
Ventana ilustrativa `role="img"` de 1130×768 en 1440, con fondo `--lp-grad-demo-shell` y padding 10 desde 768.
- Partes: luces, barras (org, URL e indicadores; estos dos últimos visibles desde 768), lienzo con `ProjectScreen`, columna lateral (desde 768, de 176/190px) con `Segmented` y `ApprovalPanel`, y línea de tiempo (`TimelinePanel`, 200px de alto desde 768) con panel de ajustes.
- Contiene micro-tipografía (7-11px) y colores literales de ilustración. **No son tokens de UI.**
- Estilos en línea: solo `DemoParts.tsx:67` (posición de bloques mediante `--lp-row`) y `:139` (anchos de barras). Son datos de la ilustración.

### AudienceStrip — `sections/AudienceStrip.tsx`
Título de 14/16px y marquesina `.lp-marquee` (máscara lateral 8 %) → `.lp-marquee-track` con la animación `lp-marquee` (48s, lineal e infinita). Con reduced motion queda en `none`. Chips con los tipos de organización y una lista `sr-only` para lectores de pantalla.

### Features — `sections/Features.tsx`
`#funciones`, H2 con palabra acentuada. Rejilla de 1 columna, que pasa a 2 desde 768. Tiene dos `.lp-feature` (lienzo + copy) y una `.lp-feature-wide`, que ocupa todo el ancho, se divide en 2 columnas desde 1024 y tiene lienzo 1:1 por debajo de 1024.

### Access — `sections/Access.tsx`
`#acceso`. Tarjeta `.lp-access` de 1 columna, que pasa a 2 desde 1024. A un lado, la lista de módulos; al otro, `.lp-access-highlight` (fondo `--lp-card-raised`) con `.lp-kicker`, `.lp-access-big` y CTA «Crear organización», más enlaces a login y voluntariado. Debajo, `.lp-access-foot` con el enlace al código ACE.

### Faq — `sections/Faq.tsx`
`#preguntas`, `.lp-container-narrow`. Tiene 7 ítems `.lp-faq-item` con borde inferior `--lp-divider`. Cada botón lleva `aria-expanded` y su panel es `role=region` + `hidden`, con una animación `lp-accordion-fade`. Abrir y cerrar está medido (`false → true`).

### FinalCta + SiteFooter — `sections/SiteFooter.tsx`
- `.lp-cta`: padding-top `clamp(96px, 15.7vw, 226px)`, título de máximo 12.5em y botón grande.
- `.lp-footer-plate`: negro, máximo 1304, radio 16. Contiene marca; un bloque de contacto con `.lp-footer-field`, un **botón** con aspecto de campo que abre el modal (no es un formulario); 2 columnas de enlaces (156/184 desde 1024); y `.lp-footer-bottom` con copyright y «Volver arriba».

### ContactModal — `src/pages/landing/ContactModal.tsx` (compartido)
Se carga en diferido desde el landing. Usa `motion/react`, `qrcode.react` y `contact-modal.css`. **Fuera del sistema `.lp`**. Lo comparte `src/core/shell/PublicLayout.tsx`. No se inspeccionó visualmente en esta ejecución: queda como nivel C para estilos del modal.

## Componentes heredados (no pertenecen a este sistema)

`src/pages/landing/components/*` (Navbar, Hero, Footer, GradientBackground, CursorSpotlight…) son del diseño anterior y siguen en uso por `PublicLayout` y `LoginGateway`. **No son referencia** y no deben modificarse.
