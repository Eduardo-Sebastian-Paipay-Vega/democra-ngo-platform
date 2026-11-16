# CHANGELOG — `@react-three/fiber` 8 y `drei` 9, compatibles con React 18

- **Fecha y hora:** 2026-11-16 01:05 (America/Lima)
- **Autor:** Claude (Claude Code), por decisión del usuario («Bajar r3f a v8»)
- **Rama:** `fix/react-three-react18`, creada desde `dev`
- **Estado:** Completado. El build de producción y las rutas principales se verificaron en local. La demo 3D de EduOS no se probó porque requiere sesión

## Objetivo

Que el build de producción vuelva a funcionar. Con él, `main` se puede desplegar en Vercel con el landing nuevo.

## Contexto del problema

El 2026-11-15 se desplegó `main` (`c790fa9`) a producción con `vercel deploy --prod`. **Toda la SPA quedó en blanco**: `/`, `/login`, `/nosotros` y `/ong`. El error en consola fue:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'S')
    at n.exports (vendor-*.js) …
```

Se hizo rollback a `02042026-01-py-democra-onziir6s2`, el deploy de producción anterior, de unos 66 días.

**Causa raíz:**

1. El proyecto usa **React 18.3.1**. El 2026-08-22 (commit `4a5c6fd`, módulo `educ`) se instalaron `@react-three/fiber@^9.7.0` y `@react-three/drei@^10.7.8`, que **exigen React 19** (`npm ls` los marcaba `invalid`).
2. `@react-three/fiber` 9 trae empaquetado su propio reconciler de React y lo inicializa al evaluar el módulo. Para eso lee el objeto interno de React 19 (`__CLIENT_INTERNALS…`, propiedad `S`), que no existe en React 18.
3. `vite.config.js` (`manualChunks`) agrupa casi todo `node_modules` en un único chunk `vendor`, que cargan todas las páginas al arrancar. El código 3D, que solo usa `educ/src/components/3d/Scene3D.tsx`, se ejecutaba en cualquier página y rompía la app completa.

**Por qué no se detectó en casi 3 meses:**

- En desarrollo Vite no empaqueta así, y el problema no aparece.
- En Vercel, un «Ignored Build Step» configurado en el dashboard cancela todos los deploys desde git, incluidos los de producción. Desde que entró la dependencia no se había publicado ningún build de producción hasta este deploy manual.

## Solución implementada

- `@react-three/fiber` pasa de `^9.7.0` a **`^8.18.0`** (peer `react >=18 <19`).
- `@react-three/drei` pasa de `^10.7.8` a **`^9.122.0`** (peer `react ^18`, `@react-three/fiber ^8`).
- El código no cambia. `Scene3D.tsx` usa `Canvas`, `useFrame`, `OrbitControls`, `Environment`, `Float` y `Sparkles`, y todos existen con la misma API en r3f 8 / drei 9.

## Alternativas descartadas

- **Sacar three.js a un chunk propio (`vendor-three`):** se probó. Rollup colocó el helper de precarga de Vite (`vite/preload-helper`) dentro de ese chunk, y la app lo seguía importando al arrancar. Era un parche frágil que, además, dejaba la demo 3D rota. Se revirtió sin commit.
- **Subir React a 19:** afecta a toda la app y a muchas dependencias. Demasiado riesgo para un arreglo de producción.

## Verificación

- `npm ls react @react-three/fiber @react-three/drei`: sin dependencias `invalid`.
- `NODE_ENV=production npx vite build`: OK, en 20 min 51 s en esta máquina.
- `vite preview` del build, sin errores en consola:
  - `/` renderiza `.lp` (h1 «Gestión clara para tu organización.»).
  - `/login` renderiza `.lp-auth` (h1 «Iniciar sesión»).
  - `/nosotros` renderiza `.lp`.
  - `/ong/` renderiza.
  - `/educ/demo-3d` carga EduOS y redirige a su login.
- `tsc --noEmit` (incluye `src`, `ong/src` y `educ/src`): sin errores en archivos 3D.
- **No verificado:** el canvas 3D en `/educ/demo-3d`, porque requiere sesión en EduOS. No hay tests que cubran el 3D.

### Hallazgo local (no afecta a Vercel)

El `.env` local define `NODE_ENV=development` (línea 81). Un `npx vite build` local sin forzar `NODE_ENV=production` genera JSX de desarrollo (`jsxDEV`), y la página queda en blanco con `e.jsxDEV is not a function`. Para reproducir el build de Vercel en local hay que usar `NODE_ENV=production npx vite build`.

## Riesgos

- Cambio de versión mayor hacia atrás en dos dependencias 3D. Si alguien usó alguna API exclusiva de r3f 9 o drei 10, fallaría en la demo 3D. Hoy no la usa nadie: el único consumidor es `Scene3D.tsx`.
- `npm install` también actualizó transitivas en `package-lock.json` (unas 235 líneas).

## Impacto esperado

El build de producción vuelve a funcionar, se puede desplegar `main` con el landing nuevo y la demo 3D de `educ` debería funcionar por primera vez en producción.

## Módulos afectados

`educ` (demo 3D), y de forma indirecta todo el bundle de la SPA raíz y de `ong`, porque comparten el chunk `vendor`.

## Dependencias involucradas

`@react-three/fiber`, `@react-three/drei`, `three` (sin cambios, `^0.185.1`) y `react`/`react-dom` (sin cambios, 18.3.1).

## Posibles efectos secundarios

drei 9 puede emitir avisos de deprecación con `three` 0.185 en consola, pero no rompe el arranque.

## Pendiente

- Probar `/educ/demo-3d` con una cuenta de EduOS.
- Revisar el «Ignored Build Step» en el dashboard de Vercel. Mientras cancele todos los deploys de git, los fallos de build solo se ven al publicar a mano.

## Cómo revertir

```bash
git revert <este commit> && npm install
```
