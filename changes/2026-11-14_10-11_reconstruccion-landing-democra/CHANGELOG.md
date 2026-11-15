# Changelog — reconstrucción de landing pública

- **Fecha y hora:** 2026-11-14 10:11 (America/Lima)
- **Objetivo:** adaptar la landing pública de Democra a la composición editorial y oscura observada en swashmotion.com.
- **Contexto:** la landing anterior concentraba un hero y ocultaba las secciones secundarias; incluía claims de prueba social sin verificación y enlaces sin destino real.
- **Motivo:** producir una página completa, adaptable y más coherente, manteniendo la marca y las rutas existentes.
- **Solución:** crear una landing de componentes semánticos React con menú móvil, gráfico original en CSS, bloques de enfoque/proceso, FAQ y footer; documentar tokens y auditoría. Se actualizó la descripción Open Graph.
- **Riesgos identificados:** la comparación visual completa y la compilación de producción no pudieron terminar en este entorno; el peso de 4.58 MB corresponde a módulos del servidor de desarrollo y requiere medir el bundle final; los textos descriptivos deben validarse con negocio antes de publicación.
- **Impacto esperado:** mejorar la jerarquía y presentación de la ruta `/` en escritorio y móvil.
- **Módulos afectados:** landing pública `src/pages/landing/` y metadato de `index.html` únicamente.
- **Dependencias:** ninguna agregada.
- **Posibles efectos secundarios:** el nuevo CSS globalmente importado desde la landing está encapsulado por `.dm-landing`; comprobar navegación a otras rutas.
- **Estado:** Parcial — implementación hecha; typecheck aislado, Playwright responsive básico y `git diff --check` pasan; el build global quedó sin finalizar, no se verificó el peso de producción y no se hizo push.
- **Reversión:** restaurar `src/pages/landing/LandingPage.tsx` e `index.html` y retirar `src/pages/landing/landing.css`, los documentos de auditoría y esta carpeta.
