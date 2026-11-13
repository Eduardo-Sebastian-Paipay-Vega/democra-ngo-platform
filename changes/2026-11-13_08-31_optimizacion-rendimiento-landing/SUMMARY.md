# Resumen ejecutivo

Se redujo la carga inicial de la portada para que las páginas de Login y Nosotros, el modal de contacto y el proveedor global de preferencias no se ejecuten desde el primer render cuando el visitante permanece en el landing.

El cambio responde al diagnóstico de producción: el sitio transfirió entre 0,83 y 0,94 MB en cargas frías y tardó alrededor de 6 segundos en el perfil móvil simulado. El código diferido usa dependencias existentes, no cambia el CRUD ni la base de datos y conserva sin cambios la aplicación `/ong/`.

Las funcionalidades afectadas son el enrutamiento `/login` y `/nosotros`, el arranque de la web principal y la apertura del modal de contacto. La verificación quedó limitada por bloqueos de Vite y timeouts de workers Vitest; se requiere un build funcional y una prueba de producción antes de desplegar.
