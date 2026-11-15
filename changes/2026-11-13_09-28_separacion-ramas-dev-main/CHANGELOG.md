# Changelog: separación de ramas de desarrollo y producción

## Registro

- **Fecha:** 2026-11-13, 09:28, America/Lima.
- **Autor:** Codex, a solicitud del usuario.
- **Estado:** Parcial: rama `dev` creada y publicada; queda por verificar la Production Branch en Vercel y aplicar protección de ramas en GitHub.

## Objetivo

Separar la integración diaria de cambios de la rama que despliega producción, reduciendo el riesgo de publicar trabajo incompleto y los conflictos entre tareas paralelas.

## Contexto

El repositorio usaba `main` como rama local y remota predeterminada, y las instrucciones de `AGENTS.md` autorizaban push directo a `origin/main`. No existía `origin/dev`. El proyecto tiene `vercel.json` con rewrites y funciones, pero esa configuración no determina la Production Branch de Vercel. La carpeta `.vercel` no tiene `project.json` y el dashboard exige iniciar sesión.

## Solución implementada

- Se creó `dev` desde el `main` sincronizado con `origin/main` y se publicó como rama remota.
- Se definió `main` como rama reservada para producción y releases mediante PR desde `dev`.
- Se documentó el uso de ramas cortas `feature/`, `fix/` y `docs/`, PR hacia `dev`, y PR de release hacia `main`.
- Se actualizó la instrucción anterior de push directo a `origin/main` para que futuras tareas publiquen en ramas de trabajo/`dev`.
- Se indicó separar variables Vercel Production y Preview y proteger `main` en GitHub.

## Riesgos y pendientes

- No se pudo verificar si Vercel ya usa `main` como `Production Branch`: el dashboard abrió la pantalla de acceso de GitHub y no hay enlace Vercel autenticado en el checkout.
- No se configuró protección de rama en GitHub; debe habilitarse en la configuración del repositorio cuando haya acceso a sus settings.
- La rama `dev` nace del `main` actual; al inicio ambas ramas son iguales. En adelante, integrar las tareas en `dev` y hacer releases mediante PR.

## Impacto

- **GitHub:** nueva rama `dev` y nuevas reglas documentadas.
- **Vercel:** no se modificaron ajustes remotos. Objetivo documentado: `main` para Production y `dev`/ramas de tarea para Preview.
- **Código y base de datos:** sin cambios de producto, API, datos ni esquema.

## Reversión

Revertir el commit documental y, si fuera necesario, eliminar `dev` después de confirmar que no contiene trabajo exclusivo. No borrar `main` ni cambiar la Production Branch sin una revisión explícita.
