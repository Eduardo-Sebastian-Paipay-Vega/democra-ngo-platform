# FILES_CHANGED — `/login` con el sistema visual del landing

## Código

| Archivo | Acción | Cambio |
|---|---|---|
| `src/pages/login/login.css` | Creado | Estilos `.lp-auth*` acotados: fondo `--lp-grad-end`, `main` centrado a pantalla completa, tarjeta (radio 18, padding 32 / 28×20 bajo 400 px), cabecera, bajada, botón deshabilitado (opacidad .45 y sin hover ni active), pie, radio estable del campo al enfocarlo |
| `src/pages/login/LoginPage.tsx` | Modificado | Importa `../landing/landing.css` y `./login.css`. `document.title` = «Iniciar sesión · democra.pro», restaurado al desmontar |
| `src/app/LoginGateway.tsx` | Modificado | Quita `GradientBackground`. Raíz `div.lp.lp-auth` + `.lp-frame` + `main.lp-auth-main`. `headerNode` con `BrandMark` + h1 «Iniciar sesión» + bajada. `footerNode` en `.lp-note` con el botón de ayuda (mismo destino de WhatsApp) y el enlace a `/`. Props visuales para `CoreLogin`: `className="lp-auth-card"`, `style` (valores de `.lp-card` sobre `--lp-bg`, sin blur ni sombra), `buttonClassName="lp-btn lp-btn-lg lp-btn-block lp-auth-submit"`. Se eliminó `buttonStyle`. **`handleSuccessfulLogin` sin cambios** |

## Configuración y documentación (no es código de producción)

| Archivo | Acción | Cambio |
|---|---|---|
| `.claude/landing-design/scope.json` | Modificado | `/login` pasa a `publicRoutes` y sale de `excludedRoutes`. Se autorizan `src/pages/login/` y `src/app/LoginGateway.tsx`. Sale `src/app/` de los protegidos (solo contenía `LoginGateway.tsx`). Se protegen explícitamente `src/core/auth/` y `GradientBackground.tsx`. Decisión registrada |
| `.claude/landing-design/AUDIT-login.md` | Creado | Auditoría previa (19 divergencias) y estado posterior |
| `.claude/landing-design/VERIFICATION-login.md` | Creado | Mediciones antes y después, guard, build y tests |
| `.claude/landing-design/evidence/login-*.{png,json}` | Creados | Evidencia antes (`login-*`) y después (`login-after-*`), 3 viewports y estados |
| `changes/2026-11-15_12-14_login-sistema-landing/*` | Creados | Este registro |

## No modificados (verificado con `guard-changes.mjs verify`)

`src/core/auth/**` (`CoreLogin`, `MfaChallenge`), `src/pages/landing/components/GradientBackground.tsx`, `src/core/shell/PublicLayout.tsx`, `src/modules/ong/**`, `src/pages/landing/landing.css`, `index.html` y `src/styles/global.css`.
