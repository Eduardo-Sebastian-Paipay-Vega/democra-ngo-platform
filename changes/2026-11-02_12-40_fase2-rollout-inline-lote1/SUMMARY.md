# SUMMARY — Fase 2 UI (rollout inline, lote 1)

## Qué se hizo
Migración masiva de estilos inline `style={{ … var(--t-*) }}` a utilidades Tailwind
de valor arbitrario en 24 páginas de `ong/src/app/pages/`, extendiendo el patrón del
piloto (`Areas.tsx`). **584** atributos migrados; **308** dejados inline a propósito.

## Por qué se hizo
Reducir estilos inline (máxima precedencia, difíciles de mantener/auditar) a clases,
sin cambio visual. `--t-*` es conmutable por tema, así que se preserva la variable
dentro de la utilidad (`text-[var(--t-text)]`, etc.), NO se migra a tokens fijos.

## Cómo se hizo (seguro y a escala)
Transform conservador y revisable (en scratchpad, fuera del repo) que solo migra
cuando: es `style={{…}}` sin llaves anidadas, en tag HTML minúscula, con todas las
props mapeables a `var(--t-*)` puro, con `className="…"` estático en la misma línea,
y sin conflicto de cascada (detector de color/fondo/borde/sombra, incl. clases
semánticas shadcn). Todo lo demás se deja inline y se reporta.

## Qué beneficio aporta
- 584 estilos inline menos, en 24 páginas, de una sola pasada verificada.
- Patrón y herramienta reutilizables para los siguientes lotes.

## Qué funcionalidades quedaron afectadas
Ninguna. Mismo render, mismos colores, mismo cambio de tema.

## Verificación
- `npm run build`: OK (exit 0). Tokens migrados presentes en el CSS emitido.
- `npm run test:web`: 535/535, 0 fallos.
- Revisión manual del diff en páginas representativas.

## Pendiente
- 308 SKIP (mayormente tags multilínea / componentes / objetos const).
- Árbol gemelo `src/modules/ong/app/pages/`.
- Limpieza hex → tokens bento; definir/quitar `--t-shadow`.
