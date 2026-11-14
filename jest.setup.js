// server/index.js solo abre un puerto real si !process.env.VERCEL (guard ya
// existente para el deploy serverless en Vercel, ver server/index.js). Se
// reutiliza exactamente ese mismo guard aquí — sin esto, cada test file que
// importa `app` desde server/index.js dispararía un app.listen() real,
// dejando handles abiertos y arriesgando EADDRINUSE si ya hay un
// `npm run dev:api` corriendo en la misma máquina.
process.env.VERCEL = "1";

// Credenciales ficticias y fijas para que la suite sea hermética: sin ellas
// assertServerConfig() (server/config.js) aborta 5 suites cuando no hay .env.
// Se asignan siempre (no solo si faltan) para que los tests nunca usen
// credenciales reales; dotenv no sobrescribe variables ya definidas, así que
// un .env local tampoco las reemplaza. Supabase está mockeado en cada test.
process.env.SUPABASE_URL = "https://democra-test.supabase.invalid";
process.env.SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
