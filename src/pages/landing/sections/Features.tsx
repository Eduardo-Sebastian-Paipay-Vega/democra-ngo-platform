import type { ReactNode } from "react";
import { IconUsers } from "./Icons";
import { ApprovalPanel, ProjectScreen, TimelinePanel } from "./DemoParts";

interface FeatureCardProps {
  title: string;
  children: ReactNode;
  visual: ReactNode;
  visualLabel: string;
  wide?: boolean;
}

function FeatureCard({ title, children, visual, visualLabel, wide = false }: FeatureCardProps) {
  return (
    <article className={`lp-card lp-feature${wide ? " lp-feature-wide" : ""}`} data-reveal>
      <div className="lp-feature-copy">
        <h3 className="lp-h2">{title}</h3>
        <p>{children}</p>
      </div>
      <div className="lp-canvas" role="img" aria-label={visualLabel}>{visual}</div>
    </article>
  );
}

export function Features() {
  return (
    <section className="lp-section" id="funciones" aria-labelledby="lp-features-title">
      <div className="lp-container">
        <h2 id="lp-features-title" className="lp-h1 lp-center" data-reveal>
          Organiza. Coordina. <span className="lp-accent-deep">Decide.</span>
        </h2>

        <div className="lp-feature-grid">
          <FeatureCard
            title="Ordena a tu equipo."
            visualLabel="Ilustración: selector de área sobre la ficha de un proyecto"
            visual={
              <div className="lp-canvas-team">
                <div className="lp-glass">
                  <IconUsers size={14} />
                  <span>Área: Ambiente</span>
                  <small>24 miembros</small>
                </div>
                <div className="lp-framed"><ProjectScreen variant="card" /></div>
              </div>
            }
          >
            Registra voluntarios, organiza áreas y asigna roles con permisos claros. Cada persona sabe
            dónde está y qué le toca, desde la admisión hasta su carné.
          </FeatureCard>

          <FeatureCard
            title="Coordina cada actividad."
            visualLabel="Ilustración: línea de tiempo con las etapas de una actividad"
            visual={
              <div className="lp-canvas-timeline">
                <TimelinePanel weeks={6} playhead={0.38} activeTrack={1} compact showZoom />
              </div>
            }
          >
            Planifica proyectos, actividades y tareas en una línea de tiempo. Registra asistencia y horas
            de voluntariado sin depender de hojas de cálculo sueltas.
          </FeatureCard>

          <FeatureCard
            wide
            title="Decisiones con respaldo."
            visualLabel="Ilustración: panel de aprobación sobre la ficha de un proyecto"
            visual={
              <div className="lp-canvas-approval">
                <ProjectScreen />
                <ApprovalPanel status="En revisión" />
              </div>
            }
          >
            Solicitudes, gastos y horas pasan por aprobaciones con historial. La bitácora de auditoría
            deja constancia de quién decidió qué y cuándo, para que tu organización rinda cuentas con
            tranquilidad.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
