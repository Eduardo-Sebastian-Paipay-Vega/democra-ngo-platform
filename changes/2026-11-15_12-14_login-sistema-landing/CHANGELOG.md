# CHANGELOG — `/login` adopta el sistema visual `.lp` del landing

- **Fecha y hora:** 2026-11-15 12:14 (America/Lima)
- **Autor:** Claude (Claude Code), por decisión del usuario («Sí, solo presentación»)
- **Rama:** `feature/landing-publica`
- **Estado:** Completado (presentación). Quedan pendientes aparte los arreglos de accesibilidad dentro de `CoreLogin` (ver «Pendiente»).

## Objetivo

Alinear la pantalla de inicio de sesión (`/login`) con el lenguaje visual del landing público (`/`), **sin tocar la lógica de autenticación**.

## Contexto del problema

`/login` seguía con el sistema visual anterior (`.claude/landing-design/AUDIT-login.md`):

- Fondo negro con manchas azules y violetas animadas (`GradientBackground`, `motion`).
- Tarjeta de cristal con radio 24.
- Azul Tailwind `#3b82f6` con texto blanco: contraste ≈3,7:1.
- Tipografía del sistema 13 px, sin Inter Tight.
- Pie a 11 px `#707070` (≈4,2:1).

Además, la animación del fondo **ignoraba `prefers-reduced-motion`** y los campos **no mostraban foco** con el teclado.

## Motivo

Es la ruta que el landing enlaza como «Iniciar sesión»: el salto visual entre `/` y `/login` rompía la continuidad de marca. El usuario autorizó la opción A de la auditoría: solo presentación.

## Solución implementada

1. **`scope.json`:**
   - `/login` pasa a `publicRoutes` y sale de `excludedRoutes`.
   - Se autorizan `src/pages/login/` y `src/app/LoginGateway.tsx`.
   - `src/core/auth/` y `GradientBackground.tsx` quedan protegidos de forma explícita.
2. **`LoginPage.tsx`:**
   - Importa `landing.css` y el nuevo `login.css`.
   - Fija `document.title` a «Iniciar sesión · democra.pro» y lo restaura al salir.
3. **`login.css` (nuevo):** estilos acotados en `.lp-auth*`:
   - Fondo `--lp-grad-end` fijo.
   - `main` centrado.
   - Tarjeta con radio 18 y padding 32 (28/20 por debajo de 400 px).
   - Cabecera, deshabilitado del botón, pie.
   - Radio estable del campo al enfocarlo.
4. **`LoginGateway.tsx`:**
   - Sustituye `GradientBackground` por la raíz `div.lp.lp-auth` + `.lp-frame` + `main`.
   - Cabecera con `BrandMark` (href `/`), h1 «Iniciar sesión» (`.lp-h2`) y bajada `--lp-fg-muted`.
   - Botón `lp-btn lp-btn-lg lp-btn-block`.
   - «¿Necesitas ayuda…?» y «Ir a la página principal» pasan a enlaces de texto en `.lp-note`.
   - La tarjeta recibe por la prop `style` los valores de `.lp-card` sobre `--lp-bg`, sin desenfoque ni sombra.
   - **`handleSuccessfulLogin` (RPC `fn_get_user_redirect_target` y redirección a `/ong/app`) no se modificó.**

### Decisión de diseño: `--lp-grad-end` en vez de `--lp-grad-hero`

La auditoría proponía `--lp-grad-hero`, pero ese degradado está pensado para una zona de unos 1500 px y tiene su pico brillante al 60 %. En una pantalla de 900 px ese pico caería detrás de la tarjeta. `--lp-grad-end` (de `#090d14` a `#4ca3ff`) es el degradado del CTA final del landing: deja la tarjeta sobre la zona oscura y el brillo abajo.

La tarjeta es opaca (`.lp-card` sobre `--lp-bg`), así que se ve **igual que una tarjeta del landing** sea cual sea el fondo, y el contraste del texto no depende del degradado.

## Riesgos identificados

- **Fuga de CSS:** `landing.css` y `login.css` solo tienen selectores bajo `.lp` / `.lp-auth`. `landing.css` ya se cargaba en la SPA al visitar `/`. Riesgo bajo.
- **Inputs:** `CoreLogin` les aplica estilos en línea (fondo `#1a1a1a`, borde). No se forzaron con `!important`; siguen con su aspecto anterior (L-13 pendiente de decisión).
- **`.lp :focus-visible`:** ahora aplica también a los campos y al botón de ayuda. Era el efecto buscado (L-01). Su `border-radius: 8px` se anula en los campos para que no salten de 12 a 8 px.
- **MFA:** `MfaChallenge` se renderiza dentro del mismo `main`, sobre el nuevo fondo, con su propio tema oscuro. No se pudo comprobar (requiere una cuenta con segundo factor).

## Impacto esperado

`/login` se ve como una extensión del landing: misma paleta, marca, botón, tarjeta, tipografía y marco. Se resuelven por la vía de la presentación:

- L-01: foco visible en los campos.
- L-04: sin animación de fondo.
- L-05 a L-12, L-14 a L-16.

## Módulos afectados

- Ruta `/login` (SPA raíz).
- **Sin cambios:** login de ONG (`src/modules/ong/...`), `CoreLogin`, `MfaChallenge` y `PublicLayout` (sigue usando `GradientBackground`).

## Dependencias

Ninguna nueva. Se elimina `motion` del grafo de `/login`, porque ya no importa `GradientBackground`.

## Efectos secundarios posibles

- El título de la pestaña en `/login` cambia a «Iniciar sesión · democra.pro».
- El h1 pasa de «Democra» a «Iniciar sesión».
- La fuente Inter Tight ahora se descarga también en `/login`.

## Pendiente (fuera de este cambio)

Estos arreglos requieren tocar `src/core/auth/components/CoreLogin.tsx`, que comparte el login de ONG. No están autorizados:

- **L-02:** etiquetas sin `htmlFor`/`id`.
- **L-03:** el botón de mostrar contraseña tiene `tabIndex=-1`, no tiene `aria-label` y su contraste es ≈2,2:1.
- **L-13:** estilo de los campos (decisión de diseño).
- `role="alert"` en el mensaje de error.

## Verificación

Detalle en `.claude/landing-design/VERIFICATION-login.md`.

- **Navegador:** 3 viewports. Foco visible en los 5 controles; ninguna capa animada con `reduce`; sin scroll horizontal.
- **Guard de alcance:** PASS.
- **Build:** OK.
- **Vitest:** 453/453.
- **Jest:** 369/369, con 4 suites que ya fallaban por módulos de `server/services/payments` inexistentes.
- **Sin probar:** inicio de sesión real, mensaje de error y MFA.

## Cómo revertir

```bash
git checkout HEAD -- src/app/LoginGateway.tsx src/pages/login/LoginPage.tsx && rm src/pages/login/login.css
```

Y devolver `/login` a `excludedRoutes` en `.claude/landing-design/scope.json`.
