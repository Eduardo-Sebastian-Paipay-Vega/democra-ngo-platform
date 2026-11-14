import { useEffect, type RefObject } from "react";

/**
 * Revelado al desplazar: los elementos con `data-reveal` dentro de `rootRef`
 * pasan de opacidad 0 a 1 al entrar en el viewport (comportamiento observado
 * en la referencia). Sin JS, o con `prefers-reduced-motion`, todo queda visible
 * porque la clase `lp-reveal-ready` nunca se añade.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    root.classList.add("lp-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((t) => observer.observe(t));

    return () => {
      observer.disconnect();
      root.classList.remove("lp-reveal-ready");
    };
  }, [rootRef]);
}
