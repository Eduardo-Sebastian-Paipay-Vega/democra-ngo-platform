import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { BrandMark } from "./BrandMark";
import { IconArrowUpRight, IconClose, IconMenu } from "./Icons";

const SECTION_LINKS = [
  { label: "Funciones", href: "#funciones" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Preguntas", href: "#preguntas" },
];

interface SiteHeaderProps {
  onOpenContact: () => void;
  /**
   * Prefijo de las anclas de sección. En el landing es "" (anclas locales);
   * en otras páginas públicas (p. ej. /nosotros) es "/" para apuntar a /#seccion.
   */
  anchorBase?: string;
}

export function SiteHeader({ onOpenContact, anchorBase = "" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="lp-header">
      <div className="lp-header-inner">
        <nav className="lp-nav" aria-label="Navegación principal">
          <BrandMark href={anchorBase || "#inicio"} />

          <ul className="lp-nav-links">
            {SECTION_LINKS.map((l) => (
              <li key={l.href}>
                <a href={`${anchorBase}${l.href}`}>{l.label}</a>
              </li>
            ))}
            <li>
              <button type="button" onClick={onOpenContact}>Contacto</button>
            </li>
          </ul>

          <div className="lp-nav-actions">
            <Link className="lp-nav-login" to="/login">Iniciar sesión</Link>
            <a className="lp-btn lp-btn-sm lp-nav-cta" href="/ong/create">Comenzar</a>
            <button
              ref={toggleRef}
              type="button"
              className="lp-nav-toggle"
              aria-expanded={open}
              aria-controls="lp-mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lp-mobile-menu" id="lp-mobile-menu">
            <ul>
              {SECTION_LINKS.map((l) => (
                <li key={l.href}><a href={`${anchorBase}${l.href}`} onClick={close}>{l.label}</a></li>
              ))}
              <li><a href={`${anchorBase}#acceso`} onClick={close}>Acceso</a></li>
              <li>
                <button type="button" onClick={() => { close(); onOpenContact(); }}>Contacto</button>
              </li>
              <li><Link to="/login" onClick={close}>Iniciar sesión</Link></li>
              <li><a href="/ong/join" onClick={close}>Canjear código ACE</a></li>
              <li><a href="/ong/signup" onClick={close}>Ser voluntario</a></li>
            </ul>
            <a className="lp-btn lp-btn-lg lp-btn-block" href="/ong/create" onClick={close}>
              <IconArrowUpRight size={20} />
              Crear mi organización
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
