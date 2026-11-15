# Comparación visual: referencia Viewport vs landing Democra

- **Fecha:** 14/11/2026
- **Referencia:** <https://viewport.theresonance.studio/?ref=onepagelove>
- **Implementación:** `src/pages/landing/` (ruta `/`)

## Método

1. **Referencia:** capturas por tramos de viewport (no página completa, porque el marco es `fixed` y hay revelado al desplazar) con Playwright + Chrome del sistema, en 1440×900, 1024×768, 768×1024 y 390×844, escala 1x, tras 1,5 s de carga y 0,9 s por tramo.
2. **Implementación:** el servidor de Vite y `vite build` se bloquean en este entorno (ver «Limitaciones»). Para verificar igualmente el código real, el landing se empaquetó con **esbuild** desde los mismos archivos fuente (`LandingPage.tsx` + `sections/*` + `landing.css`) dentro de un `MemoryRouter`. Playwright lo sirvió interceptando peticiones (`http://lp.test/`), con Inter Tight cargada desde Google Fonts y `public/brand` como estáticos. Se usaron los mismos tamaños, tiempos y tramos que en la referencia.
3. **Medición geométrica:** `getBoundingClientRect` de los elementos clave en ambos lados.
4. **Métrica de píxeles:** diferencia media absoluta de luminancia por tramo y porcentaje de píxeles con diferencia > 40. Sirve solo como indicador de desalineación. **No mide calidad**: el contenido (textos, ilustraciones, marca) es distinto a propósito, así que nunca llegará a cero.

Scripts y capturas en `.playwright-mcp/` (excluido de git; uso local).

## Geometría en 1440 px (y = posición vertical en px)

| Elemento | Referencia | Democra (final) | Δ |
|---|---|---|---|
| Nav (píldora) | top 50, 800×62 | top 50, 920×62 | ancho +120 (adaptado: más acciones) |
| H1 hero | y 285, h 70 | y 285, h 70 | 0 |
| Lede | y 379, 860 px | y 379, 860 px | 0 |
| Botón principal | y 488, h 54 | y 487, h 54 | −1 |
| Nota bajo botón | y 558 | y 557 | −1 |
| Ventana demo | y 642, 1130×766 | y 641, 1130×768 | −1 / +2 |
| Lienzo demo | 908×452 | 908×452 | 0 |
| Línea de tiempo demo | h ≈ 200 | h 200 | 0 |
| Franja de organizaciones | y 1624, h 344 | y 1625, h 344 | +1 |
| Sección features | y 1968 | y 1969 | +1 |
| H2 features → 1.ª tarjeta | +134 | +134 | 0 |
| Tarjeta feature (2 col) | 553×669 | 553×640 | −29 (texto de 3 líneas frente a 4) |
| Tarjeta ancha | 1130×386 | 1130×390 | +4 |
| Tarjeta destacada (acceso) | x 744, 508×496 | x 744, 508×525 | +29 (enlaces extra) |
| Ítem FAQ | 960×57 | 960×57 | 0 |
| CTA: H2 desde inicio de sección | +226 | +226 | 0 |
| Placa del footer | x 68, 1304 de ancho, +104 tras CTA | x 68, 1304, +104 | 0 |
| Alto total | 6967 | 6675 | −292 (7 preguntas en lugar de 12) |

## Pasadas de corrección

**Pasada 1 (hallazgos):**
- El lede, la nota y todos los párrafos con `margin-top` estaban pegados a su elemento anterior: el reset `.lp p { margin: 0 }` tenía más especificidad que las clases de componente. **Corregido** pasando los resets a `:where(.lp)`.
- La línea de tiempo de la demo medía 222 px por el texto «En curso» partido en dos líneas. **Corregido:** altura fija de 200 px y valores en una línea con elipsis.
- En 390 px la pantalla del lienzo se desbordaba a la derecha (ancho mínimo de contenido del ítem de grid). **Corregido** con `min-width: 0`.
- En 390 px la regla de 16 semanas quedaba saturada. **Corregido:** por debajo de 1024 px se ocultan las etiquetas pares.

**Pasada 2 (hallazgos):**
- En 768 px la referencia ya muestra la columna lateral, los indicadores y el panel de detalle; la implementación los ocultaba hasta 1024. **Corregido.**
- En 390 px el panel de aprobación de la tarjeta ancha se salía y su estado se partía. **Corregido:** centrado, ancho 72 % y estado sin salto.
- Faltaba el espacio de 216 px entre la demo y la franja (aparecía 95 px antes). **Corregido:** `padding-bottom` de 216 / 120 / 24 px según el ancho.

**Verificación final:** la geometría de la tabla anterior. Sin errores de consola en ningún ancho. `scrollWidth − innerWidth = 0` (sin scroll horizontal) en 1440, 1024, 768 y 390.

## Métrica de píxeles (pasada 2, % píxeles con Δ > 40)

| Ancho | Rango por tramo | Comentario |
|---|---|---|
| 1440 | 4,4 – 13,3 % | Los tramos con más diferencia son los de la demo y las ilustraciones (contenido distinto a propósito) |
| 1024 | 9,0 – 20,3 % | El texto propio cambia los saltos de línea de las tarjetas |
| 768 | 13,1 – 26,0 % | El tramo 0 difiere por la ilustración del lienzo (imagen raster frente a interfaz CSS) |
| 390 | 12,6 – 23,5 % | Ídem; la estructura apilada coincide |

## Interacciones verificadas (Playwright)

- Menú móvil: se abre, lista 9 acciones, se cierra con Escape y devuelve el foco al botón.
- FAQ: abre y cierra; `aria-expanded` y la región asociada se actualizan.
- «Contacto» abre el `ContactModal` existente.
- Orden de tabulación: saltar al contenido → marca → enlaces del nav → Contacto → Iniciar sesión → Comenzar → CTA del hero. El foco es visible (`outline: solid`).
- Destinos de enlaces: `/login`, `/ong/create`, `/ong/join`, `/ong/signup` y anclas internas (`#funciones`, `#como-funciona`, `#acceso`, `#preguntas`).

## Diferencias pendientes respecto a la referencia

1. **Tipografía:** Inter Tight sustituye a `ritual` (fuente comercial). Mismo tamaño, peso y tracking, pero distinto dibujo de letra.
2. **Ilustraciones:** la referencia usa imágenes raster (flor, mariposa). Democra usa interfaces CSS propias, con otro peso visual en los lienzos.
3. **Alto de página:** 292 px menos, por tener 7 preguntas frente a 12 y textos distintos.
4. **Nav:** 920 px frente a 800, porque incluye Contacto e Iniciar sesión.
5. **Transición de página** (overlay con wordmark de la referencia): no reproducida, es de navegación entre páginas.
6. **Hover de botones:** la referencia declara transición de 150 ms pero no se pudo leer su color final. Se usa `#6ca7ff` (valor inferido).

## Limitaciones

- `npm run dev` y `vite build` se quedan bloqueados en este entorno: el optimizador de dependencias no termina (`node_modules/.vite/deps_temp_*`) y la compilación se detiene en `transforming...` con el hilo principal bloqueado y CPU casi nula. El intento anterior (Swash Motion, 10:11) documentó el mismo síntoma, así que no depende de este cambio. La verificación visual se hizo con el paquete esbuild descrito arriba. **No hay verificación del bundle de producción de Vite.**
