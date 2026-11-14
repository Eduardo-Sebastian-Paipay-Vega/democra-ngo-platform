# Auditoría visual de referencia: Viewport

- **Referencia:** <https://viewport.theresonance.studio/?ref=onepagelove> (landing de un grabador de pantalla para macOS, diseñado por The Resonance).
- **Proyecto:** Democra, landing pública `/` (`src/pages/landing/`).
- **Fecha de inspección:** 14/11/2026.
- **Alcance:** solo frontend. Se reproduce composición, geometría, tipografía, color y comportamiento; textos, marca, logos e imágenes son propios de Democra.
- **Herramientas usadas realmente:** Playwright MCP (navegación, `getComputedStyle`, clics en FAQ y menú móvil, capturas), un script de Playwright del proyecto con Chrome del sistema para capturas por tramos en 1440/1024/768/390, y Pillow para recortes y comparación. Chrome DevTools MCP quedó conectado pero no hizo falta: los estilos calculados se leyeron por Playwright.

## 1. Inventario de secciones (1440 px)

| # | Sección | `y` / alto | Composición | Ancho de contenido | Adaptación Democra |
|---|---|---|---|---|---|
| 0 | Marco de página | fijo, inset 22 px | Borde azul redondeado (40 px) que enmarca todo el viewport; fuera, negro | 1397×857 | Igual, decorativo (`aria-hidden`) |
| 1 | Header | fijo, top 50 | Píldora oscura centrada: logo · 4 enlaces · botón azul | 800 px, 62 px alto | 920 px: logo · 4 enlaces · «Iniciar sesión» · botón «Comenzar» |
| 2 | Hero | 0–640 | Centrado: H1 de 1 línea, lede de 2 líneas, botón grande, nota 14 px | 1130 / lede 860 | Mismo esquema con textos de Democra |
| 3 | Ventana demo (`#how-it-works`) | 642–1408 | Ventana tipo app: semáforos, barra de pestaña, barra de URL, controles a la derecha, lienzo, línea de tiempo con bloques de color | 1130×766 | Interfaz ilustrativa de Democra: proyectos, panel de aprobación, línea de tiempo de actividades |
| 4 | Franja de logos | 1624–1968 | Texto centrado + carrusel horizontal infinito de tarjetas 208×88 | ancho completo | Tipos de organización (texto), sin logos de terceros |
| 5 | Features (`#features`) | 1968–3482 | H2 centrado con palabra final en azul; 2 tarjetas 553 px con título 32 px, texto 18 px y lienzo ilustrado; 1 tarjeta ancha con texto a la izquierda e ilustración a la derecha | 1130 | Tres capacidades reales del módulo ONG |
| 6 | Precios (`#pricing`) | 3482–4560 | H2 + subtítulo centrados; tarjeta contenedora con columna izquierda (título, texto, lista) y tarjeta destacada azul a la derecha con marco grueso; enlace pequeño debajo | 1130 | «Acceso»: módulos incluidos + tarjeta destacada para crear organización. **Sin precio**, no hay tarifa verificada |
| 7 | FAQ (`#faqs`) | 4560–5778 | H2 centrado; lista de acordeón de 12 ítems con separadores y chevron | 960 | 7 preguntas reales sobre Democra |
| 8 | CTA (`#download`) | 5778–6267 | H2 de 2 líneas, botón grande, nota | 800 | Igual |
| 9 | Footer | 6371–6962 | Placa negra radio 16 sobre degradado azul: logo, bloque newsletter, 2 columnas de enlaces, línea legal | 1304 | Placa igual; el newsletter se sustituye por un bloque de contacto que abre el modal existente |

Las secciones 2–4 comparten un fondo degradado de 1968 px (negro → azul intenso → azul oscuro). Las secciones 8–9 comparten el degradado inverso (oscuro → azul claro). Entre ambos, fondo plano `#090d14`.

## 2. Sistema tipográfico

| Rol | Familia en referencia | Tamaño / interlineado | Tracking | Peso |
|---|---|---|---|---|
| Display (H1 hero) | `ritual` | 70 / 70 px | −2.1 px (−0.03em) | 500 |
| H1 de sección | `ritual` | 64 / 64 px | −1.92 px | 500 |
| Título de tarjeta | `ritual` | 32 / 36.8 px | −0.96 px | 500 |
| Pregunta FAQ | `ritual` | 16 px | −0.48 px | 500 |
| Lede hero | stack de sistema | 20 / 32 px | normal | 400 |
| Texto de tarjeta | stack de sistema | 18 / 28.8 px | normal | 400 |
| Nav / cuerpo | stack de sistema | 16 / 24 px | normal | 400 |
| Botón grande / compacto | stack de sistema | 18 / 14 px | normal | 500 |
| Nota bajo botón | stack de sistema | 14 / 20 px | normal | 400 |

- Fuentes cargadas observadas: `ritual` (100–900) y `Geist`; el cuerpo usa el stack `-apple-system…`.
- `ritual` es una fuente comercial: **no se copia**. Democra usa **Inter Tight 500** (ya cargada en `index.html`) con el mismo tracking −0.03em; es la alternativa más cercana disponible (grotesca de proporción estrecha).
- El cuerpo usa el mismo stack de sistema que la referencia.
- Móvil (390): display ≈ 40 px en dos líneas, H1 de sección ≈ 34 px, títulos de tarjeta ≈ 30 px, lede ≈ 15 px (inferidos de capturas).

## 3. Paleta

