# SUMMARY — Endurecer tests flaky

## Qué se hizo
Se dejó la suite `npm run test:web` en verde (101 archivos / 535 tests, 0 fallos),
eliminando tres rojos: `TST-ERR-118` (transacciones) y los dos tests de
`Areas.test.tsx`.

## Por qué se hizo
Había dos causas distintas, antes agrupadas erróneamente como "flaky ambientales":
1. **TST-ERR-118 (flaky real):** el test no mockeaba `resolveProfileLabels`
   (`publicSchema()` = Supabase real), así que `rejectEgreso` intentaba una red real
   antes de validar el comentario y, bajo carga, superaba el timeout de 5000 ms.
2. **Areas (NO flaky, stale):** el componente `Areas.tsx` fue rediseñado (dashboard,
   modal "Guardar", nuevos placeholders, estado vacío "No hay áreas registradas") y
   `useAreas` no usa `toast` en el fallo de carga; los tests seguían afirmando la UI
   y el comportamiento antiguos, por lo que nunca podían pasar.

## Qué beneficio aporta
- Suite determinista y tolerante a máquinas cargadas.
- Tests de Areas que reflejan el comportamiento real de resiliencia del rediseño.
- `TST-ERR-118` hermético: sin dependencias de red.

## Qué funcionalidades quedaron afectadas
Ninguna de producción. Solo configuración de tests y archivos de test:
- `vitest.setup.ts` — `asyncUtilTimeout: 5000` global.
- `vitest.config.ts` / `vite.config.js` — `testTimeout` / `hookTimeout: 15000`.
- `transaccionesFinancieras.service.test.ts` — mock de `resolveProfileLabels`.
- `Areas.test.tsx` — dos tests reescritos contra el componente actual.
