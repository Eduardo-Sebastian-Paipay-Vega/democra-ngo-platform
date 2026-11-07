/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/**
 * Configuración dedicada de Vitest para el panel de Testing de VS Code.
 * La extensión `vitest.explorer` requiere este archivo independiente
 * (no detecta el bloque `test:{}` embebido en vite.config.js).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@ong": resolve(__dirname, "ong/src"),
    },
  },
  test: {
    server: {
      deps: {
        inline: [
          "@exodus/bytes",
          "html-encoding-sniffer",
          "jsdom",
          "data-urls",
          "whatwg-url",
          "whatwg-mimetype"
        ],
      },
    },
    globals: true,
    environment: "happy-dom",
    // Credenciales ficticias y fijas: los clientes Supabase se crean al importar
    // el módulo (ong/src/lib/db/core.ts), así que sin estas variables 70 archivos
    // fallan antes de ejecutar un solo test. Se definen aquí (y no en .env) para
    // que la suite sea hermética: nunca usa credenciales reales, haya o no .env.
    // El dominio .invalid (RFC 2606) garantiza que nunca resuelva por DNS.
    env: {
      VITE_SUPABASE_URL: "https://democra-test.supabase.invalid",
      VITE_SUPABASE_ANON_KEY: "test-anon-key",
      VITE_ONG_DB_SUPABASE_URL: "https://democra-test.supabase.invalid",
      VITE_ONG_DB_SUPABASE_ANON_KEY: "test-anon-key",
      // readRequiredEnv() lee process.env solo con el nombre sin prefijo; en
      // ong/src import.meta.env no expone VITE_*, así que hacen falta ambos.
      ONG_DB_SUPABASE_URL: "https://democra-test.supabase.invalid",
      ONG_DB_SUPABASE_ANON_KEY: "test-anon-key",
    },
    setupFiles: ["./vitest.setup.ts"],
    // Holgura para waitFor/findBy a 5000 ms (ver vitest.setup.ts) y para tests
    // async de servicios bajo carga. El default de 5000 ms quedaría justo.
    testTimeout: 15000,
    hookTimeout: 15000,
    include: [
      "src/**/*.test.{ts,tsx}",
      "ong/src/**/*.test.{ts,tsx}",
    ],
    // Pasa --no-warnings a cada worker fork para que Node.js v22+ no imprima
    // "ExperimentalWarning: localStorage is not available" antes de que
    // el setup file pueda interceptarlo.
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      // Directorio propio: Jest ya usa "coverage/" para server/, si Vitest
      // escribiera ahí también se pisarían los reportes entre sí.
      reportsDirectory: "coverage-web",
      include: [
        "ong/src/app/modules/people/hooks/useIdCardDetail.ts",
        "ong/src/app/modules/people/hooks/useIdCardTemplateDetail.ts",
        "ong/src/app/modules/operation/hooks/useAprobacionDetail.ts",
        "ong/src/app/modules/resources/hooks/useKardex.ts",
        "ong/src/app/services/shared/storage.ts",
        "ong/src/app/modules/resources/hooks/useReportesFinancieros.ts",
        "ong/src/app/modules/operation/hooks/useHoraDetail.ts",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
      ],
    },
    // Forzar sourcemaps para V8
    css: false,
  },
});
