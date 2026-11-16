# SUMMARY — r3f 8 y drei 9, compatibles con React 18

**Qué se hizo.** Se bajó `@react-three/fiber` de 9 a 8.18 y `@react-three/drei` de 10 a 9.122. El código no cambió.

**Por qué.** Las versiones 9 y 10 exigen React 19 y el proyecto usa React 18. En el build de producción, el código 3D se ejecutaba al arrancar cualquier página, porque está en el chunk `vendor` compartido, y dejaba toda la web en blanco. Esto bloqueaba el deploy del landing nuevo. El fallo existía en `main` desde el 2026-08-22, pero no se veía porque Vercel cancela todos los deploys desde git.

**Beneficio.** El build de producción vuelve a funcionar: `/`, `/login`, `/nosotros`, `/ong` y `/educ` cargan sin errores. Se puede desplegar `main`.

**Funcionalidades afectadas.** La demo 3D de EduOS (`/educ/demo-3d`), cuya prueba sigue pendiente porque requiere sesión, y el chunk `vendor` de todas las apps.
