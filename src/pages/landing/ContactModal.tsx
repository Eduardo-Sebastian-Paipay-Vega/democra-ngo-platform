import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import "./contact-modal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_EMAIL = "democra.emp@gmail.com";
const WHATSAPP_NUMBER = "51953714752";
const TOPICS = [
  "Quiero conocer Democra",
  "Quiero una demostración",
  "Necesito una solución para mi organización",
  "Tengo una consulta o necesito soporte",
];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);
  const whatsappMessage = useMemo(() => {
    const details = message.trim();
    return `Hola, equipo Democra. ${topic}.${details ? ` ${details}` : ""}`;
  }, [message, topic]);
  const whatsappUrl = useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`,
    [whatsappMessage],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="democra-modal" role="presentation" onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}>
          <motion.div
            className="democra-modal__backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.div
            className="democra-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            <div className="democra-modal__head">
              <div className="democra-modal__kicker">Hablemos de tu proyecto</div>
              <button className="democra-modal__close" type="button" onClick={onClose} aria-label="Cerrar contacto">×</button>
            </div>
            <h2 className="democra-modal__title" id="contact-modal-title">¿Cómo podemos ayudarte?</h2>
            <p className="democra-modal__desc">Cuéntanos qué necesitas. WhatsApp abrirá el mensaje listo para revisar y enviar.</p>

            <div className="contact-premium">
              <div className="contact-premium__grid">
                <div className="contact-premium__block">
                  <div className="contact-premium__label">Correo de contacto</div>
                  <a className="contact-premium__value" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  <button className="contact-premium__hint contact-premium__copy" type="button" onClick={copyEmail}>
                    {copied ? "Correo copiado" : "Copiar correo"}
                  </button>
                </div>
                <div className="contact-premium__block">
                  <div className="contact-premium__label">WhatsApp de Democra</div>
                  <a className="contact-premium__value" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">+51 953 714 752</a>
                  <span className="contact-premium__hint">Se abrirá WhatsApp para que revises el mensaje antes de enviarlo.</span>
                </div>
              </div>

              <div className="contact-premium__form">
                <label className="contact-premium__label" htmlFor="contact-topic">¿Sobre qué quieres conversar?</label>
                <select id="contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
                  {TOPICS.map((item) => <option key={item}>{item}</option>)}
                </select>
                <label className="contact-premium__label" htmlFor="contact-message">Agrega detalles (opcional)</label>
                <textarea id="contact-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} rows={3} placeholder="Por ejemplo: somos una organización de 20 voluntarios y queremos ordenar nuestros proyectos." />
                <div className="contact-premium__form-footer"><span>{message.length}/500</span><a className="dm-btn dm-btn--solid" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continuar por WhatsApp</a></div>
              </div>

              <div className="contact-premium__qrRow">
                <div className="contact-premium__qr" aria-label="Código QR para abrir WhatsApp con el mensaje seleccionado">
                  <QRCodeSVG value={whatsappUrl} size={144} level="M" includeMargin bgColor="#ffffff" fgColor="#10131a" />
                </div>
                <div className="contact-premium__cta">
                  <div className="contact-premium__title">¿Prefieres usar tu celular?</div>
                  <div className="contact-premium__text">Escanea el QR y se abrirá WhatsApp con el tema y el mensaje preparados. Podrás revisarlo antes de enviarlo.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
