# Resumen ejecutivo — landing con composición Viewport

**Qué se hizo.** Se reconstruyó la landing pública (`/`) siguiendo la composición de viewport.theresonance.studio: marco de página azul, nav en píldora, hero centrado, ventana de aplicación ilustrativa, franja en bucle, tres tarjetas de funciones, bloque de acceso, FAQ, CTA final y footer en placa. La marca, los textos y las ilustraciones son propios de Democra, construidos en HTML/CSS sin recursos de terceros.

**Por qué.** La landing anterior ocultaba la mayoría de sus secciones por contener datos simulados. Se pidió una base nueva y completa con alta fidelidad a la referencia, conservando los botones funcionales.

**Beneficio.** Una página pública completa, responsive y accesible (navegación por teclado, menú y acordeón con ARIA, `prefers-reduced-motion`), sin claims inventados y con tokens de diseño documentados y trazables.

**Funcionalidades afectadas.** Solo la ruta `/`. Se mantienen: Iniciar sesión, Crear organización, Canjear código ACE, Ser voluntario y Contacto (modal existente). No hay cambios de backend.

**Pendiente.** Verificar `npm run build` fuera de este entorno: Vite se bloquea aquí por un problema previo al cambio. Hasta entonces no se sube a `origin/main`.
