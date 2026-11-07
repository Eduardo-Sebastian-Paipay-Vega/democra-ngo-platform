export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_PORT || 8787),
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey:
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  rucApiUrl: process.env.VITE_RUC_API_URL || process.env.RUC_API_URL || "",
  rucApiToken: process.env.RUC_API_TOKEN || "",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  openAiBaseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  // El default solo es válido fuera de producción: assertServerConfig() exige
  // MFA_OTP_PEPPER real cuando NODE_ENV=production.
  otpPepper: process.env.MFA_OTP_PEPPER || "dev-local-pepper",
  // Clave propia para server/utils/crypto-aes.js (separada del pepper de OTP).
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY || "",
  otpTtlMinutes: Number(process.env.MFA_OTP_TTL_MINUTES || 10),
  otpEmailProvider: (process.env.OTP_EMAIL_PROVIDER || (process.env.RESEND_API_KEY ? "resend" : "none")).toLowerCase(),
  otpFromEmail: process.env.OTP_FROM_EMAIL || "",
  otpFromName: process.env.OTP_FROM_NAME || "Democra Security",
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS || 8),
  maxPinAttempts: Number(process.env.MAX_PIN_ATTEMPTS || 5),
  pinBlockMinutes: Number(process.env.PIN_BLOCK_MINUTES || 15),
  riskTempBlockMinutes: Number(process.env.RISK_TEMP_BLOCK_MINUTES || 15),
  exposeDebugOtp: String(process.env.EXPOSE_DEBUG_OTP || "false") === "true",
  // Orígenes extra permitidos por CORS (previews de Vercel, otros dominios),
  // además de los defaults same-origin/localhost ya cubiertos en index.js.
  // Formato: lista separada por comas, ej. "https://staging.democra.pro,https://foo.vercel.app".
  allowedOrigins: String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export const assertServerConfig = () => {
  const missing = [];

  if (!config.supabaseUrl) missing.push("SUPABASE_URL");
  if (!config.supabaseAnonKey) missing.push("SUPABASE_ANON_KEY");
  if (!config.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno requeridas para API: ${missing.join(", ")}`
    );
  }

  if (config.nodeEnv === "production") {
    assertProductionSecrets();
  }
};

const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER_PREFIX = "CHANGE_ME";

const isWeakSecret = (value) =>
  !value ||
  String(value).length < MIN_SECRET_LENGTH ||
  String(value).toUpperCase().startsWith(PLACEHOLDER_PREFIX);

/**
 * Controles que solo aplican en producción: sin ellos el pepper de OTP caería
 * al literal "dev-local-pepper" (público en el repo) y EXPOSE_DEBUG_OTP podría
 * devolver el código OTP en la respuesta HTTP.
 */
export const assertProductionSecrets = (env = process.env) => {
  const problems = [];

  if (isWeakSecret(env.MFA_OTP_PEPPER)) {
    problems.push(
      `MFA_OTP_PEPPER debe definirse con al menos ${MIN_SECRET_LENGTH} caracteres y no ser un placeholder`
    );
  }

  if (String(env.EXPOSE_DEBUG_OTP || "false") === "true") {
    problems.push("EXPOSE_DEBUG_OTP=true no está permitido en producción");
  }

  if (problems.length) {
    throw new Error(`Configuración insegura para producción: ${problems.join("; ")}`);
  }
};
