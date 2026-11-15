# SUMMARY — `/login` con el sistema visual del landing

**Qué se hizo.** La pantalla de inicio de sesión ahora usa el sistema `.lp` del landing:

- Fondo degradado azul con marco.
- Tarjeta oscura con radio 18.
- Marca `democra.pro`.
- Título «Iniciar sesión» en Inter Tight.
- Botón azul `#519dfc` con texto oscuro.
- Enlaces de texto subrayados.

Solo se cambió la presentación: la lógica de autenticación y la redirección quedaron intactas.

**Por qué.** `/login` seguía con el diseño anterior (violeta, cristal, azul Tailwind, texto pequeño de bajo contraste) y el salto desde el landing era evidente. El usuario eligió alinearla, solo en presentación.

**Beneficio.**

- Continuidad de marca entre `/` y `/login`.
- Botón con contraste ≈7:1 (antes ≈3,7:1).
- Pie a 14 px con contraste AA.
- Foco de teclado visible en todos los controles.
- Sin animaciones de fondo, también para quien pide movimiento reducido.

**Funcionalidades afectadas.** Solo la vista de `/login`.

**Sin cambios:**

- El formulario (`CoreLogin`), la verificación MFA, la redirección post-login y el enlace de ayuda por WhatsApp.
- El login de ONG.

**Pendiente:** etiquetas, botón de mostrar contraseña y estilo de campos. Requieren tocar `CoreLogin`, que es compartido.
