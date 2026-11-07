# CHANGELOG — Fases F1 y F2 del plan de saneamiento

- **Fecha y hora:** 2026-11-07 03:10 UTC
- **Autor:** Claude (Claude Code)
- **Referencia:** `docs/PLAN_SANEAMIENTO.md` (F1 — puerta de calidad confiable; F2 — secretos)
- **Estado:** Completado en el árbol de trabajo · **sin commit ni push** (pendiente de autorización)

## Objetivo
Que `tsc`, Jest y Vitest den resultados fiables sin `.env`, que el CI los compruebe en cada
PR y que ningún secreto tenga un valor por defecto conocido en producción.

## Contexto del problema (línea base medida en `3cd08f3`)
- `tsc`: 6 errores. Jest: 5/33 suites fallidas (1 test fallido). Vitest sin `.env`:
  70/101 archivos fallidos; con env ficticio, 122 intentos de red reales (`ENOTFOUND`).
- Sin CI.
- `POST /api/auth/step-up/verify-otp` respondía 500 después de crear la sesión cuando
  `EmailService.sendAlert` lanzaba de forma síncrona (p. ej. sin `RESEND_API_KEY`).
- `MFA_OTP_PEPPER` caía a `"dev-local-pepper"`; `crypto-aes.js` usaba ese pepper o un
  literal como clave; `EXPOSE_DEBUG_OTP` sin guarda en producción.

## Solución implementada
### F1
1. **Bug de producción `verify-otp`** (`server/routes/auth.js`): la alerta de nuevo login se
   envuelve en `Promise.resolve().then(...)` para que un throw síncrono se convierta en
   rechazo y lo capture el `.catch` existente. Contrato de respuesta sin cambios.
2. **Regresión de seguridad restaurada** (`server/security/tenant-guards.js`): se reincorpora
   `assertTenantScope` → 409 `TEN-003`, que existía en `server/middleware/financial-state.js`
   antes del refactor `76d6e62` y se perdió al generalizarlo. Aplica a `iam.js` y `sedes.js`.
3. **Rutas de import corregidas**: `whatsapp.js` y `otp-mailer.test.js` (`../../config.js`);
   `financial-state.test.js` (`../../../…`); `payments.test.js` movido de `server/services/`
   (carpeta que solo contenía ese test) a `server/core/services/`, junto a su código.
4. **`financial-state.test.js` adaptado a la API vigente**: compone
   `registerTenantWriteGuard(financialWriteGuard)` + `requireTenantWriteAccess()`, que es
   exactamente lo que hace `initOngDomain()`. Las 14 aserciones originales no cambian.
5. **Suites herméticas**: credenciales ficticias (`*.supabase.invalid`, RFC 2606) en
   `jest.setup.js` y en `test.env` de `vitest.config.ts`; bloqueo de `fetch` y
   `XMLHttpRequest` no mockeados en `vitest.setup.ts` con error que nombra la URL.
6. **`tsc` en 0**: `"areas"` añadido a `TENANT_ROUTE_IDS`; `legacyPath: "/admin/areas"` en
   `src/industries/ong/registry.tsx` (mismo valor que `ong/src/app/tenant/navigation.tsx:418`;
   `src/core/tenant/navigation.ts:166` lo usa para redirecciones); `string | null` en
   `ong/src/app/pages/Courses.tsx`; export CSV del gemelo `src/modules/ong/.../Courses.tsx`
   alineado con los campos de su propio `InscripcionRow`.
7. **CI**: `.github/workflows/ci.yml` + `.nvmrc` (Node 22).

### F2
1. `assertProductionSecrets()` en `server/config.js`, invocado por `assertServerConfig()` solo
   con `NODE_ENV=production`: exige `MFA_OTP_PEPPER` ≥ 32 caracteres y no `CHANGE_ME*`, y
   prohíbe `EXPOSE_DEBUG_OTP=true`.
2. `crypto-aes.js` usa `DATA_ENCRYPTION_KEY` (nueva) y lanza si no hay clave; se eliminó el
   respaldo al pepper y al literal. Sin consumidores en producción → no requiere migración.
3. `.env.example` y `SETUP.md` documentan las variables.

## Riesgos identificados
- **Despliegue**: Vercel ejecuta con `NODE_ENV=production`. Si `MFA_OTP_PEPPER` (≥ 32
  caracteres) no está cargado en Production **y** Preview, la API no arranca. Cargarlo antes
  del merge.
- Cambiar el pepper invalida solo los OTP pendientes (TTL 10 min); no hay datos persistentes
  derivados de él (`hashOtp` es su único consumidor activo).
- `TEN-003`: un perfil con `tenant_id` no-UUID ahora recibe 409 en escrituras de `iam`/`sedes`
  (comportamiento previo a `76d6e62`).

## Impacto esperado
Puerta de calidad confiable y reproducible en CI; login 2FA robusto ante fallos del correo;
sin secretos por defecto en producción.

## Módulos afectados
`server/routes/auth`, `server/security/tenant-guards`, `server/config`, `server/utils/crypto-aes`,
configuración de tests (Jest/Vitest), `src/core/tenant`, `src/industries/ong`, páginas
`Courses` de ambas copias del módulo ONG, CI.

## Dependencias involucradas
Ninguna añadida, eliminada ni actualizada (`package.json` y `package-lock.json` sin cambios).

## Posibles efectos secundarios
- Un test de frontend que hoy dependa de red real fallará con `NetworkBlockedError` (en la
  suite actual: ninguno; 535/535 en verde y 0 intentos de red).
- Las descripciones `describe(...)` de varios tests de `server/` aún citan rutas antiguas
  (`server/services/...`); son solo texto, sin efecto.

## Verificación ejecutada (sin ninguna variable de entorno)
| Comando | Antes | Después |
|---|---|---|
| `git diff --check` | — | OK |
| `npm run typecheck` | 6 errores | 0 (exit 0) |
| `npm run typecheck:server` | — | exit 0 |
| `npm test` | 5/33 suites fallidas | 34/34 suites · 415/415 tests |
| `npm run test:web` | 70/101 fallidos | 101/101 · 535/535 · 0 `ENOTFOUND` |
| `npm run build` | OK | OK (16 s) |
| Arranque prod sin pepper / con pepper / con `EXPOSE_DEBUG_OTP=true` / dev | — | falla / OK / falla / OK |
| Tests de regresión sin la corrección | — | `auth.test.js` 1 falla; `financial-state.test.js` 1 falla (discriminan) |

El workflow de CI se validó como YAML; **no se ha ejecutado en GitHub** (requiere push).

## Reversión
Revertir el commit cuando exista, o `git checkout -- <archivos>` y eliminar los nuevos
(`.github/`, `.nvmrc`, `server/config.test.js`, `server/core/services/payments.test.js`),
restaurando `server/services/payments.test.js` desde `HEAD`.
