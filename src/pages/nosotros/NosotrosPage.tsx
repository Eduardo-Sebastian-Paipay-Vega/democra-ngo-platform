import { lazy, Suspense, useRef, useState, type ReactNode } from "react";
import "../landing/landing.css";
import { SiteHeader } from "../landing/sections/SiteHeader";
import { FinalCta, SiteFooter } from "../landing/sections/SiteFooter";
import { useReveal } from "../landing/sections/useReveal";
import { IconArrowUpRight, IconClock, IconLayout } from "../landing/sections/Icons";

const ContactModal = lazy(async () => {
  const { ContactModal: Modal } = await import("../landing/ContactModal");
  return { default: Modal };
});

interface Value {
  title: string;
  description: string;
  icon: ReactNode;
}

const values: Value[] = [
  {
    title: "Transparencia",
    description: "Procesos claros, información accesible y rendición de cuentas en cada paso.",
    icon: <IconLayout size={22} />,
  },
  {
    title: "Impacto",
    description: "Cada funcionalidad amplifica el trabajo de quienes cambian el mundo.",
    icon: <IconClock size={22} />,
  },
  {
    title: "Simplicidad",
    description: "Menos fricción, más acción. Tecnología al servicio de las personas.",
    icon: <IconArrowUpRight size={22} />,
  },
];

const team = [
  { name: "Eduardo Bastian", role: "Fundador & CEO", initials: "EB" },
  { name: "Equipo de Producto", role: "Diseño & Ingeniería", initials: "EP" },
  { name: "Asesores", role: "Impacto Social", initials: "AS" },
];

/**
 * Página pública /nosotros, alineada con el sistema visual del landing (.lp).
 * Plan y divergencias corregidas: .claude/landing-design/AUDIT.md.
 */
export function NosotrosPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const openContact = () => setIsContactOpen(true);
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="lp" id="inicio" ref={rootRef}>
      <a className="lp-skip" href="#lp-main">Saltar al contenido</a>
      <div className="lp-frame" aria-hidden="true" />
      <SiteHeader onOpenContact={openContact} anchorBase="/" />

      <main id="lp-main">
        <div className="lp-zone-top">
          <div className="lp-zone-scrim" aria-hidden="true" />

          <section className="lp-hero lp-about-hero" aria-labelledby="lp-about-title">
            <div className="lp-container lp-hero-inner">
              <p className="lp-kicker">Quiénes somos</p>
              <h1 id="lp-about-title" className="lp-display lp-about-title">
                Construimos la <span className="lp-accent-deep">democracia digital.</span>
              </h1>
              <p className="lp-hero-lede">
                Un equipo comprometido con empoderar organizaciones a través de tecnología que
                amplifica el impacto social.
              </p>
            </div>
          </section>

          <section className="lp-about-mission" aria-labelledby="lp-mission-title">
            <div className="lp-container">
              <article className="lp-card lp-feature lp-feature-wide" data-reveal>
                <div className="lp-feature-copy">
                  <p className="lp-kicker">Nuestra misión</p>
                  <h2 id="lp-mission-title" className="lp-h2 lp-about-mission-title">
                    Gobernanza para todos.
                  </h2>
                  <p>
                    Potenciar organizaciones sin fines de lucro con herramientas digitales que
                    simplifican la gestión, amplían el alcance y acompañan a tu equipo a medida que
                    crece.
                  </p>
                </div>
                <div className="lp-canvas lp-about-orbit" role="img" aria-label="Ilustración: círculos concéntricos que representan a una comunidad conectada">
                  <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
                    <circle cx="100" cy="100" r="72" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="48" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="22" fill="currentColor" fillOpacity="0.35" />
                    <line x1="28" y1="100" x2="172" y2="100" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.5" />
                    <line x1="100" y1="28" x2="100" y2="172" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.5" />
                    <circle cx="151" cy="49" r="4" fill="currentColor" />
                    <circle cx="52" cy="134" r="3" fill="currentColor" fillOpacity="0.7" />
                    <circle cx="148" cy="148" r="2.5" fill="#fff" fillOpacity="0.6" />
                  </svg>
                </div>
              </article>
            </div>
          </section>
        </div>

        <section className="lp-section" aria-labelledby="lp-values-title">
          <div className="lp-container">
            <div className="lp-center" data-reveal>
              <h2 id="lp-values-title" className="lp-h1">
                Nuestros <span className="lp-accent-deep">valores.</span>
              </h2>
              <p className="lp-sub">Los principios que guían cada decisión que tomamos.</p>
            </div>

            <ul className="lp-about-grid">
              {values.map((v) => (
                <li key={v.title} className="lp-card lp-about-card" data-reveal>
                  <span className="lp-about-icon" aria-hidden="true">{v.icon}</span>
                  <h3 className="lp-about-card-title">{v.title}</h3>
                  <p>{v.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-section lp-about-team" aria-labelledby="lp-team-title">
          <div className="lp-container lp-container-narrow">
            <div className="lp-center" data-reveal>
              <h2 id="lp-team-title" className="lp-h1">El equipo.</h2>
              <p className="lp-sub">Personas apasionadas por el impacto social y la tecnología.</p>
            </div>

            <ul className="lp-about-grid">
              {team.map((m) => (
                <li key={m.name} className="lp-card lp-about-card lp-about-member" data-reveal>
                  <span className="lp-about-avatar" aria-hidden="true">{m.initials}</span>
                  <h3 className="lp-about-card-title">{m.name}</h3>
                  <p>{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="lp-zone-end">
          <FinalCta
            onOpenContact={openContact}
            title="¿Listo para empezar?"
            lede="Crea el espacio de tu organización y empieza a coordinar a tu equipo con democra.pro."
          />
          <SiteFooter onOpenContact={openContact} anchorBase="/" />
        </div>
      </main>

      <Suspense fallback={null}>
        {isContactOpen && (
          <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        )}
      </Suspense>
    </div>
  );
}
