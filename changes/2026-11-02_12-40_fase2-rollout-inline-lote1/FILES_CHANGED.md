# FILES_CHANGED

## Modificados (24) — `ong/src/app/pages/`
Cada línea migrada = anexar utilidad(es) `*-[var(--t-*)]` al `className` y eliminar
el `style={{…}}`. Nº = atributos migrados en ese archivo.

| Archivo                    | Migrados |
|----------------------------|---------:|
| `Finance.tsx`              | 81 |
| `AdmissionRequests.tsx`    | 58 |
| `Inventory.tsx`            | 55 |
| `Activities.tsx`           | 52 |
| `Security.tsx`             | 28 |
| `AdmissionDocuments.tsx`   | 27 |
| `NotificationHistory.tsx`  | 26 |
| `Approvals.tsx`            | 26 |
| `SystemUsers.tsx`          | 25 |
| `NotificationTemplates.tsx`| 25 |
| `Attendance.tsx`           | 21 |
| `AdmissionInterviews.tsx`  | 21 |
| `HoursApproval.tsx`        | 19 |
| `IdCards.tsx`              | 18 |
| `SoftDelete.tsx`           | 16 |
| `SensitiveAccess.tsx`      | 16 |
| `GlobalSearch.tsx`         | 16 |
| `Courses.tsx`              | 15 |
| `AdmissionOnboarding.tsx`  | 14 |
| `AuditLog.tsx`             |  9 |
| `Volunteers.tsx`           |  7 |
| `Login.tsx`                |  7 |
| `PlaceholderPage.tsx`      |  1 |
| `MedicalRecords.tsx`       |  1 |
| **Total**                  | **584** |

## NO modificados (a propósito)
- `Dashboard.tsx`, `AccessControl.tsx`, `Beneficiaries.tsx`: todas sus inline eran
  no migrables (tags multilínea / componentes / objetos const `INPUT_STYLE`,
  `tabStyle()`). 0 migraciones.
- `Areas.tsx`: ya migrada en el piloto (su único SKIP es el `Badge` documentado).
- 308 atributos inline en total quedan sin tocar (ver motivos en CHANGELOG).
- Árbol gemelo `src/modules/ong/app/pages/` no tocado (otro lote).

## Creados (auditoría)
- `changes/2026-11-02_12-40_fase2-rollout-inline-lote1/CHANGELOG.md`
- `changes/2026-11-02_12-40_fase2-rollout-inline-lote1/SUMMARY.md`
- `changes/2026-11-02_12-40_fase2-rollout-inline-lote1/FILES_CHANGED.md`

## Carpetas afectadas
- `ong/src/app/pages/`
- `changes/`
