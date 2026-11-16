# SUMMARY — Tema unificado y Panel principal ONG

## Qué se hizo
- **Fase 1:** el tema de `/ong` pasa a tener una sola fuente de verdad (`SettingsContext`, persistido en `profiles.preferences` + caché local). El `ThemeProvider` de ONG deriva de ahí, el botón del Topbar usa esa misma ruta, y los tokens/clases del Panel principal siguen al tema activo.
- **Fase 2:** se repararon 67 líneas con texto corrupto en el Panel, la agenda muestra el número real de voluntarios asignados y la hora real, el gráfico dice «últimos 7 días» y el autocompletado respeta el tema.

## Por qué
La auditoría `docs/audits/AUDIT-ong-ui-2026-11-16.md` mostró tres sistemas de tema desincronizados: el botón claro/oscuro no hacía nada visible, el Panel salía negro con letras oscuras, y la preferencia guardada del usuario nunca se aplicaba.

## Beneficio
- El cambio claro/oscuro funciona y se recuerda entre recargas y sesiones.
- El Panel es legible en ambos modos.
- Los datos de la agenda son verdaderos.
- Los textos se muestran sin caracteres rotos.

## Funcionalidades afectadas
- Topbar (botón de tema) en `/ong`.
- Panel principal: KPIs, gráfico, agenda, feed, accesos directos y modales.
- Ajustes de apariencia.
- Autocompletado de formularios.
- Preferencias compartidas con root/EDUC (caché `democra.settings.v1`).
- `MfaChallenge` en `/login` ahora respeta la preferencia guardada.

## Verificación
| Comprobación | Resultado |
|---|---|
| Prueba en vivo (org demo, 1440×900) | Toggle claro↔oscuro OK; persistencia tras recarga OK; BD actualizada; agenda «07:53 · 3 voluntarios asignados»; 0 errores de consola |
| `npm run test:web` (Vitest) | **101/101 archivos, 535/535 tests OK** |
| Build de producción (`NODE_ENV=production vite build`) | **OK** (exit 0; solo el aviso habitual de chunks > 500 kB) |
| `npm test` (Jest, backend) | 29/33 suites, 369/369 tests OK. Las **4 suites que fallan son preexistentes y ajenas a este cambio**: imports rotos en `server/` (`../config.js`, `../supabase.js`, `./payments/stripe.js`); este cambio no toca `server/`. |
