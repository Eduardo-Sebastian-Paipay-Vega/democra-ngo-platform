import type { ReactNode } from "react";
import { Link } from "react-router";
import { BrandMark } from "./BrandMark";
import { IconArrowUpRight, IconChevronRight } from "./Icons";

interface Props {
  onOpenContact: () => void;
}

interface FinalCtaProps extends Props {
  /** Título del cierre; por defecto, el del landing. */
  title?: ReactNode;
  /** Texto opcional bajo el título. */
  lede?: ReactNode;
}

interface SiteFooterProps extends Props {
  /** Prefijo de las anclas de sección ("" en el landing, "/" en otras páginas públicas). */
  anchorBase?: string;
}

export function FinalCta({
  onOpenContact,
  title = "¿Listo para organizar el trabajo de tu equipo?",
  lede,
}: FinalCtaProps) {
  return (
    <section className="lp-cta" aria-labelledby="lp-cta-title">
      <div className="lp-container lp-center" data-reveal>
        <h2 id="lp-cta-title" className="lp-h1 lp-cta-title">
          {title}
        </h2>
        {lede && <p className="lp-sub lp-cta-lede">{lede}</p>}
        <a className="lp-btn lp-btn-lg" href="/ong/create">
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

export function SiteFooter({ onOpenContact, anchorBase = "" }: SiteFooterProps) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-plate">
        <BrandMark size="lg" href={anchorBase || "#inicio"} />

        <div className="lp-footer-main">
          <div className="lp-footer-contact">
            <p className="lp-footer-heading">¿Hablamos?</p>
            <button type="button" className="lp-footer-field" onClick={onOpenContact}>
              <span>Cuéntanos sobre tu organización</span>
              <i><IconChevronRight size={16} /></i>
            </button>
            <p className="lp-footer-hint">Abre el formulario de contacto.</p>
          </div>

          <nav className="lp-footer-cols" aria-label="Enlaces del pie de página">
            <ul aria-label="Navegación">
              <li><a href={`${anchorBase}#funciones`}>Funciones</a></li>
              <li><a href={`${anchorBase}#como-funciona`}>Cómo funciona</a></li>
              <li><a href={`${anchorBase}#acceso`}>Acceso</a></li>
              <li><a href={`${anchorBase}#preguntas`}>Preguntas</a></li>
            </ul>
            <ul aria-label="Plataforma">
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><a href="/ong/create">Crear organización</a></li>
              <li><a href="/ong/join">Canjear código ACE</a></li>
              <li><a href="/ong/signup">Ser voluntario</a></li>
              <li><button type="button" onClick={onOpenContact}>Contacto</button></li>
            </ul>
          </nav>
        </div>

        <div className="lp-footer-bottom">
          <span>© {new Date().getFullYear()} democra.pro. Todos los derechos reservados.</span>
          <a href="#inicio">Volver arriba</a>
        </div>
      </div>
    </footer>
  );
}
