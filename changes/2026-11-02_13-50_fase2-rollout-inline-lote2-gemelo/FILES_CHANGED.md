# FILES_CHANGED

## Modificados (27) — `src/modules/ong/app/pages/`
Cada línea migrada = anexar utilidad(es) `*-[var(--t-*)]` al `className` y eliminar
el `style={{…}}`. Nº = atributos migrados en ese archivo.

| Archivo                     | Migrados |
|-----------------------------|---------:|
| `Finance.tsx`               | 63 |
| `Activities.tsx`            | 52 |
| `AdmissionRequests.tsx`     | 48 |
| `Inventory.tsx`             | 46 |
| `Security.tsx`              | 28 |
| `SystemUsers.tsx`           | 26 |
| `Roles.tsx`                 | 25 |
| `NotificationTemplates.tsx` | 24 |
| `Attendance.tsx`            | 21 |
| `SoftDelete.tsx`            | 18 |
| `AdmissionDocuments.tsx`    | 18 |
| `Courses.tsx`               | 17 |
| `SensitiveAccess.tsx`       | 16 |
| `NotificationHistory.tsx`   | 16 |
| `MyProfile.tsx`             | 16 |
| `HoursApproval.tsx`         | 16 |
| `Approvals.tsx`             | 16 |
| `IdCards.tsx`               | 15 |
| `Areas.tsx`                 | 13 |
| `AdmissionInterviews.tsx`   | 11 |
| `AuditLog.tsx`              |  9 |
| `Catalogs.tsx`              |  8 |
| `AdmissionOnboarding.tsx`   |  7 |
| `MedicalRecords.tsx`        |  4 |
| `Volunteers.tsx`            |  3 |
| `Beneficiaries.tsx`         |  3 |
| `PlaceholderPage.tsx`       |  1 |
| **Total**                   | **540** |

## NO modificados (a propósito)
- `AccessControl.tsx`, `MyAccountSettings.tsx`: todas sus inline eran no migrables
  (objetos const / tags multilínea). 0 migraciones.
- 258 atributos inline quedan sin tocar (motivos en CHANGELOG).
- Árbol `ong/src/app/pages/` ya cubierto por el lote 1.

## Creados (auditoría)
- `changes/2026-11-02_13-50_fase2-rollout-inline-lote2-gemelo/CHANGELOG.md`
- `changes/2026-11-02_13-50_fase2-rollout-inline-lote2-gemelo/SUMMARY.md`
- `changes/2026-11-02_13-50_fase2-rollout-inline-lote2-gemelo/FILES_CHANGED.md`

## Carpetas afectadas
- `src/modules/ong/app/pages/`
- `changes/`
