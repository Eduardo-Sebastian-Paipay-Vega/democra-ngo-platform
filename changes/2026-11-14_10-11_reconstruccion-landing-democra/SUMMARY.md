# Resumen ejecutivo

Se reconstruyó la landing pública de Democra con un lenguaje editorial de fondo oscuro, tipografía grande, acento azul, navegación compacta, tarjetas, bloque de llamada a la acción, preguntas desplegables y pie de página.

Se adaptó la estructura observada en Swash sin reutilizar su marca, textos, imágenes, plantillas, tipografías ni precios. Las visualizaciones del hero se implementaron en HTML/CSS propios. El cambio afecta únicamente la ruta pública raíz y su metadata.

El typecheck aislado del componente, `git diff --check` y una comprobación Playwright en cuatro viewports pasan. El build global quedó sin finalizar y se interrumpió; tampoco se pudo medir el bundle de producción ni completar la comparación visual. Por eso el cambio permanece parcial y no se hizo commit ni push.
