# FILES_CHANGED

## Modificados (5)

- `vitest.setup.ts`
  Import de `configure` de `@testing-library/react` y llamada
  `configure({ asyncUtilTimeout: 5000 })` para subir el timeout por defecto de
  `waitFor` / `findBy*` de 1000 ms → 5000 ms (anti-flaky global).

- `vitest.config.ts`
  Añadidos `testTimeout: 15000` y `hookTimeout: 15000` en el bloque `test`
  (holgura sobre el nuevo `asyncUtilTimeout`). Config usada por el panel de VS Code.

- `vite.config.js`
  Mismos `testTimeout: 15000` / `hookTimeout: 15000` en el bloque `test` embebido,
  para mantener consistencia con `vitest.config.ts`.

- `ong/src/app/services/recursos/transaccionesFinancieras.service.test.ts`
  En el `vi.mock("./shared")` se añadió
  `resolveProfileLabels: vi.fn().mockResolvedValue(new Map())` con comentario
  explicando que ese era el único camino de red real no mockeado que hacía flaky a
  `TST-ERR-118`.

- `ong/src/app/pages/Areas.test.tsx`
  Reescritos los dos tests ("network failure on initial load" y "creating an area
  fails") para alinearse con el componente rediseñado y con `useAreas`:
  - carga fallida → panel "No se pudo cargar las áreas" + mensaje, sin crash
    (en vez de `toast.error`, que el hook no usa en ese caso);
  - crear fallido → estado vacío "No hay áreas registradas", abrir modal
    "Nueva área", placeholders `Ej: FIN-01` / `Ej: Finanzas`, enviar con "Guardar",
    verificar `toast.error("Save failed")` + página viva (en vez del antiguo
    formError inline).

## NO modificados
- Código de producción: ningún archivo bajo `src/` o `ong/src/app/**` que no sea
  un `.test.tsx`. `rejectEgreso`, `Areas.tsx` y `useAreas.ts` ya eran correctos.

## Creados (auditoría)
- `changes/2026-11-02_09-52_endurecer-tests-flaky/CHANGELOG.md`
- `changes/2026-11-02_09-52_endurecer-tests-flaky/SUMMARY.md`
- `changes/2026-11-02_09-52_endurecer-tests-flaky/FILES_CHANGED.md`

## Carpetas afectadas
- raíz (`vitest.setup.ts`, `vitest.config.ts`, `vite.config.js`)
- `ong/src/app/services/recursos/`
- `ong/src/app/pages/`
- `changes/`
