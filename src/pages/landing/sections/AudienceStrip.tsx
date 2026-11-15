const KINDS = [
  "ONG",
  "Voluntariados",
  "Fundaciones",
  "Cooperativas",
  "Asociaciones civiles",
  "Colectivos",
  "Juntas vecinales",
  "Centros de estudiantes",
];

/** Franja con desplazamiento continuo. La lista se duplica para el bucle; la copia se oculta a lectores de pantalla. */
export function AudienceStrip() {
  return (
    <section className="lp-audience" aria-labelledby="lp-audience-title">
      <p id="lp-audience-title" className="lp-audience-title">Pensado para organizaciones como:</p>
      <ul className="lp-sr-only">
        {KINDS.map((k) => <li key={k}>{k}</li>)}
      </ul>
      <div className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[...KINDS, ...KINDS].map((k, i) => (
            <span className="lp-chip" key={i}>{k}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
