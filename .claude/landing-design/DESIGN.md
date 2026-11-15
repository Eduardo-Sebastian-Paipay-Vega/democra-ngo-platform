# DESIGN — contrato visual del landing público de Democra

- **Referencia:** ruta `/`, implementada en `src/pages/landing/` (commit `7e7ae0d`).
- **Estado del árbol capturado:** las capturas y lecturas reflejan el árbol de trabajo, no solo el commit. Hay cambios sin commit, **ajenos a esta ejecución**, en `landing.css`, `sections/Faq.tsx`, `ContactModal.tsx` y `contact-modal.css`, documentados en `changes/2026-11-15_09-43_fix-faq-answer-display/` y `changes/2026-11-15_10-14_mejora-contacto-landing/`.
- **Generado:** 2026-11-15 por `/landing-recopilar`. Solo lectura: no se editó ningún archivo de interfaz.
- **Detalle:** valores en `TOKENS.json`, anatomía en `COMPONENTS.md`, rutas y riesgos en `PAGE-INVENTORY.md`.

## Evidencias

| Archivo | Contenido | Viewport |
|---|---|---|
| `evidence/home-desktop.{png,json}` | Captura de página completa + computed styles de ~1000 elementos | 1440×900 |
| `evidence/home-tablet.{png,json}` | ídem | 768×1024 |
| `evidence/home-mobile.{png,json}` | ídem | 390×844 |
| `evidence/-nosotros-*.{png,json}` | `/nosotros` (sistema distinto) | los 3 anteriores |
| `evidence/states-home.json` | Tokens `--lp-*` resueltos sobre `.lp`; hover/focus de botones y enlaces; header al hacer scroll; marco; revelado; FAQ; menú móvil; reduced motion | 1440 y 390 |
| `evidence/state-hover-hero-cta-1440.png`, `evidence/state-mobile-menu-open-390.png` | Estados interactivos | 1440, 390 |
| `evidence/manifest.json` | 6/6 capturas OK | — |

**Método.** Se usó `capture-landing.mjs` de la skill, contra `http://localhost:5173`, con `reducedMotion: 'reduce'`. Hubo que ejecutar una copia local con `channel: 'chrome'` porque el Chromium descargado por Playwright no está instalado (`chromium_headless_shell-1228` ausente). La lógica de captura es idéntica. Los estados se midieron con un script propio de solo lectura, con movimiento normal salvo en la prueba de reduced motion.

**Limitación de las capturas de página completa.** Se tomaron con reduced motion, así que el revelado ya está resuelto. El marco fijo (`.lp-frame`) aparece una sola vez, en la parte superior del lienzo extendido. Esto es un artefacto de la captura, no del diseño.

## Identidad

1. **Oscuro con un único acento azul.** El fondo es `#090d14`, el texto `#eef1ea` (blanco cálido, no puro) y el texto secundario es blanco al 77 %. Todo acento es azul: `#519dfc` es el primario, `#6ca7ff` sirve para el botón del nav y el hover, `#a7caff` para anillos y `#3a79dc` para palabras destacadas. El verde y el ámbar solo aparecen dentro de ilustraciones.
2. **Dos degradados de zona enmarcan la página.** `--lp-grad-hero`, de negro a azul brillante y de vuelta a `#090d14`, va detrás del hero, la demo y la franja. `--lp-grad-end`, de `#090d14` a `#4ca3ff`, va detrás del CTA final y el footer. Entre ambos, las secciones de contenido usan el fondo plano.
3. **Marco de página.** Desde 768 hay un borde fijo de doble anillo (`#a7caff` dentro, `#2888ff` fuera, 4px cada uno) con radio 40, un brillo interior y una máscara negra exterior. Su inset es 8, 14 o 22px según el ancho (768, 1024, 1280). Por debajo de 768 no hay marco.
4. **Tipografía.** Los títulos usan Inter Tight 500 con tracking −0.03em, `line-height` 1 en los grandes y `text-wrap: balance`. El cuerpo usa la fuente del sistema a 16/1.5. Escala: 70 / 64 / 32 px y un caso especial de 72 en el bloque de acceso.
5. **Superficies discretas.** Las tarjetas tienen un relleno blanco al 5 % y un borde blanco al 10 %, con radio 18. Los controles (botones y nav) usan radio 16 y los paneles internos 8. No hay sombras en las tarjetas de contenido; la elevación aparece solo en el panel de aprobación y en marcos de ilustración.
6. **Botón.** Es una sola forma: fondo azul, texto oscuro (`#090d14`) y anillo interior de 1px más claro. Tiene dos tamaños: 54px para el hero, el CTA y el acceso, y 36px para el nav. En hover el fondo se aclara un paso (medido); en active baja 1px.
7. **Composición centrada y amplia.** El contenedor mide 1130px, 960px en el FAQ. Las secciones llevan 144px de padding vertical en escritorio, 112 en tablet y 80 en móvil. El hero está centrado. La demo queda a sangre dentro del contenedor y abre la página.
8. **Movimiento sobrio.** Los bloques `[data-reveal]` aparecen con un fundido de opacidad de 0,7 s (curva `cubic-bezier(.16,1,.3,1)`). Hay una marquesina continua de 48 s y transiciones de 150 ms en controles. Con `prefers-reduced-motion` todo se desactiva: verificado, el revelado queda en opacidad 1 y la marquesina en `none`.

