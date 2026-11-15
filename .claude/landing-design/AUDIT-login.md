# AUDIT — `/login` frente al sistema `.lp` del landing

- **Fecha:** 2026-11-15, por `/landing-auditar /login`. Es un informe: **no se modificó código** ni `scope.json`.
- **Referencia:** `/` (`DESIGN.md`, `TOKENS.json`, `COMPONENTS.md`), commit `0e57991`.
- **Página auditada:** `/login` → `src/App.tsx:10-16` → `src/pages/login/LoginPage.tsx` → `src/app/LoginGateway.tsx` → `src/core/auth/components/CoreLogin.tsx` + `src/pages/landing/components/GradientBackground.tsx`.
- **Archivo aparte:** este informe no sustituye `AUDIT.md`, que sigue siendo la auditoría de `/nosotros`.

## Estado posterior (2026-11-15)

El usuario eligió la **opción A** («Sí, solo presentación»). Se aplicó en `LoginPage.tsx`, `login.css` y `LoginGateway.tsx`:

- **Resueltos:** L-01, L-04 a L-12 y L-14 a L-16 (ver `VERIFICATION-login.md`).
- **Abiertos:** L-02, L-03, L-13, L-17 y L-18 (requieren `CoreLogin` o una sesión real).
- **Cambio respecto al plan:** se usó `--lp-grad-end` en vez de `--lp-grad-hero`. El motivo está en `changes/2026-11-15_12-14_login-sistema-landing/CHANGELOG.md`.

La sección siguiente describe el estado **anterior** a la decisión.

## ⚠ Estado de alcance (leer antes de actuar)

`/login` **está en `excludedRoutes`** y **todos** sus archivos fuente están en `protectedSourcePaths` (`src/pages/login/`, `src/app/`, `src/core/`, `src/pages/landing/components/`). La skill trata login como **flujo del sistema autenticado** hasta que el usuario lo autorice expresamente como superficie pública.

Esta auditoría se hizo porque el usuario la pidió (`/landing-auditar /login`). Pedir la auditoría **no** autoriza a aplicar cambios. Para aplicar cualquier punto, antes hace falta una decisión del usuario (ver «Decisiones pendientes»).

No se probó ningún inicio de sesión real. Para medir el botón habilitado se escribieron valores de prueba (`auditoria@example.test` / `x`) **sin enviar el formulario**.

## Evidencias

| Archivo | Qué contiene |
|---|---|
| `evidence/login-{desktop,tablet,mobile}.png` | Capturas a 1440×900, 768×1024 y 390×844, con `reducedMotion: reduce` |
| `evidence/login-computed.json` | Estilos calculados de raíz, fondo, tarjeta, logo, h1, subtítulo, etiquetas, campos, botones, pie, landmarks y fuentes cargadas (3 viewports) |
| `evidence/login-states.json` | Orden de tabulación y foco, botón habilitado, hover (enviar, ayuda, enlace) y fondo animado con y sin `prefers-reduced-motion` |
| `evidence/login-state-focus-1440.png`, `login-state-filled-1440.png` | Estado con foco de teclado y con campos rellenos |

**Método:** Playwright (`channel: 'chrome'`) contra `http://localhost:5173` (HTTP 200). El script de captura es propio, de solo lectura, y está en el scratchpad de la sesión (no está en el repo).

## Resumen

`/login` usa el **sistema anterior**, el mismo de `components/` y `/nosotros` antes de alinearla:

- Fondo negro puro con manchas azul y **violeta** animadas por `motion` (`GradientBackground`).
- Tarjeta de cristal con `backdrop-filter`.
- Azul Tailwind `#3b82f6`, texto blanco, tipografía del sistema 13 px / 600.
- **No carga Inter Tight** (`fontsLoaded: []`) y no existe ningún contenedor `.lp`.

La composición (una tarjeta centrada) es razonable para un login y **puede conservarse**. Lo que diverge es el **lenguaje visual**: paleta, botón, radios, tipografía y fondo.

Además hay **cuatro defectos de accesibilidad reales, independientes del diseño**:

