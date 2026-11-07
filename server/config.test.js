import { assertProductionSecrets, assertServerConfig, config } from "./config.js";

const STRONG_PEPPER = "p".repeat(32);

describe("assertProductionSecrets (server/config.js)", () => {
  test("acepta un pepper fuerte con EXPOSE_DEBUG_OTP desactivado", () => {
    expect(() =>
      assertProductionSecrets({ MFA_OTP_PEPPER: STRONG_PEPPER, EXPOSE_DEBUG_OTP: "false" })
    ).not.toThrow();
  });

  test("rechaza MFA_OTP_PEPPER ausente (evita el default publico dev-local-pepper)", () => {
    expect(() => assertProductionSecrets({})).toThrow(/MFA_OTP_PEPPER/);
  });

  test("rechaza MFA_OTP_PEPPER de menos de 32 caracteres", () => {
    expect(() => assertProductionSecrets({ MFA_OTP_PEPPER: "corto" })).toThrow(/MFA_OTP_PEPPER/);
  });

  test("rechaza el placeholder de .env.example", () => {
    expect(() =>
      assertProductionSecrets({ MFA_OTP_PEPPER: "CHANGE_ME_FOR_PRODUCTION_AES256_PEPPER" })
    ).toThrow(/MFA_OTP_PEPPER/);
  });

  test("rechaza EXPOSE_DEBUG_OTP=true", () => {
    expect(() =>
      assertProductionSecrets({ MFA_OTP_PEPPER: STRONG_PEPPER, EXPOSE_DEBUG_OTP: "true" })
    ).toThrow(/EXPOSE_DEBUG_OTP/);
  });
});

describe("assertServerConfig segun NODE_ENV", () => {
  const originalNodeEnv = config.nodeEnv;
  const originalPepper = process.env.MFA_OTP_PEPPER;

  afterEach(() => {
    config.nodeEnv = originalNodeEnv;
    if (originalPepper === undefined) delete process.env.MFA_OTP_PEPPER;
    else process.env.MFA_OTP_PEPPER = originalPepper;
  });

  test("fuera de produccion no exige MFA_OTP_PEPPER", () => {
    config.nodeEnv = "development";
    delete process.env.MFA_OTP_PEPPER;
    expect(() => assertServerConfig()).not.toThrow();
  });

  test("en produccion falla el arranque sin MFA_OTP_PEPPER", () => {
    config.nodeEnv = "production";
    delete process.env.MFA_OTP_PEPPER;
    expect(() => assertServerConfig()).toThrow(/Configuración insegura para producción/);
  });

  test("en produccion arranca con MFA_OTP_PEPPER fuerte", () => {
    config.nodeEnv = "production";
    process.env.MFA_OTP_PEPPER = STRONG_PEPPER;
    expect(() => assertServerConfig()).not.toThrow();
  });
});
