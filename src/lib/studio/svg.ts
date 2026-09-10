import type { StudioDesignDocument, StudioElement } from "./types";

const esc = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

export function designToSvg(design: StudioDesignDocument): string {
  const w = design.widthMm;
  const h = design.heightMm;
  const gradient = design.background.type === "gradient" && design.background.secondary
    ? `<linearGradient id="studio-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${esc(design.background.value)}"/><stop offset="100%" stop-color="${esc(design.background.secondary)}"/></linearGradient>`
    : "";
  const bg = gradient ? "url(#studio-bg)" : esc(design.background.value);
  const body = design.elements.map(renderElement).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm"><defs>${gradient}</defs><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
}

function renderElement(element: StudioElement): string {
  if (element.type === "line") return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.height / 2}" fill="${esc(element.fill)}" opacity="${element.opacity}"/>`;
  if (element.type === "logo" && element.src) return `<image href="${esc(element.src)}" x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" preserveAspectRatio="xMidYMid meet" opacity="${element.opacity}"/>`;
  if (element.type === "logo") return "";
  return `<text x="${element.x}" y="${element.y}" fill="${esc(element.fill)}" opacity="${element.opacity}" font-family="${esc(element.fontFamily)}" font-size="${element.fontSize}" font-weight="${element.fontWeight}" letter-spacing="${element.letterSpacing}">${esc(element.text)}</text>`;
}
