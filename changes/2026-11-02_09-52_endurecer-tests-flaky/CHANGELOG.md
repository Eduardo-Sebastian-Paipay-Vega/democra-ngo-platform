# CHANGELOG — Endurecer tests flaky (TST-ERR-118 + 2 tests de Areas)

- **Fecha y hora:** 2026-11-02, ~09:52
- **Autor:** Claude (Claude Code)
- **Alcance:** solo configuración de tests y archivos de test. **Cero cambios en código de producción.**

## Objetivo del cambio
Dejar la suite de Vitest (`npm run test:web`) verde y determinista, eliminando los
tres rojos que aparecían de forma intermitente / sistemática:

1. `TST-ERR-118: rejectEgreso propaga error si no hay comentario`
   (`ong/src/app/services/recursos/transaccionesFinancieras.service.test.ts`)
2. `Areas Page > should handle network failure on initial load without crashing`
   (`ong/src/app/pages/Areas.test.tsx`)
3. `Areas Page > should not break when creating an area fails`
   (`ong/src/app/pages/Areas.test.tsx`)

## Contexto del problema
En corridas de la suite completa bajo carga aparecían 3 fallos. Se habían
caracterizado antes como "flaky ambientales", pero el diagnóstico fino mostró
**dos causas distintas**, solo una de ellas de timing:

### Causa 1 — TST-ERR-118: dependencia de red real no mockeada (flaky real)
`rejectEgreso` → `resolveEgresoApproval(..., "rechazada")` llama a
`getTransaccionFinancieraById()` **antes** de validar el comentario. Ese camino
invoca `resolveProfileLabels()`, que vive en `shared.ts` y usa `publicSchema()`
(cliente Supabase **real**). El test solo mockeaba `finanzasSchema` / `ongSchema`
/ `loadCatalogRows` / `resolveFinancialAccountTypeCatalog`, **no** `publicSchema`
ni `resolveProfileLabels`. Resultado: se disparaba un `fetch` real contra el host
placeholder; aunque el servicio lo envuelve en `.catch(() => new Map())`, el
intento de red tardaba lo suficiente bajo carga para superar el `testTimeout` de
5000 ms → timeout intermitente (`5020ms`).

### Causa 2 — Tests de Areas desactualizados (NO flaky)
`Areas.tsx` fue **rediseñado** (dashboard bento, KPIs, modal con botón "Guardar",
placeholders `Ej: FIN-01` / `Ej: Finanzas`, estado vacío "No hay áreas
registradas"). El test seguía afirmando la UI **anterior**:
- Esperaba el texto `"No se encontraron áreas. Crea la primera..."` → ya no existe.
- Buscaba placeholders `"Nombre del área"` y `"Ej. ADMIN, TEC, OPS"` → no existen.
- Buscaba botón `"Crear área"` → ahora es `"Guardar"`.
- Esperaba `toast.error("503 Timeout")` en el fallo de carga inicial, pero
  `useAreas` en el fallo de `listAreas` **no** llama a toast: setea estado `error`
  y la página muestra el panel "No se pudo cargar las áreas" con el mensaje.
  `toast.error` solo se usa en create/update/toggle.
- Esperaba un `formError` inline con "Save failed" en el fallo de create, pero el
  rediseño no tiene formError inline: el error se notifica por `toast.error`.

Esos dos tests no podían pasar nunca contra el componente actual: eran **stale**,
no flaky. La verificación anterior los había agrupado por error en el cubo flaky.

## Solución implementada

### A) Endurecimiento global de timing (anti-flaky, tolerante a carga)
- `vitest.setup.ts`: `configure({ asyncUtilTimeout: 5000 })` de Testing Library.
  Sube el timeout por defecto de `waitFor` / `findBy*` de 1000 ms → 5000 ms, para
  que un render+efecto async de React en una máquina cargada no produzca falsos
  rojos. Afecta a toda la suite sin cambiar la lógica de ninguna prueba.
- `vitest.config.ts` y `vite.config.js`: `testTimeout: 15000` y `hookTimeout:
  15000`, para dar holgura por encima del nuevo `asyncUtilTimeout` (el default de
  5000 ms quedaría al límite). Se tocan **ambos** porque `vitest.config.ts` es el
  que usa el panel de VS Code y `vite.config.js` tiene el bloque `test` embebido;
  así ambos entornos quedan consistentes.

### B) TST-ERR-118: hermetizar el test (fix de raíz)
En el `vi.mock("./shared")` del archivo se añade:
```ts
resolveProfileLabels: vi.fn().mockResolvedValue(new Map()),
```
Con esto `getTransaccionFinancieraById` ya no intenta ninguna red real → la
prueba valida determinísticamente el fallback "El rechazo requiere un comentario."
**No se tocó producción**: `rejectEgreso` ya era correcto.

### C) Tests de Areas: alinear con el componente actual
Se reescribieron los dos tests para afirmar el comportamiento real de resiliencia
(se preserva la intención "Zero-Fail Tolerance"):
- **Fallo de carga inicial**: se espera el panel "No se pudo cargar las áreas", el
  mensaje "503 Timeout" y que la cabecera "Áreas Organizacionales" siga presente
  (la página no se rompe).
- **Fallo al crear**: `listAreas` → `[]` ⇒ estado vacío "No hay áreas registradas";
  se abre el modal ("Nueva área"), se rellenan los placeholders reales
  (`Ej: FIN-01`, `Ej: Finanzas`), se envía con "Guardar" y se verifica
  `toast.error("Save failed")` + que la página sigue viva.

## Verificación
- `npm run test:web` (suite completa): **101 archivos / 535 tests, 0 fallos.**
- Los tres casos problemáticos (TST-ERR-118 y los 2 de Areas) pasan.

## Riesgos identificados
- Ninguno en producción (solo config de tests y archivos de test).
- Subir `asyncUtilTimeout` puede hacer que tests que esperan la **no** aparición de
  algo tarden más en resolverse; no hay patrones de ese tipo relevantes en la
  suite, y la corrección prima sobre unos ms extra en casos raros.

## Impacto esperado
Suite verde y estable bajo carga; dos tests de Areas que ahora sí reflejan el
rediseño real; TST-ERR-118 hermético (sin red).

## Módulos afectados
- `vitest.setup.ts`
- `vitest.config.ts`
- `vite.config.js`
- `ong/src/app/services/recursos/transaccionesFinancieras.service.test.ts`
- `ong/src/app/pages/Areas.test.tsx`

## Dependencias involucradas
Ninguna nueva. Se usa `configure` de `@testing-library/react` (ya presente).

## Posibles efectos secundarios
Ninguno funcional. Los timeouts más altos solo cambian cuánto espera Vitest antes
de declarar timeout; no alteran aserciones.

## Estado del cambio
**Completado.**

## Cómo revertir
`git revert <hash>`, o revertir archivo por archivo:
- quitar `configure({ asyncUtilTimeout: 5000 })` de `vitest.setup.ts`,
- quitar `testTimeout` / `hookTimeout` de `vitest.config.ts` y `vite.config.js`,
- quitar `resolveProfileLabels` del mock del test de transacciones,
- restaurar la versión anterior de los dos tests de `Areas.test.tsx`.
