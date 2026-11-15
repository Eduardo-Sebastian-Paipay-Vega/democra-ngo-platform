import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconFolder,
  IconLayout,
  IconLock,
  IconRefresh,
} from "./Icons";
import { ApprovalPanel, ProjectScreen, TimelinePanel } from "./DemoParts";

/** Ventana de aplicación ilustrativa bajo el hero (composición de la referencia). */
export function ProductDemo() {
  return (
    <section className="lp-demo-section" id="como-funciona" aria-label="Cómo funciona">
      <div className="lp-container">
        <div
          className="lp-demo"
          role="img"
          aria-label="Vista ilustrativa de Democra: un proyecto con su panel de aprobación y una línea de tiempo de etapas"
          data-reveal
        >
          <div className="lp-demo-lights" aria-hidden="true"><i /><i /><i /></div>

          <div className="lp-demo-bars">
            <div className="lp-bar lp-bar-org">
              <IconFolder size={14} />
              <span>Mi organización</span>
              <i />
            </div>
            <div className="lp-bar lp-bar-url">
              <IconArrowLeft size={14} />
              <IconArrowRight size={14} />
              <span className="lp-bar-sep" />
              <IconLock size={13} />
              <span>democra.pro/ong/proyectos</span>
              <IconRefresh size={14} className="lp-bar-end" />
            </div>
            <div className="lp-bar-stats">
              <div className="lp-bar lp-bar-stat"><small>A</small>06</div>
              <div className="lp-bar lp-bar-stat"><small>P</small>12</div>
              <div className="lp-bar lp-bar-stat"><small>%</small>72%</div>
            </div>
          </div>

          <div className="lp-demo-main">
            <div className="lp-demo-canvas">
              <ProjectScreen />
            </div>
            <aside className="lp-demo-side">
              <div className="lp-bar lp-bar-select">
                <IconLayout size={14} />
                <span>Proyectos</span>
                <small>Vista general</small>
                <IconChevronDown size={14} className="lp-bar-end" />
              </div>
              <ApprovalPanel />
            </aside>
          </div>

          <div className="lp-demo-timeline">
            <TimelinePanel showZoom={false} />
            <div className="lp-demo-settings">
              <div className="lp-panel-label"><span>Detalle</span></div>
              <div className="lp-settings-grid">
                <label>Inicio<span>03 mar</span></label>
                <label>Duración<span>2 sem</span></label>
                <label>Área<span>Ambiente</span></label>
                <label>Equipo<span>18</span></label>
                <label>Horas<span>126</span></label>
                <label>Estado<span>En curso</span></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