1. Foco invisible en los campos.
2. Etiquetas sin asociar.
3. Botón de mostrar contraseña inaccesible.
4. El fondo se sigue animando con `reduce`.

Esos cuatro defectos viven en `CoreLogin`, que **también usa el login de ONG**.

## Matriz de divergencias

Gravedad: **Crítica** (rompe acceso) · **Alta** (identidad o accesibilidad) · **Media** · **Baja**. «Intencional» indica una variación aceptable.

| ID | Área | Selector / archivo:línea | Valor actual (medido) | Referencia `.lp` | Gravedad | Recomendación |
|---|---|---|---|---|---|---|
| L-01 | A11y · foco en campos | `CoreLogin.tsx:115,130` (`outline-none` + `focus:border-[#3D6BFF]`) | Con Tab: `outline: none` y el borde **sigue en `rgba(255,255,255,.08)`**. El `style={{border}}` en línea pisa la clase `focus:border-*`, así que **no hay ninguna señal de foco** (`login-states.json` → `tab1`, `tab2`) | `.lp :focus-visible` → contorno 3 px `rgba(81,157,252,.6)`, separación 3 px | **Crítica** | Quitar `outline-none` o mover el borde a clase. Anillo `--lp` en foco. Afecta también al login de ONG |
| L-02 | A11y · etiquetas | `CoreLogin.tsx:107,121` | `<label>` sin `htmlFor` y campos sin `id`/`name`/`aria-label` (`labelFor[].htmlFor: null`). El nombre accesible solo sale del placeholder | Campos con nombre accesible | Alta | `id` + `htmlFor` (o envolver el campo con `label`). Añadir `name` |
| L-03 | A11y · mostrar contraseña | `CoreLogin.tsx:134-153` | `tabIndex=-1` (inalcanzable con teclado), sin `aria-label` ni `aria-pressed`, área de 16×16 px, icono `#505050` sobre `#1a1a1a` ≈ **2,2:1** (calculado; mínimo 3:1 para no-texto) | Controles alcanzables, área ≥ 24 px, contraste ≥ 3:1 | Alta | Quitar `tabIndex=-1`, `aria-label="Mostrar contraseña"` + `aria-pressed`, área 32-40 px, color `--lp-fg-muted` |
| L-04 | Movimiento | `GradientBackground.tsx:21,29,47,65,82` | Con `reduce`, las capas siguen cambiando: `translateX` y `scale` varían en 1,5 s y `grainShift` sigue activo (`reducedMotion.changed: true`). Además usa parallax por scroll en una página sin scroll | Con `reduce` todo el movimiento se desactiva (verificado en `/`) | Alta | No usar `GradientBackground` en `/login`: fondo estático `.lp`. **No editar `GradientBackground`**, porque lo usa `PublicLayout` |
| L-05 | Fondo y atmósfera | `LoginGateway.tsx:86-87`, `GradientBackground.tsx:12,37,55,74` | Negro `#000`, manchas `rgba(0,55,200,.65)`, **violeta** `rgba(90,0,180,.5)` / `rgba(80,0,160,.45)`, grano y viñeta | `--lp-bg #090d14`, `--lp-grad-hero` (negro → azul → `#090d14`) y marco `.lp-frame` desde 768 | Alta | Raíz `div.lp` con `--lp-grad-hero` estático. El marco es opcional (ver V-2) |
| L-06 | Botón principal | `LoginGateway.tsx:93-94` (`buttonClassName` / `buttonStyle`) | `#3b82f6`, texto blanco 600 13 px, radio 16, alto 44. Hover: **sin cambio visible** (`submitHover`). Deshabilitado: opacidad 0,4 | `.lp-btn`: `#519dfc`, texto `#090d14` 500, anillo interior `#a7caff`, radio 16, hover `#6ca7ff`, active −1 px, alto 54 (lg) / 36 (sm) | Alta | `lp-btn lp-btn-block` con alto 48-54 (ver V-3). Conservar `disabled:opacity` porque el sistema `.lp` no tiene estado deshabilitado (nivel C) |
| L-07 | Contraste del botón | Mismo | Texto blanco sobre `#3b82f6` ≈ **3,7:1** (calculado) con 13 px. No llega a AA | `#090d14` sobre `#519dfc` ≈ 7,0:1 (calculado) | Alta | Lo resuelve L-06 |
| L-08 | Botón secundario «¿Necesitas ayuda…?» | `LoginGateway.tsx:58-75` | Botón de bloque `rgba(255,255,255,.03)`, borde `.08`, `#c0c0c0`, 13 px 500, radio 16. Hover: **sin cambio** (`helpHover`) | El sistema **no tiene botón secundario**: las acciones secundarias van como enlace en `.lp-note` (subrayado `rgba(255,255,255,.35)` → `currentColor` en hover) | Media | Convertirlo en enlace de texto dentro de `.lp-note`. Conservar el destino de WhatsApp tal cual (es funcional) |
| L-09 | Pie / enlace | `LoginGateway.tsx:76-81` | 11 px, `#707070` sobre ≈ `#000` ≈ **4,2:1**: no llega a AA para 11 px. Enlace `#3b82f6` sin subrayado ni hover | `.lp-note`: 14/20, `--lp-fg-muted rgba(255,255,255,.77)`, enlace `--lp-fg` subrayado | Alta | `.lp-note` |
| L-10 | Tarjeta | `CoreLogin.tsx:87-96` (`defaultStyle`, `rounded-3xl p-8`) | Radio **24**, fondo `rgba(255,255,255,.02)`, borde `.07`, `blur(12px)`, sombra `0 0 40px rgba(0,0,0,.35)`, ancho 420 | `.lp-card`: radio **18**, fondo `rgba(235,235,235,.05)`, borde `rgba(235,245,235,.1)`, sin desenfoque y sin sombra | Media | Pasar `className`/`style` desde `LoginGateway` (`CoreLogin` ya acepta las dos props). `style` se fusiona sobre `defaultStyle`, así que hay que anular explícitamente `backdropFilter` y `boxShadow` |
| L-11 | Tipografía del título | `LoginGateway.tsx:47` | h1 «Democra», sistema 22 px 600, `#f5f5f5`, tracking normal. **Inter Tight no se carga** en esta ruta | Inter Tight 500, −0.03em, `text-wrap: balance`. Para un título de tarjeta lo más cercano es `.lp-h3` / `.lp-h2` (30-32) | Media | Inter Tight 500, −0.03em, 28-32 px. Hay que comprobar por qué `index.html` no la carga aquí: `fontsLoaded` vacío en las 3 vistas |
| L-12 | Texto secundario | `LoginGateway.tsx:50` (`#a0a0a0` 13 px), etiquetas `CoreLogin.tsx:107,121` (`#A7A7A7` 12 px) | Grises neutros, 12-13 px | `--lp-fg-muted rgba(255,255,255,.77)` sobre `--lp-bg`, cuerpo de 15-16 px | Media | `--lp-fg-muted`. Etiquetas a 14 px |
| L-13 | Campos | `CoreLogin.tsx:115-116,130-131` | Fondo `#1a1a1a` (gris neutro), borde `.08`, radio 12, alto 43, 14 px | **Nivel C:** el landing no tiene campos de formulario. Lo más cercano son `.lp-footer-field` (estético) y `contact-modal.css:169-182` (`#101116`, radio 10, foco 2 px `#6aa5ff`), que **está protegido y no es referencia** | Media · **Hipótesis** | Proponer `--lp-surface`/`--lp-bg` como fondo, borde `rgba(235,245,235,.1)`, radio 8 (`--lp-radius-panel`) o 16 (control), foco con el anillo de L-01. **Requiere validación del usuario**: no es un valor medido del landing |
| L-14 | Marca | `LoginGateway.tsx:41-46` | `d-core-monogram.png` a 48 px en caja `rgba(59,130,246,.12)` con borde azul, radio 16, `alt="Democra"`, más un h1 «Democra» | `BrandMark`: monograma de 30 px con `alt=""` + wordmark `democra<span>.pro</span>` 20 px 500 | Media | Usar `BrandMark` (`href="/"`) como cabecera. El h1 pasa a ser la acción («Iniciar sesión»). Ver L-15 |
| L-15 | Contenido / etiquetas | h1 «Democra», botón «Ingresar», `CoreLogin` por defecto «Iniciar sesión» | El h1 repite la marca y no dice la tarea. El landing enlaza a esta ruta como **«Iniciar sesión»** | Etiqueta del landing: «Iniciar sesión» (`/login`) | Baja | h1 «Iniciar sesión». Botón «Ingresar» aceptable (o «Iniciar sesión»). **No cambiar los mensajes de error** (vienen de la lógica de auth) |
| L-16 | Estructura | Raíz | Sin `main`, sin `<title>` propio (hereda «democra.pro — Gobernanza democrática con IA»), sin enlace de vuelta salvo el del pie | Landing: `main#lp-main`, enlace para saltar al contenido | Baja | Envolver en `main`. `document.title = "Iniciar sesión · democra.pro"`. No hace falta enlace para saltar: no hay navegación que saltar |
| L-17 | Error | `CoreLogin.tsx:157-161` | `border-red-500/20 bg-red-500/10 text-red-200`. **No medido** (habría que intentar un inicio de sesión) | El landing **no tiene color de error**: nivel C | — · **Intencional** | Mantener el rojo funcional. No inventar un token. Añadir `role="alert"` (está en `CoreLogin`) |
| L-18 | MFA | `MfaChallenge` (`theme="dark"`) | No auditado: requiere una sesión con un segundo factor | — | Nivel C | Pendiente. Si se aplica L-05/L-10, comprobar que `MfaChallenge` no quede desalineado |
| L-19 | Responsive | 390 / 768 / 1440 | Sin desbordamiento horizontal (`scrollWidth` = viewport). Tarjeta de 420 (342 en 390), centrada. Altura del documento = viewport | — | — | Sin acción. Volver a medir después del cambio, sobre todo a 390 con el teclado en pantalla |

