import { useId, useState } from "react";
import { IconChevronDown } from "./Icons";

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "¿Qué es Democra?",
    a: "Democra es una plataforma para organizar el trabajo de organizaciones sociales: voluntarios, proyectos, actividades, horas, finanzas y aprobaciones en un mismo espacio.",
  },
  {
    q: "¿Para qué tipo de organizaciones está pensada?",
    a: "Para ONG, voluntariados, fundaciones, asociaciones y colectivos que coordinan personas y proyectos y necesitan orden y trazabilidad.",
  },
  {
    q: "¿Cómo creo el espacio de mi organización?",
    a: "Usa «Crear organización», completa los datos básicos y configura tus áreas. Después puedes invitar a tu equipo.",
  },
  {
    q: "¿Cómo me uno a una organización que ya usa Democra?",
    a: "Si tu organización te compartió un código ACE, canjéalo en «Canjear código ACE». Si quieres participar como voluntario, regístrate desde «Ser voluntario».",
  },
  {
    q: "¿Quién puede ver la información de mi organización?",
    a: "El acceso se controla con roles y permisos. Los datos sensibles tienen accesos específicos y las acciones importantes quedan registradas en la bitácora de auditoría.",
  },
  {
    q: "¿Puedo registrar las horas de los voluntarios?",
    a: "Sí. Las horas se registran por actividad y pasan por aprobación antes de contabilizarse.",
  },
  {
    q: "¿Cómo solicito una demostración?",
    a: "Escríbenos desde «Contacto» y te mostramos cómo podría funcionar en tu organización.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="lp-section" id="preguntas" aria-labelledby="lp-faq-title">
      <div className="lp-container lp-container-narrow">
        <h2 id="lp-faq-title" className="lp-h1 lp-center">
          Preguntas, <span className="lp-accent-light">respondidas.</span>
        </h2>
        <div className="lp-faq">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div className={`lp-faq-item${isOpen ? " is-open" : ""}`} key={item.q}>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <IconChevronDown size={16} />
                  </button>
                </h3>
                <div className="lp-faq-panel" id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}>
                  <div><p>{item.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