Valores completos con su estado en `docs/design-tokens.json`. Resumen confirmado: fondo `#090d14`, texto `#eef1ea`, texto secundario `rgba(255,255,255,.77)`, nav `#070a0f` con borde `#1d2738`, primario `#519dfc` / `#6ca7ff` con anillo interior `#a7caff`, acentos `#3a79dc` y `#6ca7ff`, tarjetas `rgba(235,235,235,.05)` con borde `rgba(235,245,235,.1)`, tarjeta destacada `#202f45`, marco `#2888ff` + `#a7caff`.

Inferidos: verde, ámbar y rojo de la interfaz demo; opacidad visible de los separadores del FAQ.

## 4. Escala de espaciado

- Contenedor 1130 px (márgenes de 155 px a 1440). FAQ 960 px.
- Padding vertical de sección: 144 px (≥1024), 112 px (≥768), 80 px (móvil).
- Hero: nav a 50 px; H1 en `y=285`; lede a +24 px; botón a +44 px; nota a +16 px; demo arranca 64 px después.
- Tarjetas: padding 32/24 px con encabezado interno de 48 px a la izquierda; separación entre tarjetas ≈ 24 px (inferida).

## 5. Geometría

- Marco de página: `position:fixed; inset:22px; border-radius:40px` con sombra en capas (ver token `shadow.frame`). En 1024 y 768 el inset se reduce (≈14 y ≈8 px, inferido). En 390 no hay marco.
- Nav: píldora 800×62, radio 16, padding 12/28. Botón compacto 36 px de alto, radio 16.
- Botón grande: 54 px, radio 16, padding 0 24, icono a la izquierda con gap 8.
- Ventana demo: 1130×766, radio 16, padding 10, carcasa con degradado blanco translúcido. Barras de control de 34 px, radio 12, fondo `#0a0c11`.
- Tarjetas features: 553×669 (dos columnas) y 1130×386 (ancha, 2 columnas internas). Lienzo interno 503×403, radio 8.
- Precios: contenedor 1130×562 radio 18; tarjeta destacada 508×496 con borde 4 px (anillo azul doble) y fondo `#202f45`.
- Footer: placa 1304 px, radio 16, padding 40/32, fondo negro, separador antes de la línea legal.

## 6. Comportamiento responsive

| Ancho | Cambios observados |
|---|---|
| 1440 | Todo como arriba |
| 1024 | Nav completo; tarjetas de features siguen a 2 columnas; marco presente |
| 768 | Nav con botón azul + hamburguesa; H1 en una línea a ≈ 40 px; features a 2 columnas estrechas; tarjeta ancha apilada; precios apilados; marco más fino |
| 390 | Sin marco; nav con logo + hamburguesa; H1 en dos líneas; todas las tarjetas en una columna; demo simplificada (sin columna de controles) |

Breakpoints inferidos: 640, 768, 1024 (coinciden con la escala por defecto de Tailwind, que usa la referencia).

## 7. Inventario de recursos

Ver `docs/assets-manifest.md`. Ningún recurso de la referencia se descargó ni se incorporó.

## 8. Interacciones observadas

- **Nav:** enlaces con transición de color 150 ms `cubic-bezier(.4,0,.2,1)`.
- **Menú móvil:** el botón cambia a «Close menu» con `aria-expanded=true`; aparece un panel bajo la píldora con los enlaces separados por líneas y el botón grande a ancho completo.
- **FAQ:** acordeón; el contenido se abre con `accordion-down 420ms cubic-bezier(.16,1,.3,1)`; el chevron tiene transición de 300 ms (se reproduce como rotación de 180°, inferida).
- **Franja de logos:** desplazamiento horizontal continuo (observado: las tarjetas aparecen en posiciones distintas entre capturas).
- **Revelado al desplazar:** ítems con `opacity-0` hasta entrar en viewport (observado en el FAQ).
- **Transición de página:** existe un overlay `page-transition-*` con wordmark; no se reproduce (es de navegación entre páginas, no del landing).

## 9. Limitaciones de inspección

- La captura de página completa no es fiable: el marco es `fixed` y el contenido se revela al desplazar. Se usaron capturas por tramos de viewport.
- La sombra del marco se leyó truncada; la última capa (máscara negra) se infirió.
- Las imágenes de la demo (flor, mariposa, pantallas) son contenido propietario; solo se registraron posición y dimensiones.
- Los valores móviles de tipografía se estimaron midiendo capturas.

## 10. Decisiones de adaptación

1. **Botones conservados del landing anterior:** Iniciar sesión (`/login`), Comenzar / Crear organización (`/ong/create`), Canjear código ACE (`/ong/join`), Ser voluntario (`/ong/signup`) y Contacto / Solicitar demo (modal `ContactModal` existente).
2. **Precios → Acceso.** No hay una tarifa verificada de Democra; la tarjeta destacada conserva la geometría pero muestra el alta de organización en lugar de un precio. El enlace «gift code» de la referencia se adapta a «¿Tienes un código ACE?».
3. **Logos de clientes → tipos de organización.** No se muestran logos de terceros ni clientes no confirmados.
4. **Newsletter → contacto.** No se crea un formulario que envíe datos; el bloque abre el modal de contacto ya existente.
5. **Ventana demo:** se construye con HTML/CSS propios. Muestra una interfaz ilustrativa de Democra (marcada como tal con `aria-label`), sin datos de personas reales.
6. **Tipografía:** Inter Tight en lugar de `ritual`.
7. **Iconos:** SVG propios en línea (sin icono de Apple ni de la marca de referencia).
