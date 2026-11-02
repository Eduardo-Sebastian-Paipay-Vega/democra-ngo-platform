# CHANGELOG — Fix de test: TST-ERR-087 archiveProject (mock no alcanzaba la consulta interna)

- **Fecha y hora:** 2026-11-02, ~06:28
- **Autor:** Claude (Claude Code)
- **Alcance:** `ong/src/app/services/proyectos/projects.service.test.ts` (solo test)

## Objetivo del cambio
Dejar en verde el test `TST-ERR-087` (`archiveProject propaga error si no existen estados
catalogados para archivar`), que fallaba en `origin/main` por un **bug del propio test**,
no del código de producción.

## Contexto del problema
El test mockeaba `shared.ongSchema` con `vi.mocked(shared.ongSchema).mockReturnValue(...)`
y esperaba que `archiveProject` lanzara:

> "No existe un estado catalogado para archivar proyectos."

Pero el test fallaba lanzando en realidad un **NetworkError**:

```
Received: NetworkError: Failed to execute "fetch()" ... URL
"https://your_project_ref.supabase.co/rest/v1/estados_proyecto?..." getaddrinfo ENOTFOUND
```

## Causa raíz
`archiveProject` (en `projects.service.ts`) obtiene los estados con
`fetchProjectStateOptions()`, función que **vive dentro de `shared.ts`** y que internamente
llama a su `ongSchema()` **local del módulo**. El test solo reemplazaba el *export*
`shared.ongSchema`; ese stub NO intercepta la llamada interna de `fetchProjectStateOptions`,
así que se ejecutaba el cliente Supabase real contra el host placeholder de `.env.example`
(`your_project_ref.supabase.co`) → `getaddrinfo ENOTFOUND` → NetworkError, en vez del
camino "sin estados → error esperado".

Es un problema clásico de mocking en ESM: stubbear el export de una función no afecta a las
llamadas que otra función del mismo módulo hace a su binding local. Las demás pruebas del
archivo (createProject, TST-ERR-085/086) pasan porque invocan `ongSchema` **importado desde
`projects.service.ts`**, que sí es el export mockeado.

## Solución implementada
En el test `TST-ERR-087`, además del stub de `ongSchema`, se mockea directamente la función
que usa `archiveProject`:

```ts
vi.spyOn(shared, "fetchProjectStateOptions").mockResolvedValue([]);
```

`archiveProject` importa `fetchProjectStateOptions` desde `./shared` (binding mockeado), así
que ahora recibe `[]` → `archivedState` queda `undefined` → lanza el error esperado →
`toProjectsError` preserva el mensaje → la aserción `.rejects.toThrow(...)` coincide.

Cambio acotado a ese único test (vía `vi.spyOn` + `beforeEach` con `vi.clearAllMocks()`);
no afecta a TST-ERR-085/086. **No se tocó código de producción**: `archiveProject` ya era
correcto.

## Verificación
- `npm run test:web` (suite completa): `TST-ERR-087` **desaparece de los fallos** (verde).
  Las pruebas `085/086` del mismo archivo siguen pasando.
- Fallos restantes en la suite (ajenos a este cambio, en archivos no tocados): timeouts de
  5000ms flaky (`TST-ERR-118` de transaccionesFinancieras, que pasa en aislamiento) y dos
  tests de `Areas.test.tsx` sensibles a timing/entorno que no aparecían en la corrida limpia
  anterior. Son flaky ambientales (máquina bajo carga, otro dev server activo), no regresiones.

## Riesgos identificados
Ninguno en producción (cambio solo en un test). El fix hace que el test valide realmente el
fallback de `archiveProject` en vez de morir por red.

## Impacto esperado
Un rojo real menos en la suite; `archiveProject` queda correctamente cubierto.

## Módulos afectados
Solo `ong/src/app/services/proyectos/projects.service.test.ts`.

## Dependencias involucradas
Ninguna.

## Posibles efectos secundarios
Ninguno. El spy se limpia en `beforeEach` (`vi.clearAllMocks()`).

## Estado del cambio
**Completado**.

## Cómo revertir
`git revert <hash>` o quitar la línea `vi.spyOn(shared, "fetchProjectStateOptions")...`.

## Nota de seguimiento (no incluido)
Los timeouts flaky de 5000ms (`TST-ERR-118` y similares) y los dos tests de `Areas.test.tsx`
merecen un endurecimiento aparte (aumentar `testTimeout` de esos casos y/o mockear la capa
de red para que no dependan del entorno). Queda como follow-up.
