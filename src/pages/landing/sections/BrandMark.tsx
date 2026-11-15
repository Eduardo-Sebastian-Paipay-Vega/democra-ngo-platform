interface BrandMarkProps {
  size?: "md" | "lg";
  href?: string;
}

/** Monograma + wordmark de Democra, usado en header y footer. */
export function BrandMark({ size = "md", href = "#inicio" }: BrandMarkProps) {
  return (
    <a className={`lp-brand lp-brand-${size}`} href={href} aria-label="democra.pro, ir al inicio">
      <span className="lp-brand-icon" aria-hidden="true">
        <img src="/brand/d-core-monogram.png" alt="" width={64} height={64} decoding="async" />
      </span>
      <span className="lp-brand-word" aria-hidden="true">
        democra<span>.pro</span>
      </span>
    </a>
  );
}
