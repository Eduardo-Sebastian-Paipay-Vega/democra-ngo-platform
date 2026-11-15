# AUDIT — `/nosotros` frente al sistema `.lp` del landing

- **Fecha:** 2026-11-15, por `/landing-auditar /nosotros`. Es un informe: no se modificó código.
- **Referencia:** `/` (`DESIGN.md`, `TOKENS.json`, `COMPONENTS.md`), commit `0e57991`.
- **Página auditada:** `/nosotros` → `src/pages/nosotros/NosotrosPage.tsx` (393 líneas). Entra en la allowlist por decisión del usuario (2026-11-15).
- **Excluidas:** `/login`, `/ong/*`, `/app`, `/admin`, `/dashboard`, `api/` y `server/`. Ninguna se visitó ni se inspeccionó.

## Evidencias

| Archivo | Qué contiene |
|---|---|
| `evidence/-nosotros-{desktop,tablet,mobile}.{png,json}` | Captura de página completa y computed styles (1440, 768, 390) |
| `evidence/nosotros-states.json` | Foco con teclado, cabecera, estado del movimiento con y sin `prefers-reduced-motion`, navegación móvil |
| `evidence/home-*.json`, `evidence/states-home.json` | Valores de referencia del landing |

## Resumen

`/nosotros` no comparte ningún elemento con el sistema `.lp`:

- No importa `landing.css` y no hay ningún contenedor `.lp` (`lpRoot: false`).
- Usa Tailwind, unos 40 estilos en línea, `motion/react` y una paleta propia (`#0055FF`, `#7000FF`, `#888`, fondo `#000`).
- Además tiene **un defecto crítico de codificación**: todos los acentos se ven rotos en el navegador.
- Y **tres fallos de accesibilidad**: el foco es invisible, no hay navegación en móvil y el pie tiene contraste insuficiente.

La alineación consiste en **recomponer la página con las primitivas `.lp`**, conservando su contenido. No basta con retocar colores.

## Matriz de divergencias

Gravedad: **Crítica** (rompe contenido o acceso) · **Alta** (identidad o accesibilidad) · **Media** · **Baja**.
«Intencional» indica una variación aceptable que no hace falta igualar.

