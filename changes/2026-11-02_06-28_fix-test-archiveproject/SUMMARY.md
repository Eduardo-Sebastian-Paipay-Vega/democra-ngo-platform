# SUMMARY — Fix test TST-ERR-087 (archiveProject)

## Qué se hizo
Se corrigió el test `TST-ERR-087` de `projects.service.test.ts`, que fallaba en `origin/main`.
Se añadió `vi.spyOn(shared, "fetchProjectStateOptions").mockResolvedValue([])` para simular
"sin estados catalogados".

## Por qué se hizo
El test mockeaba `ongSchema`, pero `archiveProject` lee los estados vía
`fetchProjectStateOptions()`, que usa el `ongSchema` **interno de shared.ts** (no el export
mockeado). Resultado: se ejecutaba Supabase real contra el host placeholder y el test moría
con NetworkError en vez de validar el fallback. Era un bug del test, no del código.

## Qué beneficio aporta
- Un rojo real menos en la suite; `archiveProject` queda correctamente cubierto.
- No se tocó producción: `archiveProject` ya era correcto.

## Qué funcionalidades quedaron afectadas
Ninguna de producción. Solo el test. Verificado: TST-ERR-087 pasa; 085/086 siguen verdes.
Los rojos restantes son timeouts flaky + 2 tests de Areas sensibles al entorno, ajenos a
este cambio (ver CHANGELOG, nota de seguimiento).