## Comportamiento responsive (medido)

| Ancho | Alto del documento | Cambios |
|---|---|---|
| 1440 | 6675 | Nav completo; marco con inset 22; features en 2 columnas y tarjeta ancha dividida; acceso en 2 columnas |
| 768 | — (ver json) | Hamburguesa; marco con inset 8; demo con columna lateral e indicadores; features en 2 columnas; acceso en 1 columna |
| 390 | 6368 | Sin marco; todo apilado; la demo solo muestra lienzo y línea de tiempo; regla de semanas con la mitad de etiquetas |

No hay scroll horizontal en ningún ancho: `scrollWidth` es igual al viewport en las 3 capturas.

## Accesibilidad observada

- Enlace para saltar al contenido. Foco visible en todo `.lp`, con outline de 3px y offset 3.
- Menú móvil con `aria-expanded` y `aria-controls`; Escape lo cierra y devuelve el foco.
- FAQ con `aria-expanded` y región asociada. La marquesina tiene una lista `sr-only` equivalente y la demo es `role="img"` con descripción.
- `lang="es"`.

## Excepciones y variantes (no colapsar)

- `#8bb9ff` (hover de `.lp-btn-sm`) y `rgba(81,157,252,.6)` (foco) son literales, no variables.
- **El foco cambia el radio del botón de 16 a 8px** (medido). Es una posible incoherencia, pendiente para `/landing-auditar`.
- El H2 mide 30px en móvil y 32px desde 640, pero no escala más allá. El título grande del bloque de acceso usa su propia escala (48–72, tracking −0.04).
- Colores literales de ilustración (`#1f9a4a`, `#3466c9`, `#c98111`, `#4c8dff`) y micro-tipografía de 7–11px: pertenecen solo a las ilustraciones de la demo y las tarjetas. No son tokens de interfaz.
- El cuerpo usa la fuente del sistema, así que se ve distinto en Windows (Segoe UI) y en macOS (SF).

## Ambigüedades y huecos

| Tema | Estado |
|---|---|
| `/nosotros` | Es pública pero usa **otro sistema** (Tailwind, `#0055FF`/`#7000FF`, `motion`). **Resuelto 2026-11-15:** el usuario decidió alinearla al sistema `.lp`, y la brecha se detallará en `/landing-auditar`. |
| `ContactModal` | Es compartido y no se capturó con el modal abierto: sus estilos están en nivel **C** en esta ejecución. |
| Hover de enlaces del nav | No hay cambio computed en hover (medido): color y fondo iguales. Es así por diseño o falta definirlo; está pendiente de auditoría. |
| Estado disabled | No existe ningún control deshabilitado en el landing: nivel **C**. |
| Tablet 1024 | No está en los viewports de `scope.json`. Las reglas declaradas para 1024 y 1280 se leyeron del CSS (nivel A para declarado) y no tienen captura propia en esta ejecución. |
| Origen de la paleta | Proviene de una referencia externa (Viewport). La procedencia está en `docs/design-tokens.json`, no aquí. |

## Cobertura

- Rutas públicas: 2 de 2 capturadas (`/` y `/nosotros`) en 3 viewports.
- Tokens: 44 propiedades `--lp-*` declaradas y resueltas en el navegador. Dos están vacías en `.lp` porque se definen en hijos: `--lp-chip-gap` en `.lp-marquee` y `--lp-row` en `.lp-timeline`.
- Estados: hover y focus (botones y enlaces del nav), header con scroll, menú móvil, FAQ, revelado y reduced motion. **Sin medir:** active, modal y disabled.