| ID | Área | Selector / archivo:línea | Valor actual (medido) | Referencia `.lp` | Gravedad | Recomendación |
|---|---|---|---|---|---|---|
| N-01 | Contenido | Todo el texto con tildes: 14 cadenas en `NosotrosPage.tsx` (p. ej. l.8, 30, 41, 103) | Se ve «QUIÃ©NES SOMOS», «NUESTRA MISIÃ³N», «Â¿Listo para empezar?», «Â© 2026 democra.pro Â· PerÃº». Es UTF-8 codificado dos veces dentro del archivo (el archivo es UTF-8 válido, pero contiene la secuencia mal convertida) | Texto en español correcto | **Crítica** | Reescribir las cadenas con los caracteres correctos (quiénes, misión, guían, decisión, fricción, más, acción, tecnología, Diseño, Ingeniería, ¿, Ú, ©, ·, Perú, —). Verificar con `grep -c "Ã\|Â" = 0` |
| N-02 | Accesibilidad / foco | Todos los enlaces y botones (`evidence/nosotros-states.json` → `focus1`, `focus4`) | Contorno nativo `rgb(16,16,16) auto 1px` sobre fondo `#000`: **invisible** | `.lp :focus-visible` → contorno 3px `rgba(81,157,252,.6)`, separación 3px | **Alta** | Desaparece al envolver la página en `.lp`. Comprobar con Tab que el anillo azul es visible |
| N-03 | Navegación móvil | `header nav` (`hidden md:flex`, l.71) | A 390 px el `nav` tiene `display:none` y **no hay botón de menú**: solo se ven el logo e «Ingresar» | `SiteHeader`: hamburguesa con `aria-expanded` y 9 acciones (Escape cierra y devuelve el foco) | **Alta** | Sustituir la cabecera por `SiteHeader` |
| N-04 | Cabecera | `<header>` l.59-87 | Barra de ancho completo, 64 px, `rgba(0,0,0,.6)` + `blur(20px)`, borde inferior | Píldora `.lp-nav` de 62 px, ancho máx. 920, fondo `#070a0f`, borde `#1d2738`, radio 16, margen superior 16/32/43-50 | Alta | Usar `SiteHeader` (ver dependencia D-1) |
| N-05 | Botones | «Ingresar» l.77, «Acceder al sistema» l.351, «Volver al inicio» l.362 | Degradado `135deg #0055FF→#3b82f6`, resplandor `0 0 24-36px rgba(0,85,255,.3)`, radio 12, texto blanco 600, barrido de brillo al pasar el ratón | `.lp-btn`: azul liso `#519dfc`, texto `#090d14` 500, anillo interior 1px `#a7caff`, radio 16, alto 36/54, hover `#6ca7ff` | Alta | `.lp-btn .lp-btn-sm` / `.lp-btn-lg`. El botón secundario («Volver al inicio») pasa a ser un enlace de texto en `.lp-note`, porque el sistema no tiene botón secundario |
| N-06 | Etiquetas de botones | «Ingresar», «Acceder al sistema» | Nombres distintos para ir a `/login` | El landing usa «Iniciar sesión» (`/login`) y «Comenzar» / «Crear mi organización» (`/ong/create`) | Media | Usar las mismas etiquetas y destinos que el landing |
| N-07 | Paleta / acento | Kicker l.97/129 `#0055FF`, iconos `#0055FF`/`#7000FF`, avatares l.287 | Azul `#0055FF` y violeta `#7000FF` | Acento único azul: `--lp-primary #519dfc`, `--lp-accent-deep #3a79dc`, `--lp-accent-light #6ca7ff`. **No hay violeta** | Alta | Pasar a tokens `--lp-*` y eliminar `#7000FF` |
| N-08 | Contraste | Kicker 12px `#0055FF` sobre `#000` | Contraste ≈ **3,7:1** (calculado). No llega a AA para texto de 12px | `.lp-kicker` 18px `#519dfc` ≈ 7,6:1 | Alta | `.lp-kicker` |
| N-09 | Contraste | Copyright l.384 `rgba(136,136,136,.5)` sobre `#000` | Equivale a `#444` → ≈ **2,1:1** | `.lp-footer-bottom` `rgba(255,255,255,.6)` ≈ 7,4:1 | Alta | `SiteFooter` |
| N-10 | Texto secundario | `var(--body-fg, #888)` (17 apariciones) | `rgb(136,136,136)`. `--body-fg` no está definida en esta ruta, así que se usa el valor de reserva. 300 de grosor | `--lp-fg-muted rgba(255,255,255,.77)`, 400 | Media | `.lp-sub` / `.lp-note` / `--lp-fg-muted` |
| N-11 | Fondo y atmósfera | Raíz `bg-[#000000]` l.49, resplandor fijo l.51-57, degradado del CTA l.317 | Negro puro con halos radiales azul/violeta al 7-9 % | `--lp-bg #090d14`; zonas con `--lp-grad-hero` y `--lp-grad-end`; marco fijo desde 768 | Alta | Raíz `div.lp` + `.lp-frame`. Zona superior con `--lp-grad-hero` y zona final con `--lp-grad-end` (como en el landing) |
| N-12 | Tipografía de títulos | h1 l.105, h2 l.135/196/265, h2 del CTA l.329 | Inter Tight **800**, tracking −0.04em. h1 a 96px en 1440 y 48px en 390; h2 a 56/32px; CTA a 80px con `text-shadow` resplandeciente | Inter Tight **500**, −0.03em, `text-wrap: balance`. `.lp-display` 70 / `.lp-h1` 64 / `.lp-h2` 30-32, sin sombra de texto | Alta | `.lp-display` (hero), `.lp-h2` (secciones), `.lp-h1` (CTA) |
| N-13 | Título con degradado | «democracia digital» l.111-118 | Texto con degradado `#0055FF→#7000FF` (`background-clip:text`) | El acento es un color plano en `<span class="lp-accent-deep">` | Media | `lp-accent-deep` |
| N-14 | Tipografía del cuerpo | Párrafos `font-light` (300) | 300 de grosor, 14-18px | Fuente del sistema, 400, 15-20px según el componente (`.lp-sub`, `.lp-hero-lede`) | Media | Clases `.lp-*` |
| N-15 | Tarjetas | Valores l.214-226, misión l.159-165, equipo l.283-290 | Radios **20 y 24**, fondo `rgba(255,255,255,.02-.025)`, borde `.07`, `backdrop-filter: blur(18px)`, hover con JS (`onMouseEnter` cambia el borde) | `.lp-card`: radio **18**, fondo `rgba(235,235,235,.05)`, borde `rgba(235,245,235,.1)`, sin desenfoque, sin hover en tarjetas | Media | `.lp-card` y eliminar los manejadores de hover |
| N-16 | Contenedor y ritmo | `max-w-5xl` (1024) / `max-w-4xl` (896), `py-24` / `py-32` / `py-36`, `px-6` | Anchos de 1024 y 896; padding vertical de 96 a 144 | `.lp-container` 1130 / `.lp-container-narrow` 960; `.lp-section` 80/112/144 según el ancho | Media | `.lp-container` + `.lp-section`. El equipo puede ir en `.lp-container-narrow` (variación aceptable) |
| N-17 | Movimiento | `motion.div` con `whileInView` (l.122, 189, 207, 258, 276, 322) | Fundido con desplazamiento de 20-28px. **No respeta `prefers-reduced-motion`**: con `reduce` los bloques siguen con `opacity 0` y `translateY(20-24px)` hasta llegar a la vista (`nosotros-states.json` → `reduce`) | `useReveal` + `data-reveal`: solo opacidad, 0,7s `--lp-ease-out`, desactivado con `reduce` | Media | Usar `useReveal` y quitar `motion/react` de esta página |
| N-18 | Iconografía | SVG en línea en `values` l.4-37 | Trazo de 1,5px en `#0055FF` / `#7000FF`, 28px | `sections/Icons.tsx`: iconos propios con `currentColor` | Baja | Usar o ampliar `Icons.tsx` con `currentColor` |
| N-19 | Ilustración de la misión | SVG abstracto l.172-186 con opacidad 0,15 | Círculos concéntricos con degradado violeta | Las tarjetas del landing usan ilustraciones de interfaz (`DemoParts`) dentro de `.lp-canvas` | Baja · **Intencional** | Se acepta una ilustración propia. Recolorear a la paleta azul y colocarla en `.lp-canvas` |
| N-20 | Pie de página | `<footer>` l.380-387 | Una línea centrada con copyright, borde superior | `SiteFooter`: placa negra de 1304px, contacto, 2 columnas de enlaces, copyright y «Volver arriba» | Alta | `FinalCta` (opcional) + `SiteFooter` |
| N-21 | Estructura accesible | Raíz | Sin enlace para saltar al contenido. `main` y un único `h1` presentes | `.lp-skip` → `#lp-main` | Media | Mismo esqueleto que `LandingPage.tsx` |
| N-22 | Logo | `<img src="/brand/d-core-monogram.png" alt="democra.pro">` + texto 14px 600 | 28px de alto y wordmark sin «.pro» atenuado | `BrandMark`: imagen de 30px con `alt=""` + `democra<span>.pro</span>` 20px 500 | Baja | `BrandMark` |
| N-23 | Afirmaciones sin verificar | l.146 «de 5 a 50,000 personas sin cambiar de plataforma»; l.341 «Únete a las organizaciones que ya gestionan su impacto» | Afirmación cuantitativa y prueba social | El landing evita afirmaciones no verificadas (REQ-001 en `CHANGELOG` del landing) | Media | **Resuelto:** reformular (ver «Decisiones del usuario») |
| N-24 | Responsive | 390 / 768 / 1440 | Sin desbordamiento horizontal (`scrollWidth` = viewport). Valores, equipo y misión se apilan correctamente | — | — | Sin acción. Volver a medirlo después del cambio |