## Variaciones intencionales (no igualar)

- **V-1 Composición de una sola tarjeta centrada, sin `SiteHeader` ni `SiteFooter`.** Un login no es una página de marketing: la cabecera con navegación y el pie grande distraen de la tarea. Se conserva el lenguaje (paleta, tipografía, botón, tarjeta) y no la anatomía del landing.
- **V-2 Marco `.lp-frame`.** Es opcional. Si se usa, que sea igual que en el landing (inset 8/14/22). Si no, el fondo plano con `--lp-grad-hero` basta.
- **V-3 Alto del botón.** 48 px (entre `sm` 36 y `lg` 54) es aceptable dentro de una tarjeta de 420. Si se quiere igualdad estricta, 54.
- **V-4 Color de error rojo** (L-17) y **estado deshabilitado** (L-06): son funcionales, sin equivalente en la referencia.

## Plan de cambio por archivos

Ningún archivo de esta lista está autorizado hoy. El plan asume la opción A de «Decisiones pendientes».

| Archivo | Estado en `scope.json` | Qué cambiaría | Riesgo |
|---|---|---|---|
| `src/pages/login/LoginPage.tsx` | Protegido | Raíz `div.lp` + `main`, importar `landing.css` (o un `login.css` nuevo con alcance `.lp`), `document.title` | Bajo: solo la usa `/login` |
| `src/pages/login/login.css` (nuevo) | — (dentro de `src/pages/login/`) | Estilos `.lp-auth*` con alcance `.lp`: tarjeta, cabecera, nota, ajustes de campos | Bajo |
| `src/app/LoginGateway.tsx` | Protegido | Quitar `GradientBackground`. `headerNode` con `BrandMark` + h1. `footerNode` con `.lp-note`. Pasar `className`, `style` y `buttonClassName="lp-btn lp-btn-block …"` a `CoreLogin`. **No tocar `handleSuccessfulLogin`** (redirección/RPC) | Medio: archivo de auth. Solo cambia la parte de presentación |
| `src/core/auth/components/CoreLogin.tsx` | Protegido · **compartido con `src/modules/ong/app/pages/landing/LoginPage.tsx`** | Solo arreglos de accesibilidad L-01, L-02, L-03 y `role="alert"`: `id`/`htmlFor`, quitar `outline-none` y `tabIndex=-1`, `aria-label`. **No cambiar valores visuales por defecto** | **Alto**: afecta al login de ONG. Tratarlo como cambio del sistema, en otra tarea, con pruebas de ONG |
| `src/pages/landing/landing.css` | Permitido | Ninguno. Solo se reutilizan `.lp-btn`, `.lp-note`, `.lp-card` y los tokens. Si hiciera falta un token de campo, añadirlo aquí **solo** tras decidir L-13 | Bajo |

