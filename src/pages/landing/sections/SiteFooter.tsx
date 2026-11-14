import { Link } from "react-router";
import { BrandMark } from "./BrandMark";
import { IconArrowUpRight, IconChevronRight } from "./Icons";

interface Props {
  onOpenContact: () => void;
}

export function FinalCta({ onOpenContact }: Props) {
  return (
    <section className="lp-cta" aria-labelledby="lp-cta-title">
      <div className="lp-container lp-center" data-reveal>
        <h2 id="lp-cta-title" className="lp-h1 lp-cta-title">
          ¿Listo para organizar el trabajo de tu equipo?
        </h2>
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

export function SiteFooter({ onOpenContact }: Props) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-plate">
        <BrandMark size="lg" />

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
              <li><a href="#funciones">Funciones</a></li>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#acceso">Acceso</a></li>
              <li><a href="#preguntas">Preguntas</a></li>
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
