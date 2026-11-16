# SUMMARY — Etiquetas sin cortar en la demo del landing

**Qué se hizo.** Se corrigieron todos los textos que aparecían cortados con «…» en la composición ilustrativa del landing:
- La columna «Etapas» del hero en móvil.
- La etapa «Registro de horas», que no cabía a ningún ancho. Ahora se llama «Horas».
- Los bloques de la línea de tiempo compacta.
- El título «Huerto comunitario» de la tarjeta de funciones a 1440.
- La estadística «%72%».

**Por qué.** El usuario detectó en móvil que «Convocatoria», «Planificación» y «Registro de horas» salían cortadas. Al medir aparecieron más casos a 768 y 1440. Se eligió pulir la composición en vez de usar capturas reales de `/ong`, porque el estilo de `/ong` no encaja con el landing y la arquitectura va a cambiar.

**Beneficio.** La demo se lee completa en móvil, tablet y escritorio, sin cambiar tamaños ni layout donde ya funcionaba.

**Funcionalidades afectadas.** Solo el landing público: la ventana de demo y las tarjetas de funciones.

**Verificación.**
- 0 textos cortados a 390, 768 y 1440, y sin scroll horizontal.
- Guard: PASS.
- `NODE_ENV=production vite build`: OK en 11 min 28 s. El CSS de producción conserva las reglas nuevas.
- `npm run test:web`: 101/101 archivos, 535/535 tests.