## Variaciones intencionales (no igualar)

- `/nosotros` no necesita la demo de producto, la franja de organizaciones ni el FAQ.
- La sección de valores (3 tarjetas) y la de equipo (3 tarjetas con iniciales) son contenido propio. Se conservan con la anatomía `.lp-card`.
- La composición de la misión (texto + ilustración en 2 columnas) es válida. Solo cambia su lenguaje visual.

## Dependencias y riesgos

| ID | Dependencia | Riesgo | Mitigación |
|---|---|---|---|
| D-1 | `SiteHeader` enlaza anclas relativas (`#funciones`, `#como-funciona`, `#preguntas`, `#acceso`). En `/nosotros` esas anclas no existen | Enlaces del menú que no llevan a ninguna parte | Añadir a `SiteHeader` una prop (p. ej. `anchorBase="/"`) que genere `/#funciones`. El cambio está dentro de `sections/` (permitido). El landing sigue igual |
| D-2 | `SiteHeader` y `SiteFooter` reciben `onContact`, que abre `ContactModal` | `ContactModal.tsx` está **protegido** (lo comparte `PublicLayout`) y tiene cambios ajenos sin commit | Solo **importarlo** de forma diferida, igual que `LandingPage.tsx`. No editarlo |
| D-3 | `landing.css` se importa de forma global | Al cargar `/nosotros` sin pasar por `/` las reglas `.lp-*` deben estar disponibles | Importar `../landing/landing.css` en `NosotrosPage.tsx`. Las reglas están acotadas a `.lp`, así que el riesgo de fuga es bajo |
| D-4 | `motion/react` deja de usarse en `/nosotros` | Ninguno: lo siguen usando `ContactModal` y otros módulos, no se desinstala | — |
| D-5 | `useReveal` vive en `sections/useReveal.ts` | Ninguno | Reutilizarlo con `ref` en la raíz `.lp` |
| D-6 | El texto actual contiene cadenas mal codificadas | Al reescribir hay que transcribir el contenido con exactitud | Lista de correcciones en N-01. Verificar contra el contenido original |

