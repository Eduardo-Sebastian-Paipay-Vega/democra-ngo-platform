# PAGE-INVENTORY — Democra (landing pública)

- **Generado:** 2026-11-15, por `/landing-recopilar` (solo lectura).
- **Repo:** `D:\espelo`, rama `feature/landing-publica`, HEAD `7e7ae0d`.
- **Stack detectado:** React 18 + `react-router` (`createBrowserRouter` en `src/App.tsx`), Vite 6 MPA (`index.html`, `ong/`, `educ/`) y Tailwind v4 vía `@tailwindcss/vite`. El landing **no usa Tailwind**: usa CSS propio acotado bajo `.lp`.
- **Servidor usado para las evidencias:** `http://localhost:5173` (Vite dev; respondió HTTP 200 durante esta ejecución).

## Rutas

| Ruta | Clasificación | Fuente | Sistema visual | Evidencia |
|---|---|---|---|---|
| `/` | **Pública, marketing, referencia** | `src/App.tsx:7` → `src/pages/landing/LandingPage.tsx` | Sistema `.lp` (este documento) | `evidence/home-{desktop,tablet,mobile}.{png,json}`, `evidence/states-home.json` |
| `/nosotros` | Pública, marketing, **no alineada** | `src/App.tsx:18` (lazy) → `src/pages/nosotros/NosotrosPage.tsx` | Sistema **anterior**: Tailwind en línea, `motion/react`, acentos `#0055FF` / `#7000FF`, fondo claro/negro. No importa `landing.css` | `evidence/-nosotros-{desktop,tablet,mobile}.{png,json}` |
| `/login` | **Sistema autenticado (excluida)** | `src/App.tsx:11` → `src/pages/login/LoginPage.tsx` | — | No se capturó |
| `*` | Redirige a `/` | `src/App.tsx:25` | — | — |
| `/ong/*`, `/educ/*` | Sistema interno (entradas Vite separadas) | `ong/`, `educ/` | — | No se tocó |

Los destinos que el landing enlaza sin ser parte de él son `/login`, `/ong/create`, `/ong/join` y `/ong/signup`. Son flujos del sistema y **no forman parte del alcance visual**.

## Archivos fuente del landing de referencia

| Archivo | Rol |
|---|---|
| `src/pages/landing/LandingPage.tsx` | Composición, marco, skip link, revelado y `ContactModal` diferido |
| `src/pages/landing/landing.css` | Todo el sistema visual: tokens `--lp-*` (líneas 7-55), componentes y media queries |
| `src/pages/landing/sections/*.tsx` | SiteHeader, BrandMark, Hero, ProductDemo, DemoParts, AudienceStrip, Features, Access, Faq, SiteFooter (+FinalCta), Icons y useReveal |
| `index.html` (líneas 23-27) | Carga de Inter Tight y JetBrains Mono desde Google Fonts. **Compartido con toda la app SPA** |
| `public/brand/d-core-neon.png` | Monograma de la marca (`BrandMark.tsx`) |
| `src/pages/landing/ContactModal.tsx` + `contact-modal.css` | Modal de contacto. **Compartido** (ver acoplamientos) |

## Acoplamientos y riesgos

1. **`src/pages/landing/components/*` NO está muerto.** El landing ya no lo usa, pero lo importan:
   - `src/core/shell/PublicLayout.tsx:3-6`: `GradientBackground`, `CursorSpotlight`, `Navbar` y `Footer`.
   - `src/app/LoginGateway.tsx:2`: `GradientBackground`.

   Está dentro de `src/pages/landing/`, pero lo usa el sistema/login. **Debe quedar protegido.** No se debe autorizar `src/pages/landing/` como carpeta completa.
2. **`ContactModal.tsx` es compartido** con `src/core/shell/PublicLayout.tsx:7`. Cambiar su estilo afecta otras superficies públicas o del sistema. Protegerlo salvo autorización explícita.
3. **`index.html` es compartido** por la SPA raíz (landing, login y nosotros). Las fuentes que carga afectan a todas.
4. **`landing.css` se importa globalmente** al cargar `LandingPage`, pero todos los selectores están bajo `.lp`/`lp-*`, con resets en `:where(.lp)`. Su riesgo de fuga es bajo.
5. `/nosotros` no comparte componentes con el landing. Alinearla requeriría reescribir su página, y eso queda para `/landing-auditar`.

## Decisión del usuario (2026-11-15)

El usuario respondió «Sí, alinearla»: `/nosotros` **debe adoptar el sistema `.lp`**. La allowlist y las rutas protegidas de abajo **ya se aplicaron en `scope.json`**.

## Allowlist (aplicada en `scope.json`)

```json
"allowedSourcePaths": [
  "src/pages/landing/LandingPage.tsx",
  "src/pages/landing/landing.css",
  "src/pages/landing/sections/",
  "src/pages/nosotros/NosotrosPage.tsx"
]
```

Añadir a `protectedSourcePaths`:

```json
"src/pages/landing/components/",
"src/pages/landing/ContactModal.tsx",
"src/pages/landing/contact-modal.css",
"src/core/shell/",
"index.html"
```

`src/pages/nosotros/NosotrosPage.tsx` entra en la allowlist por decisión del usuario. Una restricción para alinearla: `NosotrosPage` no puede reutilizar `components/Navbar` ni `components/Footer`, que son heredados y están protegidos. Debe usar `sections/SiteHeader` y `sections/SiteFooter`, e importar `landing.css` dentro de un contenedor `.lp`.
