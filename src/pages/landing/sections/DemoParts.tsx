import type { CSSProperties } from "react";
import { IconCalendar, IconCheck, IconClock, IconClose, IconMinus, IconPlus, IconUsers } from "./Icons";

/*
 * Piezas de interfaz ilustrativa de Democra. Son decorativas: se agrupan
 * con role="img" + aria-label en el contenedor que las usa, por lo que su
 * contenido no se anuncia elemento por elemento.
 */

type Tone = "green" | "blue" | "amber";

export const TIMELINE_TRACKS: { label: string; tone: Tone; icon: typeof IconUsers }[] = [
  { label: "Convocatoria", tone: "green", icon: IconUsers },
  { label: "Planificación", tone: "blue", icon: IconCalendar },
  { label: "Jornada", tone: "blue", icon: IconCalendar },
  { label: "Registro de horas", tone: "amber", icon: IconClock },
];

/** start y size en fracción del ancho total de la línea de tiempo. */
const BLOCKS: { track: number; start: number; size: number }[] = [
  { track: 0, start: 0.0, size: 0.13 },
  { track: 1, start: 0.16, size: 0.16 },
  { track: 2, start: 0.32, size: 0.2 },
  { track: 3, start: 0.52, size: 0.09 },
];

interface TimelineProps {
  weeks?: number;
  playhead?: number;
  activeTrack?: number;
  compact?: boolean;
  showZoom?: boolean;
}

export function TimelinePanel({ weeks = 16, playhead = 0.45, activeTrack = 2, compact = false, showZoom = false }: TimelineProps) {
  const style = { "--lp-weeks": weeks, "--lp-playhead": playhead } as CSSProperties;
  return (
    <div className={`lp-timeline${compact ? " is-compact" : ""}`} style={style}>
      <div className="lp-timeline-tracks">
        <div className="lp-panel-label">
          <span>Etapas</span>
          <IconPlus size={14} />
        </div>
        <ul>
          {TIMELINE_TRACKS.map((t, i) => (
            <li key={t.label} className={i === activeTrack ? "is-active" : undefined}>
              <i className={`lp-dot lp-dot-${t.tone}`} />
              {t.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="lp-timeline-grid">
        <div className="lp-timeline-ruler">
          {Array.from({ length: weeks }, (_, i) => (
            <span key={i}>S{String(i + 1).padStart(2, "0")}</span>
          ))}
        </div>
        <div className="lp-timeline-rows">
          {BLOCKS.map((b, i) => {
            const t = TIMELINE_TRACKS[b.track];
            const Icon = t.icon;
            return (
              <div
                key={i}
                className={`lp-block lp-block-${t.tone}${b.track === activeTrack ? " is-active" : ""}`}
                style={{ left: `${b.start * 100}%`, width: `${b.size * 100}%`, top: `calc(${b.track} * var(--lp-row))` }}
              >
                <Icon size={12} />
                <span>{t.label}</span>
              </div>
            );
          })}
        </div>
        <div className="lp-playhead">
          <span>Hoy</span>
        </div>
        {showZoom && (
          <div className="lp-timeline-zoom">
            <IconMinus size={14} /> <span>100%</span> <IconPlus size={14} />
            <i><b /></i>
          </div>
        )}
      </div>
    </div>
  );
}

interface ApprovalProps {
  status?: string;
}

export function ApprovalPanel({ status = "Pendiente" }: ApprovalProps) {
  return (
    <div className="lp-approval">
      <div className="lp-panel-label">
        <span>Aprobación</span>
        <span className="lp-approval-status"><i />{status}</span>
      </div>
      <div className="lp-approval-progress"><b /></div>
      <div className="lp-approval-actions">
        <span className="lp-ctrl" title="Rechazar"><IconClose size={16} /></span>
        <span className="lp-ctrl" title="Observar"><IconMinus size={16} /></span>
        <span className="lp-ctrl" title="Revisar"><IconClock size={16} /></span>
        <span className="lp-ctrl lp-ctrl-primary" title="Aprobar"><IconCheck size={18} /></span>
      </div>
      <div className="lp-panel-label lp-panel-label-spaced"><span>Estado</span></div>
      <small>Tipo</small>
      <Segmented options={["Horas", "Gasto", "Ingreso"]} active={0} />
      <small>Prioridad</small>
      <Segmented options={["Baja", "Media", "Alta"]} active={1} />
    </div>
  );
}

export function Segmented({ options, active }: { options: string[]; active: number }) {
  return (
    <div className="lp-segmented">
      {options.map((o, i) => (
        <span key={o} className={i === active ? "is-active" : undefined}>{o}</span>
      ))}
    </div>
  );
}

/** Pantalla de proyecto en miniatura, usada dentro de los lienzos. */
export function ProjectScreen({ variant = "wide" }: { variant?: "wide" | "card" }) {
  return (
    <div className={`lp-screen lp-screen-${variant}`}>
      <div className="lp-screen-top">
        <span>Proyectos</span><span>Voluntarios</span><span>Horas</span>
        <b>D</b>
        <em>Nuevo</em>
      </div>
      <div className="lp-screen-body">
        <span className="lp-screen-kicker">Proyecto activo</span>
        <strong>Huerto<br />comunitario</strong>
        <div className="lp-screen-bars">
          <i style={{ width: "78%" }} /><i style={{ width: "54%" }} /><i style={{ width: "66%" }} />
        </div>
        <div className="lp-screen-avatars"><i /><i /><i /><i /><b>+</b></div>
      </div>
    </div>
  );
}
