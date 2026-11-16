# SUMMARY — Fase 3 (lote 1): colores fijos → tokens de tema

## Qué se hizo
- Horas, Evidencias, Catálogos y Roles dejan de usar la paleta oscura fija y pasan a usar los tokens del tema: 431 reemplazos hechos con un codemod reproducible, más ajustes manuales.
- Se corrigió la causa de que todos los inputs, selects y labels de `/ong` ignoraran sus clases: `core-ui.css` los definía sin capa CSS y ganaba siempre a Tailwind. Ahora están en `@layer base`.
- Se quitaron 4 `// @ts-ignore` que se mostraban como texto en pantalla.
- Los filtros de Horas y Evidencias vuelven a estar en una fila.

## Por qué
La auditoría (C-1) marcó estas 4 páginas como las peores: 0 tokens, ilegibles en modo claro. Al verificarlas apareció el bug de capas CSS, que afectaba a los formularios de todo `/ong`.

## Beneficio
- Las 4 páginas son legibles en claro y en oscuro.
- Los formularios de toda la app respetan su diseño (ancho, fondo, padding, iconos).
- Queda una herramienta (`scripts/codemods/colors-to-theme-tokens.mjs`) para convertir el resto de páginas.

## Funcionalidades afectadas
- Control de horas, repositorio de evidencias, catálogos, roles y permisos, asistencia (texto espurio).
- Estilo por defecto de formularios en ONG, EDUC y en las páginas core de Perfil y Ajustes.

## Verificación
| Comprobación | Resultado |
|---|---|
| Capturas claro/oscuro de las 4 páginas (org demo, 1440×900) | Legibles, filtros en fila, sin texto espurio, 0 errores de consola |
| Ajustes core tras el cambio de capa | Sin cambios visuales |
| `npm run test:web` | **101/101 archivos, 535/535 tests OK**. En la corrida completa, 5 archivos no arrancaron por timeout de workers (máquina cargada con el build); se re-ejecutaron aparte y pasaron (5/5, 23 tests). |
| Build de producción | **OK** (exit 0) |
| `npm test` (backend) | No aplica: el cambio no toca `server/`. Las 4 suites con imports rotos preexistentes siguen igual. |