### NO deben tocarse

- `src/pages/landing/components/GradientBackground.tsx`: lo usa `src/core/shell/PublicLayout.tsx:16`. Hay que dejar de importarlo en `/login`, no editarlo.
- `src/core/auth/components/MfaChallenge.tsx`, `src/core/auth/index.ts`, `src/services/supabase*` y la lógica de `handleSuccessfulLogin` (RPC `fn_get_user_redirect_target`, redirección a `/ong/app`).
- `src/modules/ong/**` (incluido su `LoginPage.tsx`), `ong/`, `server/`, `api/` y `supabase/`.
- `index.html`: es compartido. Si Inter Tight no carga en `/login` (L-11), investigar antes de tocar nada.
- `src/styles/global.css`: global para toda la SPA.
- `src/pages/landing/ContactModal.tsx` y `contact-modal.css`: protegidos y con cambios sin commit ajenos.

## Dependencias y orden

1. **D-1:** decisión de alcance (abajo). Sin ella no se aplica nada.
2. **D-2:** los arreglos de accesibilidad de `CoreLogin` (L-01..L-03) son **independientes del diseño** y conviene hacerlos de todos modos, como tarea del sistema de auth con verificación en `/login` y en el login de ONG.
3. **D-3:** L-13 (campos) necesita que el usuario valide la hipótesis, porque no hay valor de referencia.
4. **D-4:** L-11 (fuentes): averiguar por qué `document.fonts` está vacío en `/login`. Si se debe a la carga diferida de Google Fonts, puede bastar con usar la familia en CSS para que se descargue.

