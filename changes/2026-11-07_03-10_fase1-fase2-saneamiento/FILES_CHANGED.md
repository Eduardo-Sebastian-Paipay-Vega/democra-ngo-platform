# FILES_CHANGED — Fases F1 y F2

## Creados
- `.github/workflows/ci.yml` — CI: `npm ci`, typecheck ×2, Jest, Vitest, build.
- `.nvmrc` — Node 22 (usado por el CI).
- `server/config.test.js` — 8 tests de `assertProductionSecrets` / `assertServerConfig`.
- `server/core/services/payments.test.js` — movido desde `server/services/`; import de
  `webhooks-payments.js` y texto del `describe` ajustados.
- `changes/2026-11-07_03-10_fase1-fase2-saneamiento/{CHANGELOG,SUMMARY,FILES_CHANGED}.md`

## Modificados
- `server/routes/auth.js` — alerta de nuevo login aislada con `Promise.resolve().then`.
- `server/routes/auth.test.js` — mock de `emailService` + test de regresión (throw síncrono).
- `server/security/tenant-guards.js` — `assertTenantScope` → 409 `TEN-003` restaurado.
- `server/domains/ong/middleware/financial-state.test.js` — imports corregidos; compone el
  guard con `requireTenantWriteAccess()`.
- `server/core/services/whatsapp.js` — import `../../config.js` (era una ruta inexistente).
- `server/core/services/otp-mailer.test.js` — import `../../config.js`.
- `server/config.js` — `dataEncryptionKey`; `assertProductionSecrets()` exportado e invocado
  en producción.
- `server/utils/crypto-aes.js` — clave desde `DATA_ENCRYPTION_KEY`, sin respaldo.
- `server/utils/crypto-aes.test.js` — tests de clave por defecto y de ausencia de clave.
- `jest.setup.js` — credenciales ficticias fijas.
- `vitest.config.ts` — `test.env` con credenciales ficticias fijas.
- `vitest.setup.ts` — bloqueo de `fetch`/`XMLHttpRequest`.
- `src/core/tenant/registry-types.ts` — `"areas"` en `TENANT_ROUTE_IDS`.
- `src/industries/ong/registry.tsx` — `legacyPath: "/admin/areas"`.
- `ong/src/app/pages/Courses.tsx` — tipo `string | null` en `uploadedImageUrl`.
- `src/modules/ong/app/pages/Courses.tsx` — CSV con `creadoEn`/`certificadoUrl`.
- `.env.example` — `DATA_ENCRYPTION_KEY` y notas de producción.
- `SETUP.md` — filas `MFA_OTP_PEPPER` y `DATA_ENCRYPTION_KEY`; nota de `EXPOSE_DEBUG_OTP`.
- `docs/PLAN_SANEAMIENTO.md` — estado, corrección de H4 y nuevo hallazgo H9.

## Eliminados
- `server/services/payments.test.js` (movido) y la carpeta `server/services/` (quedó vacía).
