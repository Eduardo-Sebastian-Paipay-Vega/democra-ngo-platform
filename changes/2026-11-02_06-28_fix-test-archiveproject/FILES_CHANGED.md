# FILES_CHANGED

## Modificados (1)

- `ong/src/app/services/proyectos/projects.service.test.ts`
  En el test `TST-ERR-087` se añadió, antes del `await expect(archiveProject(...))`:
  ```ts
  vi.spyOn(shared, "fetchProjectStateOptions").mockResolvedValue([]);
  ```
  con un comentario explicando por qué el stub de `ongSchema` no bastaba (la consulta
  ocurre dentro de `shared.ts`, sobre su `ongSchema` local, no sobre el export mockeado).

## NO modificados
- Código de producción: `archiveProject` / `fetchProjectStateOptions` ya eran correctos; no
  se tocó `projects.service.ts` ni `shared.ts`.

## Carpetas afectadas
- `ong/src/app/services/proyectos/`
