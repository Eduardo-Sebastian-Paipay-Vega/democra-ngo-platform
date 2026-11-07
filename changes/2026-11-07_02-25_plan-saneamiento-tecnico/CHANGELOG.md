# CHANGELOG — Plan de saneamiento técnico

- **Fecha y hora:** 2026-11-07 02:25 UTC
- **Autor:** Claude (Claude Code)
- **Estado:** Completado (documento). La implementación de las fases está **Pendiente**.

## Objetivo
Dejar versionado un plan de implementación verificado para estabilizar la puerta de calidad
(tipos, tests, CI), eliminar la duplicación del módulo ONG y sanear configuración, repositorio,
base de datos y dependencias.

## Contexto del problema
La evaluación del repositorio en `b983aa7` midió: 6 errores de `tsc`, 5/33 suites Jest
fallidas, 70/101 archivos Vitest fallidos sin `.env`, 122 accesos de red reales en tests,
ausencia de CI, dos copias divergentes del módulo ONG (351 diferencias) y 356 archivos
versionados que `.gitignore` excluye.

## Motivo de la modificación
El usuario pidió verificar el plan propuesto en el chat y dejarlo en `.md` dentro del repo.

## Solución implementada
Se creó `docs/PLAN_SANEAMIENTO.md`. Antes de redactarlo se verificó cada afirmación:
- Sourcemap de `vite build --sourcemap`: el chunk `ong-*.js` contiene 197 módulos de
  `src/modules/ong`; el router de `/ong` renderiza `ong/src`; hay 2 contextos de tenant.
- Diagnóstico de `verify-otp` (500): instrumentación temporal del `catch` en
  `server/routes/auth.js`, revertida inmediatamente (`git status` limpio). Resultado: bug
  de producción — `EmailService.sendAlert` lanza síncronamente y evade el `.catch`.
- `grep` de consumidores de `encryptAes256`: ninguno.
- `depcheck` + `grep`: 15 dependencias y 2 devDependencies sin uso.
- Supabase advisors `security`: 0 lints. `list_migrations`: timeout (no verificado).

El plan incorpora 5 correcciones respecto de la versión preliminar del chat (sección 8).

## Riesgos identificados
Ninguno en ejecución: solo documentación. Riesgos de cada fase se documentan en el plan.

## Impacto esperado
Hoja de ruta trazable para las fases F1–F8 y decisiones D1–D5.

## Módulos afectados
Ninguno en código. Documentación: `docs/`.

## Dependencias involucradas
Ninguna añadida ni modificada.

## Posibles efectos secundarios
Ninguno.

## Reversión
`git revert <commit>` o eliminar `docs/PLAN_SANEAMIENTO.md` y esta carpeta.
