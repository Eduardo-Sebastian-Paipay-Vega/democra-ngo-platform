# CHANGELOG

- Fecha y hora: 2026-11-15 10:14 (America/Lima)
- Autor: Codex
- Objetivo: actualizar el contacto de la landing y acelerar el inicio de consultas por WhatsApp.
- Contexto: el modal mostraba un correo de ejemplo, QR placeholder y textos con codificación incorrecta. El acceso a WhatsApp llevaba un mensaje genérico y no permitía indicar el motivo de contacto.
- Motivo: dar datos vigentes y permitir que clientes preparen una consulta clara antes de abrir WhatsApp.
- Solución implementada: correo `democra.emp@gmail.com`; formulario con motivo y detalle opcional; URL `wa.me` con mensaje URL-encoded; QR SVG dinámico que contiene el mismo enlace; correo `mailto:` y copia al portapapeles; estilos adaptados a móvil y corrección del texto visible.
- Riesgos identificados: el número `+51 953 714 752` se conserva del contacto anterior y no fue confirmado como dispositivo activo; la apertura final depende de que el usuario tenga WhatsApp o WhatsApp Web disponible.
- Impacto esperado: menos pasos para iniciar consultas y mensaje inicial más claro.
- Módulos afectados: modal de contacto de landing.
- Dependencias involucradas: `qrcode.react` ya estaba instalado; no se añadieron dependencias.
- Posibles efectos secundarios: la opción de tema seleccionada y el texto opcional se incorporan al contenido prellenado que el usuario podrá revisar antes de enviar.
- Estado del cambio: implementación completada; validación estática pendiente de build debido a demora de Vite en `transforming...`.
- Reversión: restaurar `src/pages/landing/ContactModal.tsx` y `src/pages/landing/contact-modal.css` al estado anterior.
