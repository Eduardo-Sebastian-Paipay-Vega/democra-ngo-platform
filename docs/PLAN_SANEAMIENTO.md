# Plan de saneamiento técnico — `democra-ngo-platform`

| Campo | Valor |
|---|---|
| Fecha | 2026-11-07 (UTC) |
| Autor | Claude (Claude Code), a pedido de Eduardo Sebastián Paipay Vega |
| Base evaluada | `b983aa7` (rama `claude/clever-noether-saioc5`) |
| Estado | **Propuesto** — nada de este plan está implementado todavía |

Este documento convierte la evaluación técnica del repositorio en un plan ejecutable por
fases. **Cada afirmación fue verificada contra el código o ejecutando la herramienta
correspondiente**; la columna/etiqueta *Verificación* indica cómo. Lo que no se pudo
verificar está marcado explícitamente como **NO VERIFICADO**.

---

## 1. Línea base medida (2026-11-07)

Comandos ejecutados en un clon limpio tras `npm ci`, sin `.env` salvo donde se indica.

| Verificación | Comando | Resultado |
|---|---|---|
| Instalación | `npm ci` / `npm ls --depth=0` | ✅ 1212 paquetes, sin errores de resolución |
| Build | `vite build` | ✅ 20 s · ⚠️ chunks `ong-*.js` 1.38 MB y `vendor-*.js` 1.66 MB (minificados) |
| Arranque API | `import("./server/index.js")` con env ficticio | ✅ arranca |
| Tipos | `tsc --noEmit` | ❌ 6 errores |
| Backend | `jest --runInBand` | ❌ 5/33 suites fallan · 1/369 tests falla |
| Frontend sin env | `vitest run` | ❌ 70/101 archivos fallan (variables `ONG_DB_*` ausentes) |
| Frontend con env ficticio | `vitest run` + `VITE_ONG_DB_SUPABASE_*` | ✅ 101/101 · 535 tests · ⚠️ 122 `getaddrinfo ENOTFOUND` (red real) |
| Seguridad BD | Supabase advisors (`security`) proyecto `qafvnjoqvdtnrdvlnwco` | ✅ 0 lints |
| Migraciones remotas | Supabase `list_migrations` | ⚠️ **NO VERIFICADO** (timeout de conexión, 2 intentos) |
| CI | `.github/` | ❌ no existe |
| Raíz del repo | `ls -A \| wc -l` | 128 entradas |

---

## 2. Hallazgos verificados que condicionan el plan

### H1 — El módulo ONG existe dos veces y `/ong` carga ambas copias ⚠️ crítico

| Hecho | Verificación |
|---|---|
| `ong/src/` (353 archivos) vs `src/modules/ong/` (245 archivos): 223 archivos con contenido distinto, 116 solo en `ong/src` (25 no son tests), 12 solo en `src/modules/ong` | `diff -rq ong/src src/modules/ong` |
| **El router de `/ong` renderiza las páginas de `ong/src`** (`ong/index.html` → `ong/src/main.tsx` → `ong/src/app/routes.tsx`, `lazy(() => import("./pages/..."))`) | lectura de `ong/src/app/routes.tsx:22-53` |
| **El chunk de entrada `ong-*.js` contiene 197 módulos fuente de `src/modules/ong` y 11 de `ong/src`** | sourcemap de `vite build --sourcemap` |
| Causa: `src/core/tenant/industryRegistry.tsx:4` hace `import.meta.glob('../../industries/*/registry.tsx', { eager: true })`; `src/industries/ong/registry.tsx:30+` importa estáticamente las páginas de `src/modules/ong` para el campo `element`. Ese `element` **no se renderiza** en ningún sitio: `ong/src/app/routes.tsx:200,277` solo usa `listTenantRoutes()` como metadatos | `grep` de `.element` / `listTenantRoutes` |
| Hay **dos contextos `TenantBootstrapContext`** en el bundle (uno en `TenantBootstrapProvider-*.js` desde `ong/src`, otro en `ong-*.js` desde `src/modules/ong`). El `<TenantBootstrapProvider>` solo se monta en `ong/src/app/App.tsx:10` | `grep` del mensaje `useTenantBootstrap debe usarse dentro` en `dist/assets` |
| Alias inconsistente: `@ong` → `ong/src` en `vite.config.js` y `vitest.config.ts`; `@ong/*` → `src/modules/ong/*` en `tsconfig.json`. `tsc` comprueba `src/core/**` contra una copia distinta de la que se empaqueta | lectura de los 3 archivos |
| `README.md:405` declara `src/modules/ong` como "versión vigente", contrario a lo que se ejecuta | lectura |
| Cobertura invertida: 98 archivos de test en `ong/src`, 2 en `src/modules/ong` | `find -name "*.test.*"` |

