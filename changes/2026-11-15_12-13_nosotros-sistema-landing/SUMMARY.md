# Resumen ejecutivo

**Qué se hizo:** `/nosotros` pasa a usar el mismo diseño que el landing. Tiene ahora el mismo marco, cabecera en píldora con menú móvil, títulos, tarjetas, botones, cierre y pie. Además:
- se corrigieron las tildes, que se mostraban corruptas en pantalla;
- se reformularon dos afirmaciones no verificadas.

**Por qué:** el usuario decidió alinear la página. La auditoría encontró 24 diferencias: 1 crítica (texto corrupto) y 11 altas, varias de ellas de accesibilidad (foco invisible, sin navegación móvil, contraste bajo).

**Beneficio:** una identidad coherente entre las páginas públicas, texto legible, navegación por teclado y en móvil, y respeto de `prefers-reduced-motion`.

**Qué cambia:** la página `/nosotros` entera. En el landing `/` no cambia nada visible: está verificado y las cabeceras y pies compartidos solo ganan props opcionales.
