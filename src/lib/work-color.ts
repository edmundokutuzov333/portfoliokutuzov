const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function expandHex(hex: string): string {
  const value = hex.trim().toLowerCase();
  if (!HEX.test(value)) throw new Error("Invalid color. Expected #rgb or #rrggbb.");
  if (value.length === 4) {
    return "#" + [...value.slice(1)].map((channel) => channel + channel).join("");
  }
  return value;
}

function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value: number): number {
  const v = clamp01(value);
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = expandHex(hex);
  return [
    Number.parseInt(value.slice(1, 3), 16) / 255,
    Number.parseInt(value.slice(3, 5), 16) / 255,
    Number.parseInt(value.slice(5, 7), 16) / 255,
  ];
}

function linearRgbToHex(rgb: [number, number, number]): string {
  return (
    "#" +
    rgb
      .map((channel) => Math.round(linearToSrgb(channel) * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToOklab([r, g, b]: [number, number, number]) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function relLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrast(a: string, b: string): number {
  const L1 = relLuminance(a);
  const L2 = relLuminance(b);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

export function pickFg(bgHex: string): "#000000" | "#f2f2ef" {
  return contrast(bgHex, "#f2f2ef") >= contrast(bgHex, "#000000") ? "#f2f2ef" : "#000000";
}

export function darkenWorkColor(hex: string, amount = 0.18): string {
  const { L, a, b } = rgbToOklab(hexToRgb(hex));
  const nextL = clamp01(L - amount);
  const linearRgb = oklabToLinearRgb(nextL, a, b).map(clamp01) as [number, number, number];
  return linearRgbToHex(linearRgb);
}

export function setWorkColor(hex?: string | null): string {
  const root = typeof document === "undefined" ? null : document.documentElement;
  const fallback = "#2f4bff";
  const requested = hex && HEX.test(hex.trim()) ? expandHex(hex) : fallback;
  const dark = darkenWorkColor(requested);
  const fg = pickFg(dark);

  if (root) {
    root.style.setProperty("--work", requested);
    root.style.setProperty("--work-dark", dark);
    root.style.setProperty("--work-fg", fg);
  }

  return dark;
}
