# CHANGELOG — Etiquetas sin cortar en la demo del landing

**Fecha y hora:** 2026-11-16 07:06 (America/Lima)
**Autor:** Claude (Claude Code), a pedido del usuario («Pulir composición actual»)
**Estado:** Completado

## Objetivo
Que ningún texto de la composición ilustrativa del landing (ventana de demo bajo el hero y tarjetas de funciones) aparezca cortado con «…» en móvil, tablet o escritorio.

## Contexto del problema
El usuario envió una captura de móvil donde la columna «Etapas» mostraba «Convocatori…», «Planificació…» y «Registro de l…». Se midió con `scrollWidth > clientWidth` sobre todos los textos de `.lp-demo` y `.lp-feature`:

| Ancho | Textos cortados |
|---|---|
| 390 | Convocatoria, Planificación, Registro de horas (hero); Registro de horas (tarjeta) |
| 768 | Registro de horas (hero y tarjeta); estadística «%72%» por 2 px |
| 1440 | Registro de horas (columna y bloque del hero; columna de la tarjeta); bloques de la línea de tiempo compacta recortados a 0–23 px; «Huerto comunitario» a 72 px desbordaba su tarjeta (355 px de contenido en 329 px) |

## Motivo
Se descartó usar capturas reales de `/ong`: su tema claro, la fuente del sistema y sus radios no encajan con el sistema `.lp`, y la arquitectura va a cambiar. Se decidió pulir la composición existente.

## Solución implementada
1. **`TIMELINE_TRACKS`:** «Registro de horas» pasa a «Horas», el mismo nombre que usa el menú de la app.
2. **Columna de etapas en móvil:** 112 px → 128 px (por debajo de 768; desde 768 sigue en 132).
3. **Línea de tiempo compacta (`.is-compact`):** bloques solo con icono a cualquier ancho, igual que la regla existente bajo 1024.
4. **Pantalla de proyecto:** `.lp-screen` declara `container-type: inline-size`, y el título usa `clamp(22px, min(5.2vw, 15cqi), 72px)`. Así queda acotado por el ancho de su contenedor y no solo por el viewport. Donde ya cabía el tamaño no cambia: hero 72 px a 1440, 39.9 px a 768, 22 px a 390.
5. **Estadística de la barra:** `<small>%</small>72%` → `<small>%</small>72`, sin el «%» duplicado.

## Verificación
- 0 textos cortados a 390, 768 y 1440, y sin scroll horizontal.
- `guard-changes.mjs verify`: PASS, los 3 archivos están dentro de la allowlist.
- Captura de evidencia: `.claude/landing-design/evidence/demo-etapas-390-after.jpg`.
- Build de producción y Vitest: ver el resultado en SUMMARY.md.

## Riesgos identificados
- `container-type: inline-size` aplica contención de tamaño en línea a `.lp-screen`. Su ancho ya lo da el contenedor padre (grid o flex), así que no depende del contenido. Se verificó que el ancho no cambia.
- En navegadores sin soporte de unidades `cqi` (anteriores a 2023), la declaración `font-size` se descarta entera y se hereda el tamaño. Riesgo bajo.

## Impacto esperado
Demo más legible en móvil; sin cambios de tamaño ni de layout donde ya funcionaba.

## Módulos afectados
Solo el landing público (`src/pages/landing/`). No toca `/ong`, `/login`, `/nosotros` ni el core.

## Dependencias involucradas
Ninguna nueva.

## Posibles efectos secundarios
La tarjeta de funciones «línea de tiempo» ya no muestra texto dentro de los bloques: antes solo mostraba «…» o fragmentos. La etiqueta completa sigue en la columna de etapas.

## Pendiente conocido (no incluido)
En móvil, la píldora «Hoy» se superpone al rótulo «S09» de la regla. Es anterior a este cambio.

## Reversión
`git revert <hash de este commit>`
