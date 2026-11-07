import { encryptAes256, decryptAes256 } from "./crypto-aes.js";
import { config } from "../config.js";

describe("Modulo de Cifrado AES-256-GCM (server/utils/crypto-aes.js)", () => {
  const secretKey = "mi-clave-super-secreta-de-prueba";

  test("cifra y descifra texto en claro correctamente", () => {
    const originalText = "Ficha Medica Sensible: Alergia a la Penicilina - Tipo A+";
    const encrypted = encryptAes256(originalText, secretKey);

    expect(encrypted).not.toBe(originalText);
    expect(encrypted.split(":").length).toBe(3);

    const decrypted = decryptAes256(encrypted, secretKey);
    expect(decrypted).toBe(originalText);
  });

  test("lanza si no hay DATA_ENCRYPTION_KEY ni clave explicita (sin clave de respaldo)", () => {
    const original = config.dataEncryptionKey;
    config.dataEncryptionKey = "";
    try {
      expect(() => encryptAes256("dato")).toThrow(/DATA_ENCRYPTION_KEY/);
      expect(() => decryptAes256("aa:bb:cc")).toThrow(/DATA_ENCRYPTION_KEY/);
    } finally {
      config.dataEncryptionKey = original;
    }
  });

  test("usa DATA_ENCRYPTION_KEY como clave por defecto del servidor", () => {
    const original = config.dataEncryptionKey;
    config.dataEncryptionKey = "clave-de-cifrado-de-prueba-32-caracteres!";
    const originalText = "DNI: 72819283 - Contacto de Emergencia";
    const encrypted = encryptAes256(originalText);
    const decrypted = decryptAes256(encrypted);
    config.dataEncryptionKey = original;

    expect(decrypted).toBe(originalText);
  });

  test("devuelve null/string vacio para entradas nulas o vacias", () => {
    expect(encryptAes256(null)).toBeNull();
    expect(encryptAes256("")).toBe("");
    expect(decryptAes256(null)).toBeNull();
  });

  test("lanza error si el formato del payload cifrado es invalido", () => {
    expect(() => decryptAes256("formato-invalido", secretKey)).toThrow(
      "Formato de payload cifrado invalido."
    );
  });

  test("lanza error si la autenticacion (authTag) o datos fueron alterados", () => {
    const encrypted = encryptAes256("Dato Confidencial", secretKey);
    const parts = encrypted.split(":");
    // Alterar el ciphertext
    const corruptedCiphertext = parts[2].substring(0, parts[2].length - 2) + "00";
    const corruptedPayload = `${parts[0]}:${parts[1]}:${corruptedCiphertext}`;

    expect(() => decryptAes256(corruptedPayload, secretKey)).toThrow();
  });
});
