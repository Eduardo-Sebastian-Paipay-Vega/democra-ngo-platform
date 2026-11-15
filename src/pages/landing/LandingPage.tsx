import { lazy, Suspense, useRef, useState } from "react";
import "./landing.css";
import { SiteHeader } from "./sections/SiteHeader";
import { Hero } from "./sections/Hero";
import { ProductDemo } from "./sections/ProductDemo";
import { AudienceStrip } from "./sections/AudienceStrip";
import { Features } from "./sections/Features";
import { Access } from "./sections/Access";
import { Faq } from "./sections/Faq";
import { FinalCta, SiteFooter } from "./sections/SiteFooter";
import { useReveal } from "./sections/useReveal";

const ContactModal = lazy(async () => {
  const { ContactModal: Modal } = await import("./ContactModal");
  return { default: Modal };
});

/**
 * Landing pública de Democra. Composición basada en la auditoría de
 * docs/reference-audit.md; tokens en docs/design-tokens.json (prefijo --lp-).
 */
export function LandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const openContact = () => setIsContactOpen(true);
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="lp" id="inicio" ref={rootRef}>
      <a className="lp-skip" href="#lp-main">Saltar al contenido</a>
      <div className="lp-frame" aria-hidden="true" />
      <SiteHeader onOpenContact={openContact} />

      <main id="lp-main">
        <div className="lp-zone-top">
          <div className="lp-zone-scrim" aria-hidden="true" />
          <Hero onOpenContact={openContact} />
          <ProductDemo />
          <AudienceStrip />
        </div>
        <Features />
        <Access />
        <Faq />
        <div className="lp-zone-end">
          <FinalCta onOpenContact={openContact} />
          <SiteFooter onOpenContact={openContact} />
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