## Plan de cambio (para `/landing-aplicar`)

**Archivos permitidos que se tocarían:**

1. `src/pages/nosotros/NosotrosPage.tsx`: reescribir sobre el esqueleto del landing:
   ```
   div.lp#inicio (ref useReveal) › a.lp-skip › div.lp-frame › SiteHeader(anchorBase="/")
   › main#lp-main
     › div.lp-zone-top › section.lp-hero (kicker + .lp-display con <span lp-accent-deep> + .lp-hero-lede)
     › section.lp-section «Nuestra misión» (.lp-container, .lp-card 2 col + .lp-canvas)
     › section.lp-section «Nuestros valores» (.lp-h2 + 3 × .lp-card con iconos currentColor)
     › section.lp-section «El equipo» (.lp-container-narrow + 3 × .lp-card)
     › div.lp-zone-end › FinalCta (adaptado) + SiteFooter
   › Suspense › ContactModal (lazy, solo importado)
   ```
   Corregir las tildes (N-01). Quitar `motion/react`, los estilos en línea, el violeta y los manejadores de hover. Las etiquetas y los destinos deben coincidir con el landing (N-06). Reformular las afirmaciones de N-23 con el texto acordado en «Decisiones del usuario».
2. `src/pages/landing/sections/SiteHeader.tsx`: prop opcional `anchorBase` (D-1). Su valor por defecto es `""`, así que el landing no cambia.
3. `src/pages/landing/sections/SiteFooter.tsx`: la misma prop para sus enlaces de ancla. `FinalCta` debe aceptar título y texto por props si hace falta un CTA propio de `/nosotros`.
4. `src/pages/landing/landing.css`: **solo si hace falta**, añadir reglas nuevas con el prefijo `.lp-about-*` para la cuadrícula del equipo y el avatar de iniciales. No modificar reglas existentes.

**NO tocar (protegidos):**

