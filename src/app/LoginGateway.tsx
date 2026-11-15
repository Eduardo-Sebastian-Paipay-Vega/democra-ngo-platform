import { createSupabaseClient } from "../services/supabase";
import { CoreLogin } from "../core/auth";
import { BrandMark } from "../pages/landing/sections/BrandMark";

const HELP_URL =
  "https://wa.me/51953714752?text=Hola,%20necesito%20ayuda%20para%20ingresar%20a%20mi%20cuenta%20de%20Democra.";

// Presentación con el sistema .lp (estilos en src/pages/login/login.css).
// CoreLogin pone estilos en línea a la tarjeta; aquí se reemplazan por los del sistema.
const cardStyle: React.CSSProperties = {
  background: "linear-gradient(var(--lp-card-bg), var(--lp-card-bg)), var(--lp-bg)",
  backdropFilter: "none",
  border: "1px solid var(--lp-card-border)",
  boxShadow: "none",
};

export function LoginGateway() {
  async function handleSuccessfulLogin() {
    const supabase = createSupabaseClient();
    
    // public.tenants tiene RLS sin políticas (deny-all), así que industry_type_id
    // no es legible directamente. fn_get_user_redirect_target() (migración
    // 20260706120000) resuelve esto del lado del servidor con SECURITY DEFINER
    // y devuelve solo el destino ('ong' | 'gym' | 'root'), sin exponer la tabla.
    const { data: redirectTarget, error: redirectError } = await supabase.rpc(
      "fn_get_user_redirect_target"
    );

    if (redirectError) {
      throw new Error("Sesión iniciada, pero no se pudo determinar tu destino. Intenta de nuevo.");
    }

    // Uso estricto del resultado: solo 'ong' tiene un módulo real montado en
    // este MPA. Cualquier otro valor ('root', 'gym', o uno futuro) se trata
    // como "sin acceso todavía" — nunca se asume una ruta que no existe.
    if (redirectTarget === "ong") {
      // Same-origin MPA: la sesión ya quedó en localStorage bajo AUTH_STORAGE_KEY
      // (compartido con el cliente Supabase de ONG). Una navegación normal basta
      // para que /ong la recoja al montar — sin tokens en la URL.
      window.location.assign("/ong/app");
      return;
    }

    throw new Error(
      redirectTarget === "root"
        ? "Tu cuenta aún no está asociada a ninguna organización."
        : `Tu cuenta pertenece a un módulo ("${redirectTarget}") que todavía no está disponible en esta plataforma.`
    );
  }

  const headerNode = (
    <div className="lp-auth-head">
      <BrandMark href="/" />
      <h1 className="lp-h2 lp-auth-title">Iniciar sesión</h1>
      <p className="lp-auth-lede">Ingresa tus credenciales para acceder al sistema.</p>
    </div>
  );

  const footerNode = (
    <div className="lp-note lp-auth-foot">
      <p>
        <button
          type="button"
          onClick={() => window.open(HELP_URL, "_blank", "noopener,noreferrer")}
        >
          ¿Necesitas ayuda para ingresar?
        </button>
      </p>
      <p>
        ¿Nuevo en la plataforma? <a href="/">Ir a la página principal</a>
      </p>
    </div>
  );

  return (
    <div className="lp lp-auth">
      <div className="lp-frame" aria-hidden="true" />
      <main className="lp-auth-main">
        <CoreLogin
          supabase={createSupabaseClient()}
          onLoginSuccess={handleSuccessfulLogin}
          headerNode={headerNode}
          footerNode={footerNode}
          className="lp-auth-card"
          style={cardStyle}
          buttonClassName="lp-btn lp-btn-lg lp-btn-block lp-auth-submit"
        />
      </main>
    </div>
  );
}