**Consecuencias:** (a) ~197 módulos muertos cargados en la entrada de `/ong` (explica buena
parte de los 1.38 MB); (b) cada cambio de UI se hace dos veces (commit `b983aa7`, "árbol
gemelo"); (c) `tsc` no protege el código que corre.

### H2 — Bug de producción en `POST /api/auth/step-up/verify-otp`

`server/routes/auth.js:278-286` envía la alerta de nuevo login con
`emailService.sendAlert(...).catch(...)`, pero `EmailService.sendAlert`
(`server/core/services/email/email.service.js:155`) **no es `async`**: el render de la
plantilla llama a `getEmailConfig()`, que **lanza de forma síncrona** si falta
`RESEND_API_KEY` (`email.config.js:30`). El `.catch` nunca llega a adjuntarse, la excepción
sube al `try` del handler y responde **500 después de haber creado la sesión** con
`createSessionFromVerifiedChallenge`.
*Verificación:* stack trace capturado instrumentando temporalmente el `catch` del handler
durante `auth.test.js` (cambio revertido; `git status` limpio).

### H3 — Tests de Jest con rutas de import rotas

| Archivo | Problema | Corrección |
|---|---|---|
| `server/core/services/whatsapp.js:1` (código, no test) | `import "../config.js"` — no existe `server/core/config.js` | `../../config.js` |
| `server/core/services/otp-mailer.test.js:1` | mismo error | `../../config.js` |
| `server/domains/ong/middleware/financial-state.test.js:1,3` | `../test-utils/…`, `../supabase.js` | `../../../test-utils/mockSupabase.js`, `../../../supabase.js` |
| `server/services/payments.test.js:1-4` | importa `./payments/*.js`; el código está en `server/core/services/payments/` | mover a `server/core/services/payments.test.js` y ajustar `../../routes/webhooks-payments.js` |

`whatsapp.js` no rompe el arranque solo porque ningún módulo montado lo importa (ver H6).

### H4 — Errores de `tsc`

| Ubicación | Error | Naturaleza |
|---|---|---|
| `src/industries/ong/registry.tsx:592` | `"areas"` no está en `TENANT_ROUTE_IDS` (`src/core/tenant/registry-types.ts:11`) | tipo desactualizado |
| `src/modules/ong/app/pages/Courses.tsx:182-184` | usa `nota`, `createdAt`, `certificadoId`; `InscripcionRow` (`cursos.service.ts:28`) tiene `creadoEn`, `certificadoUrl` y no tiene `nota` | **bug funcional**: el CSV exportado escribe `"undefined"` en *Nota* y vacío en fecha/certificado (en la copia no renderizada, ver H1) |
| `ong/src/app/pages/Courses.tsx:360` | `string \| null` → `string` | nulabilidad no manejada (copia en ejecución) |

### H5 — Configuración de secretos

- `server/config.js:13`: `otpPepper` cae a `"dev-local-pepper"` si falta `MFA_OTP_PEPPER`;
  `assertServerConfig` no lo exige. Se usa para el hash de OTP (`server/utils/security.js:53`).
- `server/utils/crypto-aes.js:13`: clave AES derivada del pepper con respaldo literal
  `"democra-default-aes-secret-key-32b"`. **`encryptAes256`/`decryptAes256` no tienen ningún
  consumidor fuera de su test** (`grep` en `server/`, `src/`, `ong/src/`) → no hay datos
  cifrados que migrar.
- `EXPOSE_DEBUG_OTP` (`config.js:22`) devuelve el OTP en la respuesta si está en `true`; no
  hay guarda para producción.

### H6 — Backend no cableado

No se importan desde ninguna ruta montada en `server/index.js`: `cms-engine.js`,
`gdpr-export.js`, `sso-saml.js`, `offline-sync.js`, `outgoing-webhooks.js`,
`notifications-dispatcher.js` (y por ende `push.js`, `sms.js`, `whatsapp.js`),
`server/core/services/payments/*` y `server/routes/webhooks-payments.js`.
*Verificación:* `grep import` sobre `server/` excluyendo tests.

### H7 — Dependencias

`depcheck` + `grep` sobre `src`, `ong/src`, `educ/src` (0 archivos que importen):
`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `react-dnd`,
`react-dnd-html5-backend`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`,
`react-slick`, `react-responsive-masonry`, `react-popper`, `@popperjs/core`, `@xyflow/react`,
`@tanstack/react-query-devtools`; dev: `lighthouse`, `chrome-launcher`.
Animación duplicada: `motion` (164 archivos) vs `framer-motion` (6 archivos).
`three`/`@react-three/*`: 2 archivos.

### H8 — Higiene del repositorio

- 356 archivos versionados que `.gitignore` excluye: `graphify-out/` (347, `graph.json` de
  9.8 MB), `_chk/` (1), `_cov/` (5), `_pv/` (2), `.claude/settings.local.json` (1).
  *Verificación:* `git ls-files -i -c --exclude-standard`.
- `.vs/` (índice de Visual Studio, 2.9 MB) y `__pycache__/` versionados y no ignorados.
- ~50 scripts ad-hoc en la raíz (`fix*`, `patch*`, `inject_*`, `generate_*`, `diff_*`,
  `check_*`, `replace_*`, `refactor.py`, …), temporales (`temp_dashboard.tsx` 176 KB,
  `cached_diff.txt` 453 KB, `api_err.txt`/`api_out.txt` vacíos, `components.json.bak`,
  `test.js`).
- Volcados de esquema: `BD.json`, `BD_emergencia.json`, `Supabase Snippet Untitled query.csv`
  (4 MB), `dds/MEJORAS/BD_viva_09072026.txt` (16 MB), `missing_functions_audit.json`. Sin
  datos personales (1 email por archivo), pero exponen roles, funciones y RLS.
- Migraciones con versión de 8 dígitos: `20260305_rls_hardening.sql`,
  `20260728_post_dev_complete_schema.sql`.
- `package.json` → `"name": "vanilla-migrated"`.
- Tipado: `strict: false`, `noImplicitAny: false`; 790 usos de `any`, 303 `@ts-ignore`/`@ts-nocheck`.

---

## 3. Reglas transversales

| Regla | Aplicación |
|---|---|
| Auditoría | Cada fase genera `changes/YYYY-MM-DD_HH-MM_<fase>/` con `CHANGELOG.md`, `SUMMARY.md`, `FILES_CHANGED.md` (CLAUDE.md) |
| Commits | Conventional Commits; un commit por paso reversible de forma independiente |
| Rama | Desarrollo en la rama asignada a la sesión; integración a `main` por PR, o push directo si el usuario confirma la regla de `CLAUDE.md` (**decisión D1**) |
| Puerta de calidad | `typecheck` + `typecheck:server` + `test` + `test:web` + `build` en verde; desde F1, verificado por CI |
| Prohibido | Saltar, deshabilitar o poner en cuarentena tests; subir umbrales para pasar |
| Reversión | `git revert <rango>` por fase; F4 además con tag `pre-consolidacion-ong` |

---

## 4. Fases

### F1 — Puerta de calidad confiable · esfuerzo bajo (0.5–1 día) · sin dependencias

| # | Tarea | Archivos | Criterio de aceptación |
|---|---|---|---|
| 1.1 | **Corregir H2 en producción**: envolver la notificación para que ningún fallo síncrono o asíncrono afecte la respuesta: `Promise.resolve().then(() => emailService.sendAlert(...)).catch(...)`, o declarar `async` los métodos `send*` de `EmailService` | `server/routes/auth.js`, opcional `email.service.js` | Test nuevo: con `sendAlert` lanzando síncronamente, `verify-otp` responde 200 |
| 1.2 | Mockear `../core/services/email/index.js` en `auth.test.js` | `server/routes/auth.test.js` | 369/369 tests |
| 1.3 | Corregir rutas de H3 | 4 archivos | 33/33 suites cargan y pasan |
| 1.4 | Tests de frontend herméticos: `vi.stubEnv` de `VITE_SUPABASE_*` y `VITE_ONG_DB_SUPABASE_*` en `vitest.setup.ts`; mock global de `@supabase/supabase-js` | `vitest.setup.ts`, mock nuevo | Sin `.env`: 101/101 archivos |
| 1.5 | Bloqueo de red en tests: `fetch`/`XMLHttpRequest` no mockeados fallan con error explícito | `vitest.setup.ts` | 0 `ENOTFOUND` en la salida |
| 1.6 | Corregir H4: añadir `"areas"` a `TENANT_ROUTE_IDS`; en `src/modules/ong/.../Courses.tsx` usar `creadoEn`/`certificadoUrl` y eliminar la columna *Nota* (o añadir `nota` al servicio si existe en `academico.inscripciones`, a confirmar en BD); manejar `null` en `ong/src/.../Courses.tsx:360` | 3–4 archivos | `npm run typecheck` = 0 errores |
| 1.7 | CI: `.github/workflows/ci.yml` (Node fijado por `.nvmrc`, `npm ci`, `typecheck`, `typecheck:server`, `test`, `test:web`, `build`) | 2 archivos nuevos | Workflow verde en el PR |

**Riesgo:** 1.1 cambia el flujo de login; mitigado con el test de 1.1 y sin alterar el contrato de respuesta.

### F2 — Secretos y configuración · esfuerzo bajo (0.5 día) · depende de F1

| # | Tarea | Criterio |
|---|---|---|
| 2.1 | `assertServerConfig` exige `MFA_OTP_PEPPER` (≥ 32 caracteres) cuando `NODE_ENV=production`; el default solo en `development`/`test` | Test: producción sin pepper → arranque falla |
| 2.2 | `crypto-aes.js`: clave propia `DATA_ENCRYPTION_KEY` (32 bytes, base64), sin literal de respaldo. Sin consumidores actuales (H5) → **no requiere migración de datos** | Test de `crypto-aes` con la nueva clave; falla sin clave |
| 2.3 | `EXPOSE_DEBUG_OTP=true` aborta el arranque en producción | Test |
| 2.4 | Actualizar `.env.example`, `SETUP.md`; el usuario carga `MFA_OTP_PEPPER` y `DATA_ENCRYPTION_KEY` en Vercel **antes** del merge | Checklist en el CHANGELOG |

**Riesgo:** despliegue caído si faltan variables en Vercel → orden: variables primero, merge después.

### F3 — Higiene del repositorio · esfuerzo medio (0.5–1 día) · depende de F1

| # | Tarea |
|---|---|
| 3.1 | `git rm -r --cached graphify-out _chk _cov _pv .claude/settings.local.json` |
| 3.2 | Añadir `.vs/` y `__pycache__/` a `.gitignore`; `git rm -r --cached .vs __pycache__` |
| 3.3 | Eliminar temporales: `temp_*.tsx`, `cached_diff.txt`, `api_err.txt`, `api_out.txt`, `components.json.bak`, `test.js` |
| 3.4 | Scripts ad-hoc de la raíz y de `ong/*.mjs` → eliminar o mover a `scripts/legacy/` con README (**decisión D2**) |
| 3.5 | Volcados de esquema → eliminar o mover a `docs/db/snapshots/` (**decisión D2**) |
| 3.6 | `package.json`: `"name": "democra"` |

**Criterio:** raíz ≤ 25 entradas (hoy 128); puerta de calidad en verde.
**Nota:** el historial conserva el peso (`.git` = 26 MB); no se reescribe historia (exigiría force-push a `main`).

### F4 — Consolidación del módulo ONG · esfuerzo alto (3–5 días) · depende de F1 y F3 ⚠️

**Decisión D3 (obligatoria antes de empezar):** ubicación canónica.
**Recomendación:** ubicación `src/modules/ong` (coincide con `README.md`, `tsconfig.json` y la
arquitectura `src/industries/*`), **con el contenido de `ong/src` como fuente de verdad en
conflictos de lógica**, porque es el código que hoy ejecutan los usuarios (H1).

| Paso | Acción | Verificación del paso |
|---|---|---|
| 4.0 | Tag `pre-consolidacion-ong`; capturas Playwright de referencia de `/ong` (login, dashboard, beneficiarios, voluntarios, admisión, finanzas, cursos, gobernanza) | capturas guardadas |
| 4.1 | `changes/.../DIVERGENCIA.md`: tabla de los 351 archivos (ruta · último commit de cada copia · tipo: solo estilos / lógica / exclusivo · decisión) | revisión del usuario |
| 4.2 | Portar los 25 archivos de código exclusivos de `ong/src` (incl. `app/App.tsx`, `main.tsx`, `IdCardCanvasEditor.tsx`, `IdCardTemplateWizard.tsx`, `useBulkSelection.ts`, `deviceFingerprint.ts`, `idCardBatch.ts`, …) | `typecheck` |
| 4.3 | Fusionar los 223 archivos divergentes por carpeta (`pages`, `modules/*`, `services`, `lib`, `components`, `tenant`); regla: diferencia solo de clases → cualquiera; diferencia de lógica → versión de `ong/src` + revisión manual de lo propio de `src/modules/ong` (p. ej. migración de estilos de `b983aa7`) | `typecheck` + `test:web` por carpeta |
| 4.4 | Mover los 98 tests junto a su código | conteo de tests ≥ 535 |
| 4.5 | `@ong` → `src/modules/ong` en `vite.config.js` y `vitest.config.ts`; `ong/index.html` → `/src/modules/ong/main.tsx` | `build` |
| 4.6 | `registry.tsx`: sustituir `element: <Page />` estáticos por `lazy()` o eliminar `element` si sigue sin consumirse | sourcemap: chunk de entrada sin páginas |
| 4.7 | Eliminar `ong/src`; quitarlo de `tsconfig.include` y de `include` de Vitest; actualizar `README.md` | `grep -rn "ong/src" src vite.config.js vitest.config.ts tsconfig.json` vacío |

**Criterios de aceptación:**
- Un único `TenantBootstrapContext` en `dist/assets` (`grep` del mensaje de error = 1).
- Puerta de calidad en verde; ≥ 535 tests.
- E2E de humo (`tests/e2e/smoke.spec.ts` ampliado) en verde; diferencias visuales vs 4.0 revisadas.
- Chunk de entrada de `/ong` reducido de forma medible respecto de 1.38 MB.

**Riesgos:** regresiones en páginas sin E2E → fusión por carpeta, capturas antes/después,
congelamiento de cambios de UI en ONG durante la fase (**decisión D4**).

### F5 — Base de datos y migraciones · esfuerzo medio (1–2 días) · depende de F1

| # | Tarea | Criterio |
|---|---|---|
| 5.0 | Reintentar `list_migrations` (**NO VERIFICADO** hoy) y comparar con `supabase/migrations/` (24 archivos) | inventario en el CHANGELOG |
| 5.1 | Renombrar las 2 migraciones de 8 dígitos a 14 dígitos sin colisionar con versiones ya registradas en `supabase_migrations.schema_migrations` | carpeta = historial remoto |
| 5.2 | Reconciliar drift (p. ej. `restore_15_functions.sql`) como migraciones versionadas; aplicar primero en rama de Supabase (`create_branch`), nunca directo a producción sin aprobación | `db reset` en rama reproduce el esquema |
| 5.3 | Generar tipos (`generate_typescript_types`) y reemplazar tipos manuales (`InscripcionRow`, `app-database.ts`) | `typecheck` |
| 5.4 | Advisors `security` y `performance` tras cada DDL | 0 lints de seguridad |

### F6 — Backend no cableado · esfuerzo medio (1 día) · depende de F1 y de la decisión D5

Por cada módulo de H6: **montar**, **mantener detrás de flag** o **eliminar**.
Si se monta: auth + `assertTenantScope` + rate limit + entrada en `docs/api/openapi.yaml`.
`webhooks-payments` necesita el cuerpo crudo para `verifyHmacSignature` → registrar con
`express.raw()` **antes** de `express.json()` en `server/index.js`.
**Criterio:** `npx madge --orphans server` sin módulos de producción huérfanos.

### F7 — Rendimiento y dependencias · esfuerzo medio (1 día) · depende de F4

| # | Tarea | Criterio |
|---|---|---|
| 7.1 | Desinstalar las 15 dependencias y 2 devDependencies sin uso (H7) | `depcheck` sin hallazgos; `build` verde |
| 7.2 | Unificar animación en `motion` migrando los 6 archivos de `framer-motion` | `framer-motion` fuera de `package.json` |
| 7.3 | `three`/`@react-three/*` solo en su ruta, vía `lazy()` | no aparecen en `vendor-*.js` |
| 7.4 | `manualChunks` revisado tras F4 | ningún chunk de app > 500 kB; `vendor` < 800 kB |

### F8 — Endurecimiento de tipos · continuo · empieza tras F4

1. Línea base (790 `any`, 303 `@ts-ignore`/`@ts-nocheck`) en un script de CI que falla si aumentan.
2. `noImplicitAny` por carpeta: `src/core`, `src/services`, `src/modules/ong/app/services`.
3. Meta: `strict: true` en esas carpetas.

---

## 5. Secuencia

```
F1 ──► F2
 │
 ├──► F3 ──► F4 ──► F7
 │            └───► F8 (continuo)
 └──► F5 ──► F6
```

| Bloque | Fases | Estimación |
|---|---|---|
| A — Estabilizar | F1, F2, F3 | 2–3 días |
| B — Arquitectura | F4 | 3–5 días |
| C — Datos y backend | F5, F6 | 2–3 días |
| D — Optimización | F7, F8 | 1–2 días + continuo |

---

## 6. Métricas de éxito

| Métrica | Hoy | Meta |
|---|---|---|
| Errores `tsc` | 6 | 0 |
| Suites Jest fallidas | 5/33 | 0 |
| Archivos Vitest fallidos sin `.env` | 70/101 | 0 |
| Accesos de red en tests | 122 | 0 |
| Copias del módulo ONG | 2 (351 diferencias) | 1 |
| Contextos `TenantBootstrapContext` en bundle | 2 | 1 |
| Módulos de `src/modules/ong` en chunk de entrada `/ong` | 197 | 0 (lazy) |
| Archivos versionados ignorados | 356 | 0 |
| Entradas en la raíz | 128 | ≤ 25 |
| Dependencias sin uso | 17 | 0 |
| Chunk JS mayor | 1.66 MB | app < 500 kB · vendor < 800 kB |
| CI | inexistente | obligatorio en PR |

---

## 7. Decisiones pendientes del usuario

| ID | Decisión | Bloquea |
|---|---|---|
| D1 | Integración: PR desde la rama de sesión, o push directo a `main` según `CLAUDE.md` | todas |
| D2 | Scripts ad-hoc y volcados de BD: eliminar o archivar | F3.4, F3.5 |
| D3 | Ubicación canónica del módulo ONG (recomendado: `src/modules/ong` con lógica de `ong/src`) | F4 |
| D4 | Congelar cambios de UI en ONG durante F4 | F4 |
| D5 | Destino de cada módulo backend no cableado | F6 |

---

## 8. Correcciones respecto de la versión preliminar (chat)

1. **Copia en ejecución:** `/ong` renderiza `ong/src`, no `src/modules/ong`; esta última se
   empaqueta pero sus páginas no se renderizan (H1). Cambia la regla de fusión de F4.
2. **`verify-otp` 500** no es solo un mock faltante: es un bug de producción (H2) → F1.1.
3. **AES sin consumidores:** se elimina la sub-tarea de migración/recifrado de datos (F2.2).
4. **MUI/Emotion, react-dnd, @dnd-kit** no están "duplicadas": no se usan (0 imports) → se
   desinstalan en vez de migrarse (F7.1).
5. **Migraciones remotas:** no se pudo verificar el drift (timeout); F5.0 lo hace primero.
