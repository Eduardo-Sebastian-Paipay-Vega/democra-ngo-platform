# SUMMARY — Fases F1 y F2 del plan de saneamiento

**Qué se hizo:** se dejó la puerta de calidad en verde y reproducible (tipos 0 errores, Jest
415/415, Vitest 535/535 sin `.env` ni red, build OK), se creó el CI, se corrigió un bug de
producción en el login 2FA, se restauró una validación de tenant perdida en un refactor y se
eliminaron los secretos por defecto en producción.

**Por qué:** los tests fallaban por configuración y no por el código, ocultando dos defectos
reales (500 en `verify-otp` y la pérdida de `TEN-003`); y la API podía arrancar en
producción con un pepper público.

**Beneficio:** cada PR se valida automáticamente; los fallos de tests vuelven a significar
algo; el login no se rompe si falla el correo; la configuración insegura impide el arranque.

**Funcionalidades afectadas:** `POST /api/auth/step-up/verify-otp` (solo robustez),
escrituras de `/api/iam` y `/api/sedes` (409 si `tenant_id` no es UUID), arranque de la API en
producción (exige `MFA_OTP_PEPPER`), export CSV de inscripciones en la copia gemela de ONG.