- `src/pages/landing/components/*`: los usan `PublicLayout` y `LoginGateway`.
- `src/pages/landing/ContactModal.tsx` y `contact-modal.css`: compartidos y con cambios ajenos sin commit.
- `src/core/shell/` (`PublicLayout`), `src/app/` (`LoginGateway`), `index.html`.
- `src/App.tsx`: la ruta `/nosotros` ya existe, no hay que cambiar el enrutado.
- `src/pages/login/`, `ong/`, `server/`, `api/`, `supabase/`.

## Cómo verificar (para `/landing-verificar`)

1. `grep -c "Ã\|Â" src/pages/nosotros/NosotrosPage.tsx` → 0. En el navegador se lee «Quiénes somos», «¿Listo para empezar?», «Perú».
2. Capturas de `/nosotros` en 390, 768 y 1440: `scrollWidth` igual al viewport. Debe tener marco, cabecera en píldora y pie en placa, como `/`.
3. Tab desde el inicio: aparece el enlace para saltar al contenido y el contorno azul de 3px es visible en todos los elementos con foco.
4. A 390 px: hay botón de menú, se abre y se cierra con Escape devolviendo el foco, y los enlaces de ancla apuntan a `/#…`.
5. Con `reducedMotion: 'reduce'`: ningún bloque con `opacity 0` ni con transform.
6. Contraste: el kicker y el copyright con al menos 4,5:1 medido en el navegador.
7. **Sin regresión en `/`:** volver a capturar el landing y comparar con `evidence/home-*.json`. Sin cambios en la cabecera, el pie ni las anclas.
8. `git diff --name-only` limitado a los archivos de la allowlist (`guard-changes.mjs verify`).

## Decisiones del usuario

- **N-23 → resuelta el 2026-11-15: «Reformularlas».** Texto que aplicará `/landing-aplicar`, sin cifras ni prueba social:
  - Misión, l.143-147. Antes: «…maximizan el impacto social — de 5 a 50,000 personas sin cambiar de plataforma.» Después: «Potenciar organizaciones sin fines de lucro con herramientas digitales que simplifican la gestión, amplían el alcance y acompañan a tu equipo a medida que crece.»
  - CTA, l.341-342. Antes: «Únete a las organizaciones que ya gestionan su impacto con democra.pro». Después: «Crea el espacio de tu organización y empieza a coordinar a tu equipo con democra.pro.»

## Decisiones pendientes del usuario

- **Equipo:** confirmar que «Eduardo Bastian · Fundador & CEO», «Equipo de Producto» y «Asesores» son el contenido definitivo. Se conserva tal cual.

---

## Resultado de `/landing-aplicar /nosotros` (2026-11-15)

### Archivos modificados en esta ejecución

| Archivo | Cambio |
|---|---|
| `src/pages/nosotros/NosotrosPage.tsx` | Reescrito sobre el esqueleto `.lp`: skip link, marco, `SiteHeader(anchorBase="/")`, hero, misión, valores, equipo, `FinalCta`, `SiteFooter(anchorBase="/")` y `ContactModal` diferido (solo importado). Se eliminaron `motion/react`, los estilos en línea, el violeta y los manejadores de hover. Tildes corregidas |
| `src/pages/landing/sections/SiteHeader.tsx` | Prop opcional `anchorBase` (por defecto `""`). Con valor, la marca enlaza a `anchorBase` |
| `src/pages/landing/sections/SiteFooter.tsx` | `FinalCta`: props opcionales `title` y `lede`. `SiteFooter`: prop `anchorBase`. Los valores por defecto mantienen el landing igual |
| `src/pages/landing/landing.css` | Solo se **añade** un bloque `lp-about-*` + `.lp-cta-lede` + `.lp-feature-copy .lp-kicker`. No se modificó ninguna regla existente |

### Estado por divergencia

