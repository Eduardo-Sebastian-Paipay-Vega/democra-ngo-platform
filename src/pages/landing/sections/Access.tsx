import { Link } from "react-router";
import { IconArrowUpRight } from "./Icons";

const INCLUDED = [
  "Voluntarios, admisiones y carnés",
  "Proyectos, actividades y tareas",
  "Asistencia y registro de horas",
  "Beneficiarios e inventario",
  "Finanzas con aprobaciones",
  "Roles, permisos y bitácora de auditoría",
  "Notificaciones para tu equipo",
];

export function Access() {
  return (
    <section className="lp-section" id="acceso" aria-labelledby="lp-access-title">
      <div className="lp-container">
        <header className="lp-center" data-reveal>
          <h2 id="lp-access-title" className="lp-h1">
            Un espacio, <span className="lp-accent-light">todo tu equipo.</span>
          </h2>
          <p className="lp-sub">
            Crea el espacio de tu organización hoy e invita a tu equipo cuando esté listo.
          </p>
        </header>

        <div className="lp-card lp-access" data-reveal>
          <div className="lp-access-copy">
            <h3 className="lp-h2">Todo el trabajo de tu organización, en un solo lugar.</h3>
            <p>Lo necesario para coordinar a tu equipo y rendir cuentas de lo que hacen juntos.</p>
            <h4>¿Qué incluye?</h4>
            <ul>
              {INCLUDED.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>

          <div className="lp-access-highlight">
            <p className="lp-kicker">Para tu organización</p>
            <p className="lp-access-big">Empieza hoy.</p>
            <hr />
            <p className="lp-access-text">
              Crea tu organización, configura tus áreas y suma a tu equipo paso a paso.
            </p>
            <a className="lp-btn lp-btn-lg" href="/ong/create">
              <IconArrowUpRight size={20} />
              Crear organización
            </a>
            <p className="lp-access-small">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
            <p className="lp-access-small">
              ¿Quieres sumarte como voluntario? <a href="/ong/signup">Regístrate aquí</a>
            </p>
          </div>
        </div>

        <p className="lp-access-foot">
          ¿Tienes un código ACE? <a href="/ong/join">Canjéalo aquí</a>
        </p>
      </div>
    </section>
  );
}
