# CHANGELOG — Fase 2 UI (parte 2, piloto): migrar estilos inline en Areas.tsx

- **Fecha y hora:** 2026-11-02, ~11:15
- **Autor:** Claude (Claude Code)
- **Alcance:** `ong/src/app/pages/Areas.tsx` (una página, piloto). **Cero cambios de
  apariencia.**

## Objetivo del cambio
Piloto de la migración de estilos inline (`style={{…}}`) a utilidades Tailwind,
para fijar un patrón repetible en las 37 páginas restantes. Se eligió Areas.tsx
por estar cubierta por tests y ser representativa.

## Contexto del problema
`Areas.tsx` usaba 15 atributos `style={{ … }}` que referenciaban el sistema de
tokens paralelo `--t-*` (p. ej. `style={{ color: "var(--t-text)" }}`). Son estilos
inline (máxima precedencia, difíciles de mantener y de auditar) en vez de clases.

**Dato clave:** `--t-*` es **conmutable por tema**: está definido dos veces en
`ong/src/styles/index.css` — un set "navy" (`--t-text:#ffffff`, `--t-surface:#1a1f3a`…)
y un set cálido-oscuro (`--t-text:#F9F7F3`, `--t-surface:#171512`…). Por eso **no**
se puede migrar a los tokens fijos del `@theme` bento (romperían el cambio de tema
y alterarían colores). La migración correcta preserva la variable en tiempo de
ejecución.

## Solución implementada
Cada `style={{ prop: "var(--t-X)" }}` se convirtió a la utilidad Tailwind de valor
arbitrario equivalente, que compila a la misma propiedad CSS y conserva la variable
(y por tanto el cambio de tema):

| Inline                                   | Utilidad                         |
|------------------------------------------|----------------------------------|
| `color: var(--t-text)`                   | `text-[var(--t-text)]`           |
| `color: var(--t-text-secondary)`         | `text-[var(--t-text-secondary)]` |
| `color: var(--t-text-dim)`               | `text-[var(--t-text-dim)]`       |
| `color: var(--t-muted)`                  | `text-[var(--t-muted)]`          |
| `background: var(--t-surface)`           | `bg-[var(--t-surface)]`          |
| `background: var(--t-hover)`             | `bg-[var(--t-hover)]`            |
| `borderColor: var(--t-border)`           | `border-[var(--t-border)]`       |
| `boxShadow: var(--t-shadow)`             | `shadow-[var(--t-shadow)]`       |

Se migraron 14 de 15 ocurrencias. La página pasó de **15 → 1** estilos inline.

### Excepción documentada (1 restante)
El `<Badge variant="outline">` (col. ÁREA) conserva su `style={{ color:
"var(--t-text-dim)" }}`. Motivo: la variante `outline` del Badge ya aplica
`text-foreground`; migrar a `text-[var(--t-text-dim)]` crearía dos utilidades de
color en el mismo elemento y el ganador dependería del orden en el CSS generado
(riesgo de regresión). Se deja inline a propósito en vez de recurrir a `!important`.
Patrón para el resto: los elementos "planos" (div/span/h3/p/icono sin variante que
fije el mismo color) migran directo; los que chocan con una variante de componente
se dejan inline o requieren decisión aparte.

### Nota: `--t-shadow` sin definir
`--t-shadow` **no está definido** en ninguno de los sets de `index.css`, así que el
`box-shadow` siempre fue nulo. La migración mantiene el comportamiento
(`shadow-[var(--t-shadow)]` = sin sombra). Follow-up: definir o quitar `--t-shadow`.

## Verificación
- `npm run build` (Vite): **OK (exit 0)**. En el CSS emitido aparecen las 8
  referencias `var(--t-*)` migradas (incluye la nula `--t-shadow`), confirmando que
  las utilidades de valor arbitrario se generan.
- `npm run test:web`: **101 archivos / 535 tests, 0 fallos** (Areas.tsx está cubierta
  por `Areas.test.tsx`; su contenido de texto no cambió).

## Riesgos identificados
- Ninguno visual: misma variable CSS, mismo valor en tiempo de ejecución, mismo
  cambio de tema. Precedencia: los elementos migrados no tienen utilidades de color
  en conflicto (el único caso en conflicto —Badge— se dejó inline).

## Impacto esperado
Patrón validado y repetible para migrar las páginas restantes. Areas.tsx casi libre
de estilos inline.

## Módulos afectados
- `ong/src/app/pages/Areas.tsx`

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Ninguno conocido.

## Estado del cambio
**Completado** (piloto de 1 página; quedan ~37 páginas y el otro árbol
`src/modules/ong/app/pages/` para iteraciones futuras).

## Cómo revertir
`git revert <hash>`, o volver a poner los `style={{…}}` y quitar las clases
`*-[var(--t-*)]` en Areas.tsx.