| ID | Estado | Evidencia |
|---|---|---|
| N-01 tildes | **Resuelto** | `mojibake: false` en 390/768/1440 (`evidence/nosotros-after-apply.json`); captura `nosotros-after-apply-*.png` |
| N-02 foco | **Resuelto** | Tab → «democra.pro» con `outline: rgba(81,157,252,.6) solid 3px` |
| N-03 menú móvil | **Resuelto** | A 390: hamburguesa; el menú contiene `/#funciones /#como-funciona /#preguntas /#acceso /login /ong/join /ong/signup /ong/create`; Escape devuelve el foco al botón |
| N-04 cabecera | **Resuelto** | Píldora `.lp-nav` en [260,50,920,62] a 1440, igual que `/` |
| N-05 / N-06 botones y etiquetas | **Resuelto** | `.lp-btn`; «Iniciar sesión» / «Comenzar» / «Crear mi organización». «Acceder al sistema» y «Volver al inicio» se sustituyeron por las acciones del landing; la marca enlaza a `/` |
| N-07 / N-13 paleta y degradado | **Resuelto** | Sin `#0055FF` ni `#7000FF`; acento en `.lp-accent-deep` |
| N-08 / N-09 contraste | **Resuelto** (por tokens) | Kicker `--lp-primary` y copyright de `SiteFooter`. Sin medición nueva de contraste en el navegador |
| N-10 / N-14 texto | **Resuelto** | `.lp-hero-lede`, `.lp-sub`, `.lp-about-card p` (`--lp-fg-muted`) |
| N-11 fondo y marco | **Resuelto** | `.lp-frame` visible desde 768; `--lp-grad-hero` (hero + misión) y `--lp-grad-end` |
| N-12 títulos | **Resuelto** | `.lp-display` (h1, 2 líneas a 1440), `.lp-h1` para los títulos de sección, `.lp-h2` en la misión |
| N-15 / N-16 tarjetas y ritmo | **Resuelto** | `.lp-card`, `.lp-container` / `-narrow`, `.lp-section` |
| N-17 movimiento | **Resuelto** | `useReveal`; con `reduce`: `lp-reveal-ready` ausente y 0 elementos ocultos |
| N-18 iconos | **Resuelto** | `Icons.tsx` (`IconLayout`, `IconClock`, `IconArrowUpRight`) en `currentColor` |
| N-19 ilustración | **Resuelto (intencional)** | SVG propio recoloreado a `--lp-primary` dentro de `.lp-canvas` |
| N-20 / N-21 / N-22 pie, estructura, logo | **Resuelto** | `SiteFooter`, `.lp-skip`, `BrandMark` |
| N-23 afirmaciones | **Resuelto** | Texto reformulado según la decisión del usuario |
| N-24 responsive | **Verificado** | `scrollWidth` igual al viewport en 390/768/1440; sin errores de consola |

### Regresión del landing de referencia `/`

`evidence/home-before-apply.json` frente a `home-after-apply.json`: **idénticos** en 390, 768 y 1440 (alto del documento, cabecera, placa del pie y los 16 enlaces de cabecera y pie, que conservan sus anclas `#…`).

### Pruebas

- `tsc --noEmit`: 6 errores, **todos previos y ajenos** (`ong/src/app/pages/Courses.tsx`, `src/industries/ong/registry.tsx`, `src/modules/ong/app/pages/Courses.tsx`). Ninguno en los archivos de esta ejecución.
- `npm run build`: ver más abajo.
- No se ejecutaron `npm test` ni `npm run test:web`.

### Limitación: control de alcance

`guard-changes.mjs snapshot` se ejecutó al empezar. Pero **a las 12:07 otro proceso** (otra sesión o el usuario, trabajando en `/login`) **volvió a tomar la foto de control y modificó `scope.json`**: añadió `/login`, `src/pages/login/` y `src/app/LoginGateway.tsx` a lo permitido y los quitó de lo protegido. Además editó `LoginGateway.tsx`, `LoginPage.tsx` y `login.css`. Por eso el `verify` de esta ejecución no es válido: solo ve los cambios de login. Se sustituyó por `git diff HEAD`, que confirma que esta ejecución solo tocó los 4 archivos de la tabla anterior. Esta ejecución **no tocó** login, `LoginGateway`, `scope.json` ni `AUDIT-login.md`.

**`npm run build`:** volvió a quedarse en `transforming...` y se cortó a los 280 s (`exit 124`, `.playwright-mcp/build-nosotros.log`). Es el mismo bloqueo previo documentado desde el 2026-11-14. **El bundle de producción sigue sin verificar.**
