import { Link } from "react-router";
import { IconArrowUpRight } from "./Icons";

interface HeroProps {
  onOpenContact: () => void;
}

export function Hero({ onOpenContact }: HeroProps) {
  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="lp-container lp-hero-inner">
        <h1 id="lp-hero-title" className="lp-display">
          Gestión clara para tu organización.
        </h1>
        <p className="lp-hero-lede">
          Coordina voluntarios, proyectos, actividades y aprobaciones en un solo lugar, con la
          trazabilidad que tu equipo necesita para decidir con confianza.
        </p>
        <a className="lp-btn lp-btn-lg lp-hero-cta" href="/ong/create">
          <IconArrowUpRight size={20} />
          Crear mi organización
        </a>
        <p className="lp-note">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          <span aria-hidden="true"> · </span>
          <button type="button" onClick={onOpenContact}>Solicita una demo</button>
        </p>
      </div>
    </section>
  );
}
