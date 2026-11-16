#!/usr/bin/env node
/**
 * Codemod: colores neutros fijos (oscuros) → tokens de tema --t-* del
 * ThemeProvider de ONG (ong/src/app/lib/theme-context.tsx).
 *
 * Origen: docs/audits/AUDIT-ong-ui-2026-11-16.md, hallazgo C-1 (Fase 3).
 *
 * Qué convierte (solo utilidades Tailwind de color NEUTRO; los colores de
 * marca/estado —blue, emerald, red, amber, #356C92…— se dejan intactos):
 *   - zinc-* / gray-* / neutral-* / stone-* / slate-*  (bg, text, border,
 *     divide, ring, placeholder, from/via/to), con o sin opacidad /NN
 *   - hex oscuros de la paleta antigua (#100F0D, #171512, #1F1D1A, …)
 *   - text-white SOLO si la misma cadena de clases no tiene un fondo de color
 *     (en botones de color el texto blanco es correcto en ambos modos)
 *
 * Reglas:
 *   - El prefijo de estado se conserva (hover:, focus:, group-hover:…); un
 *     fondo con hover: va a --t-hover.
 *   - Los fondos de <input>/<select>/<textarea> van a --t-input-bg.
 *   - La opacidad /NN se descarta: los tokens ya traen su propia transparencia.
 *
 * Uso:   node scripts/codemods/colors-to-theme-tokens.mjs <archivo...> [--dry]
 * Salida: número de reemplazos por archivo. Idempotente.
 */
import { readFileSync, writeFileSync } from "node:fs";

const t = (name) => `[var(--t-${name})]`;

/** Escala neutra → token según propiedad. */
function neutralToken(prop, shade, { hover, input }) {
  const n = Number(shade);
  switch (prop) {
    case "bg":
    case "from":
    case "via":
    case "to":
      if (prop === "bg" && hover) return t("hover");
      if (prop === "bg" && input && n >= 900) return t("input-bg");
      if (n >= 950) return t("elevated");
      if (n >= 900) return t("surface");
      if (n >= 700) return t("elevated");
      return null; // fondos claros (zinc-50…600) en tema oscuro: revisar a mano
    case "text":
    case "placeholder":
      if (prop === "placeholder") return t("placeholder");
      if (n <= 200) return t("text");
      if (n <= 300) return t("text-secondary");
      if (n <= 400) return t("text-tertiary");
      return t("text-dim");
    case "border":
    case "divide":
    case "ring":
      if (n >= 800) return t("border");
      if (n >= 600) return t("border-strong");
      return t("border-strong");
    default:
      return null;
  }
}

/** Hex de la paleta oscura antigua → token según propiedad. */
const HEX = {
  "100f0d": { bg: "bg" },
  "171512": { bg: "surface" },
  "1f1d1a": { bg: "elevated", border: "border" },
  "23211d": { bg: "elevated", border: "border" },
  "26231f": { bg: "hover", border: "border" },
  "2a2a2a": { bg: "elevated", border: "border-strong" },
  "333": { bg: "elevated", border: "border-strong" },
  "333333": { bg: "elevated", border: "border-strong" },
  "3a3a3a": { bg: "elevated", border: "border-strong" },
  "25334b": { border: "border-strong" },
  "18181b": { bg: "surface" },
  "09090b": { bg: "bg" },
  "231c11": { bg: "warning-soft" },
  "1f181e": { bg: "danger-soft" },
  "161d17": { bg: "success-soft" },
  "1a2332": { bg: "info-soft" },
  "f9f7f3": { text: "text" },
  "f5f5f5": { text: "text" },
  "c8c5bf": { text: "text-secondary" },
  "a4a29f": { text: "text-secondary" },
  "7a7a7a": { text: "text-dim" },
  "686561": { text: "text-dim" },
  "5a5a5a": { text: "text-dim" },
};

const NEUTRAL_RE =
  /(?<![\w-])((?:[a-z-]+:)*)(bg|text|border|divide|ring|placeholder|from|via|to)-(zinc|gray|neutral|stone|slate)-(\d{2,3})(?:\/\d{1,3})?(?![\w-])/g;
const HEX_RE =
  /(?<![\w-])((?:[a-z-]+:)*)(bg|text|border|divide|ring|placeholder|from|via|to)-\[#([0-9a-fA-F]{3,8})\](?:\/\d{1,3})?(?![\w-])/g;
const COLORED_BG_RE =
  /(?<![\w-])(?:bg|from)-(?:\[#|\[var\(--t-(?:primary|success|danger|warning|info|error)\)|(?:blue|indigo|violet|purple|emerald|green|teal|cyan|sky|red|rose|amber|orange|yellow|pink|fuchsia|lime)-)/;

function convertClassString(cls, ctx) {
  let count = 0;
  let out = cls.replace(NEUTRAL_RE, (m, pre, prop, _scale, shade) => {
    const hover = /(^|:)(hover|group-hover|peer-hover):$/.test(pre);
    const token = neutralToken(prop, shade, { hover, input: ctx.input });
    if (!token) return m;
    count++;
    return `${pre}${prop === "placeholder" ? "placeholder:text" : prop}-${token}`;
  });
  out = out.replace(HEX_RE, (m, pre, prop, hex) => {
    const entry = HEX[hex.toLowerCase()];
    if (!entry) return m;
    const kind = prop === "text" || prop === "placeholder" ? "text" : prop === "border" || prop === "divide" || prop === "ring" ? "border" : "bg";
    let name = entry[kind];
    if (!name) return m;
    const hover = /(^|:)(hover|group-hover):$/.test(pre);
    if (kind === "bg" && hover) name = "hover";
    count++;
    return `${pre}${prop}-${t(name)}`;
  });
  // text-white sobre superficie neutra → texto del tema.
  if (!COLORED_BG_RE.test(out)) {
    out = out.replace(/(?<![\w:-])text-white(?![\w/-])/g, () => {
      count++;
      return `text-${t("text")}`;
    });
  }
  return { out, count };
}

function convertSource(src) {
  let total = 0;
  // Cadenas de clases: "…", '…', `…` (sin interpolación anidada compleja).
  const result = src.replace(/(["'`])((?:(?!\1)[^\\\n]|\\.)*)\1/g, (whole, q, body, offset) => {
    if (!/(zinc|gray|neutral|stone|slate)-\d|-\[#|text-white/.test(body)) return whole;
    const before = src.slice(Math.max(0, offset - 300), offset);
    const tagOpen = before.lastIndexOf("<");
    const tag = tagOpen >= 0 ? before.slice(tagOpen, tagOpen + 10) : "";
    const input = /^<(input|select|textarea)\b/i.test(tag) && !before.slice(tagOpen).includes(">");
    const { out, count } = convertClassString(body, { input });
    total += count;
    return q + out + q;
  });
  return { result, total };
}

const args = process.argv.slice(2);
const dry = args.includes("--dry");
for (const file of args.filter((a) => a !== "--dry")) {
  const src = readFileSync(file, "utf8");
  const { result, total } = convertSource(src);
  if (!dry && result !== src) writeFileSync(file, result, "utf8");
  console.log(`${dry ? "[dry] " : ""}${file}: ${total} reemplazos`);
}
