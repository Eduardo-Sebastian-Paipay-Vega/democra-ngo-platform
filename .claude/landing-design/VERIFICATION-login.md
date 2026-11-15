# VERIFICATION — `/login` con el sistema `.lp`

- **Fecha:** 2026-11-15, después de aplicar la opción A de `AUDIT-login.md`.
- **Método:** Playwright (`channel: 'chrome'`) contra `http://localhost:5173/login`, en 1440×900, 768×1024 y 390×844.
- **Evidencia:**
  - Después: `evidence/login-after-{desktop,tablet,mobile}.png`, `login-after-computed.json`, `login-after-states.json`.
  - Antes: `evidence/login-*`.

## Antes y después (medido)

| ID | Propiedad | Antes | Después | Referencia `.lp` | OK |
|---|---|---|---|---|---|
| — | Raíz `.lp` / `main` / `<title>` | no / no / título del landing | sí / sí / «Iniciar sesión · democra.pro» | — | ✅ |
| L-05 | Fondo | `#000` con manchas violetas | `--lp-grad-end` + `.lp-frame` (inset 22 a 1440, ninguno a 390) | tokens `--lp-*` | ✅ |
| L-10 | Tarjeta | radio 24, `.02`, `blur(12px)`, sombra | radio **18**, `rgba(235,235,235,.05)` sobre `#090d14`, borde `rgba(235,245,235,.1)`, sin blur, sin sombra | `.lp-card` | ✅ |
| L-11 | h1 | sistema 22/600 «Democra» | **Inter Tight 500**, 32 px (30 a 390), −0.03em, `#eef1ea`, «Iniciar sesión» | `.lp-h2` | ✅ |
| L-11 | Fuentes cargadas | ninguna | Inter Tight | — | ✅ |
| L-12 | Bajada | 13 px `#a0a0a0` | 15 px `rgba(255,255,255,.77)` | `--lp-fg-muted` | ✅ |
| L-06/07 | Botón | `#3b82f6` / blanco 600 13 px, alto 44, sin hover | `#519dfc` / `#090d14` 500 18 px, alto **54**, anillo `#a7caff`, hover **`#6ca7ff`** | `.lp-btn-lg` | ✅ |
| — | Botón deshabilitado | opacidad .4 | opacidad .45, sin hover | (nivel C) | ✅ |
| L-08 | Ayuda | botón de bloque gris | enlace subrayado `#eef1ea` 14 px | `.lp-note button` | ✅ |
| L-09 | Pie | 11 px `#707070` (≈4,2:1), enlace `#3b82f6` sin subrayado | 14 px `rgba(255,255,255,.77)`, enlace `#eef1ea` subrayado | `.lp-note` | ✅ |
| L-14 | Marca | monograma 48 en caja azul + h1 | `BrandMark` (href `/`) | `BrandMark` | ✅ |
| L-01 | Foco con Tab (marca, correo, contraseña, ayuda, enlace) | campos **sin señal** | los 5 con `3px solid rgba(81,157,252,.6)`, separación 3 | `.lp :focus-visible` | ✅ |
| L-04 | `reduce`: capas animadas entre t0 y t+1,5 s | cambian | ninguna capa animada | — | ✅ |
| L-19 | Desbordamiento horizontal | no | no (`scrollWidth` = viewport en las 3 vistas) | — | ✅ |

## Sin resolver (fuera del alcance autorizado)

- **L-02, L-03 y `role="alert"`:** están en `CoreLogin` (compartido con el login de ONG).
- **L-13:** los campos siguen con fondo `#1a1a1a`, radio 12 y etiquetas 12 px `#A7A7A7`, por los estilos en línea de `CoreLogin`.
- **L-17, L-18:** error y MFA no se renderizaron. Hace falta un intento de login real o una cuenta con MFA. **Pendiente de verificación manual o con cuentas de prueba.**
- **No se ejecutó un inicio de sesión real.** La lógica no se modificó, pero el flujo completo (login → `/ong/app`) no se probó en esta ejecución.

## Guard de alcance

`guard-changes.mjs verify` → `PASS`. Cambios desde el snapshot: `src/app/LoginGateway.tsx`, `src/pages/login/login.css` y `src/pages/login/LoginPage.tsx`. Ninguno fuera de la allowlist.

## Build y tests

Las tres ejecuciones fueron simultáneas y la máquina estaba muy cargada.

| Comando | Resultado |
|---|---|
| `npm run build` (vite) | ✅ OK, en 35 min 57 s. Genera `LoginPage-*.js` y `LoginPage-*.css`. Solo avisos de chunks > 500 kB, que ya existían |
| `npm run test:web` (vitest) | ✅ 90/90 archivos, 453/453 tests. 11 errores `Timeout waiting for worker to respond` del runner, por la carga, no por fallos de test. Ningún test cubre el login |
| `npm test` (jest) | ✅ 369/369 tests. ⚠ 4 suites no cargan por módulos inexistentes, p. ej. `server/services/payments.test.js` → `./payments/stripe.js`, que no está en git. Es anterior a este cambio y ajeno a él (`server/` sin cambios según el guard) |
