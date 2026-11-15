# Manifiesto de recursos — landing Democra (referencia Viewport)

Ningún recurso de la referencia se descargó, se enlazó ni se incorporó al proyecto. Las capturas de la referencia se guardaron solo en `.playwright-mcp/` (excluido de git mediante `.git/info/exclude`) para la comparación visual local.

## Recursos observados en la referencia

| Recurso | Ubicación | Tipo | Dimensiones visibles (1440) | Ajuste | Función | Autorización | Sustitución en Democra |
|---|---|---|---|---|---|---|---|
| Logo «Viewport» (icono de marco + wordmark) | Nav, footer | SVG en línea | 43×26 (icono) | — | Marca | No | Monograma `public/brand/d-core-neon.png` + wordmark de texto «democra.pro» |
| Fuente `ritual` | Titulares | Webfont | — | — | Tipografía de marca | No (comercial) | Inter Tight 500 (Google Fonts, OFL, ya cargada) |
| Fuente `Geist` | Cargada | Webfont | — | — | Secundaria | OFL, pero no necesaria | No se usa |
| Icono de Apple | Botones de descarga | SVG | 18×18 | — | Plataforma | No (marca registrada) | Flecha SVG propia |
| Ilustración de flor / mariposa / «FROM FIRST THOUGHT» | Lienzo de la demo y tarjetas | Imagen raster/vídeo | 725×~500 | cover | Contenido de ejemplo | No | Interfaz CSS propia de Democra |
| Logos «DISTRICT», «thinkfwd», «FWD OBSESSED», «TheResonance», «gP»… | Franja de logos | SVG/imagen | 208×88 por tarjeta | contain | Prueba social | No (marcas de terceros) | Nombres genéricos de tipos de organización en texto |
| Iconos de LinkedIn e Instagram | Footer | SVG | 24×24 | — | Redes | No aplicable | Omitidos: no hay perfiles confirmados de Democra |
| Patrones de puntos y cuadrícula | Lienzo de la demo | CSS | — | — | Decorativo | Técnica genérica | Cuadrícula CSS propia (`repeating-linear-gradient`) |
| Degradados de fondo | Hero, CTA | CSS | 1440×1968 / 1440×1184 | — | Atmósfera | Valores de color, no un recurso | Reproducidos como tokens |

## Recursos usados en la implementación

| Recurso | Ruta | Origen |
|---|---|---|
| Monograma Democra | `public/brand/d-core-neon.png` | Proyecto (existente) |
| Inter Tight | Google Fonts vía `index.html` | Proyecto (existente) |
| Iconos (flecha, chevron, menú, cerrar, check, más) | SVG en línea en `src/pages/landing/sections/Icons.tsx` | Dibujados para este cambio |

No hay recursos pendientes de autorización.