## Cómo verificar (después de aplicar)

- Volver a ejecutar el script de captura con los 3 viewports y comparar con `login-computed.json`: `lpRoot: true`, `body` en `#090d14`, botón `rgb(81,157,252)` con texto `rgb(9,13,20)`, tarjeta con radio 18 y sin `backdrop-filter`.
- Tab por los campos: cada uno con `outline` 3 px azul visible. El botón de mostrar contraseña debe ser alcanzable.
- Con `reducedMotion: 'reduce'`: ninguna capa cambia de `transform` entre t0 y t+1,5 s.
- Contrastes: botón ≥ 4,5:1, pie ≥ 4,5:1 e icono del ojo ≥ 3:1.
- Verificación funcional **por el usuario o con cuentas de prueba**: inicio de sesión correcto con redirección a `/ong/app`, error de credenciales, MFA. Además, el login de ONG (`/ong/...`) sin cambios visuales si no se tocó `CoreLogin`.
- `guard-changes.mjs verify`: ningún archivo fuera de lo autorizado. `npm test` y `npm run test:web`.

## Decisiones pendientes del usuario

1. **¿`/login` adopta el sistema `.lp`?**
   - **A (recomendada):** sí, solo presentación. Quitar `/login` de `excludedRoutes` y añadir a la allowlist `src/pages/login/` y `src/app/LoginGateway.tsx` (el primero sale de `protectedSourcePaths`; el segundo también, como excepción concreta, dejando `src/app/` protegido para todo lo demás).
   - **B:** no. Se queda en el sistema anterior y solo se arreglan los defectos de accesibilidad (L-01..L-04) como tarea del sistema.
2. **¿Se autoriza tocar `CoreLogin` para los arreglos de accesibilidad?** Impacta el login de ONG.
3. **Estilo de los campos (L-13):** sin referencia en el landing. Hay que elegir entre radio 8 (panel) o 16 (control) y el fondo.
