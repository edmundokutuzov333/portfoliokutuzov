import { PDFDocument } from "pdf-lib";
import { designToSvg } from "./svg";
import type { StudioDesignDocument } from "./types";
import { trackStudioClientEvent } from "./analytics";

const RASTER_SCALE = 4;
const SCREEN_DPI = 96;
const PRINT_DPI = 300;
const BLEED_MM = 3;
const CROP_MARK_MM = 5;
const MM_TO_PT = 72 / 25.4;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function mmToPx(mm: number, dpi: number) {
  return Math.round((mm / 25.4) * dpi);
}

function blobPart(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function dataUrlFromBytes(bytes: Uint8Array, mime: string) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return `data:${mime};base64,${btoa(binary)}`;
}

export function exportSvg(design: StudioDesignDocument) {
  trackStudioClientEvent({ eventName: "export_started", exportFormat: "svg" });
  try {
    const svg = designToSvg(design);
    downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "business-card.svg");
    trackStudioClientEvent({ eventName: "export_completed", exportFormat: "svg" });
  } catch (error) {
    trackStudioClientEvent({ eventName: "export_failed", exportFormat: "svg", metadata: { reason: error instanceof Error ? error.name : "unknown" } });
    throw error;
  }
}

async function svgToPngBytesFromSource(svg: string, widthMm: number, heightMm: number, dpi: number): Promise<Uint8Array> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    const width = mmToPx(widthMm, dpi);
    const height = mmToPx(heightMm, dpi);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas rendering context is unavailable.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);
    const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("PNG encoding failed.")), "image/png"));
    return new Uint8Array(await png.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function svgToPngBytes(design: StudioDesignDocument): Promise<Uint8Array> {
  return svgToPngBytesFromSource(designToSvg(design), design.widthMm, design.heightMm, SCREEN_DPI * RASTER_SCALE);
}

export async function createPngDataUrl(design: StudioDesignDocument) {
  trackStudioClientEvent({ eventName: "export_started", exportFormat: "png" });
  try {
    const result = dataUrlFromBytes(await svgToPngBytes(design), "image/png");
    trackStudioClientEvent({ eventName: "export_completed", exportFormat: "png" });
    return result;
  } catch (error) {
    trackStudioClientEvent({ eventName: "export_failed", exportFormat: "png", metadata: { reason: error instanceof Error ? error.name : "unknown" } });
    throw error;
  }
}

export async function createPdfDataUrl(design: StudioDesignDocument) {
  trackStudioClientEvent({ eventName: "export_started", exportFormat: "pdf" });
  try {
    const png = await svgToPngBytes(design);
    const pdf = await PDFDocument.create();
    const width = design.widthMm * MM_TO_PT;
    const height = design.heightMm * MM_TO_PT;
    const page = pdf.addPage([width, height]);
    const image = await pdf.embedPng(png);
    page.drawImage(image, { x: 0, y: 0, width, height });
    pdf.setTitle("Business Card");
    pdf.setSubject("Kutuzov Studio business card");
    pdf.setCreator("Kutuzov Studio");
    const result = dataUrlFromBytes(await pdf.save(), "application/pdf");
    trackStudioClientEvent({ eventName: "export_completed", exportFormat: "pdf" });
    return result;
  } catch (error) {
    trackStudioClientEvent({ eventName: "export_failed", exportFormat: "pdf", metadata: { reason: error instanceof Error ? error.name : "unknown" } });
    throw error;
  }
}

function buildPrintSvg(design: StudioDesignDocument) {
  const trimX = CROP_MARK_MM + BLEED_MM;
  const trimY = CROP_MARK_MM + BLEED_MM;
  const pageWidth = design.widthMm + 2 * (CROP_MARK_MM + BLEED_MM);
  const pageHeight = design.heightMm + 2 * (CROP_MARK_MM + BLEED_MM);
  const bleedX = CROP_MARK_MM;
  const bleedY = CROP_MARK_MM;
  const bleedWidth = design.widthMm + 2 * BLEED_MM;
  const bleedHeight = design.heightMm + 2 * BLEED_MM;
  const inner = designToSvg(design);
  const innerContent = inner.slice(inner.indexOf(">") + 1, inner.lastIndexOf("</svg>"));
  const background = design.background.type === "gradient"
    ? `<defs><linearGradient id="print-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${design.background.value}"/><stop offset="100%" stop-color="${design.background.secondary ?? design.background.value}"/></linearGradient></defs><rect x="${bleedX}" y="${bleedY}" width="${bleedWidth}" height="${bleedHeight}" fill="url(#print-background)"/>`
    : `<rect x="${bleedX}" y="${bleedY}" width="${bleedWidth}" height="${bleedHeight}" fill="${design.background.value}"/>`;
  const crop = `
    <g stroke="#000" stroke-width="0.2" fill="none">
      <path d="M ${trimX - CROP_MARK_MM} ${trimY} H ${trimX - 0.5}"/><path d="M ${trimX} ${trimY - CROP_MARK_MM} V ${trimY - 0.5}"/>
      <path d="M ${trimX + design.widthMm + 0.5} ${trimY} H ${trimX + design.widthMm + CROP_MARK_MM}"/><path d="M ${trimX + design.widthMm} ${trimY - CROP_MARK_MM} V ${trimY - 0.5}"/>
      <path d="M ${trimX - CROP_MARK_MM} ${trimY + design.heightMm} H ${trimX - 0.5}"/><path d="M ${trimX} ${trimY + design.heightMm + 0.5} V ${trimY + design.heightMm + CROP_MARK_MM}"/>
      <path d="M ${trimX + design.widthMm + 0.5} ${trimY + design.heightMm} H ${trimX + design.widthMm + CROP_MARK_MM}"/><path d="M ${trimX + design.widthMm} ${trimY + design.heightMm + 0.5} V ${trimY + design.heightMm + CROP_MARK_MM}"/>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}">${background}<svg x="${trimX}" y="${trimY}" width="${design.widthMm}" height="${design.heightMm}" viewBox="0 0 ${design.widthMm * 10} ${design.heightMm * 10}" preserveAspectRatio="none">${innerContent}</svg>${crop}</svg>`;
}

export async function createPrintPdfDataUrl(design: StudioDesignDocument) {
  trackStudioClientEvent({ eventName: "export_started", exportFormat: "pdf" });
  try {
    const pageWidthMm = design.widthMm + 2 * (CROP_MARK_MM + BLEED_MM);
    const pageHeightMm = design.heightMm + 2 * (CROP_MARK_MM + BLEED_MM);
    const png = await svgToPngBytesFromSource(buildPrintSvg(design), pageWidthMm, pageHeightMm, PRINT_DPI);
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([pageWidthMm * MM_TO_PT, pageHeightMm * MM_TO_PT]);
    const image = await pdf.embedPng(png);
    page.drawImage(image, { x: 0, y: 0, width: pageWidthMm * MM_TO_PT, height: pageHeightMm * MM_TO_PT });
    pdf.setTitle("Business Card · Print PDF");
    pdf.setSubject(`90 × 50 mm card · ${BLEED_MM} mm bleed · crop marks · ${PRINT_DPI} DPI raster`);
    pdf.setCreator("Kutuzov Studio");
    pdf.setKeywords(["business card", "print", "300 dpi", "3 mm bleed", "crop marks"]);
    const result = dataUrlFromBytes(await pdf.save(), "application/pdf");
    trackStudioClientEvent({ eventName: "export_completed", exportFormat: "pdf" });
    return result;
  } catch (error) {
    trackStudioClientEvent({ eventName: "export_failed", exportFormat: "pdf", metadata: { reason: error instanceof Error ? error.name : "unknown" } });
    throw error;
  }
}

export async function exportPng(design: StudioDesignDocument) {
  const dataUrl = await createPngDataUrl(design);
  const [, base64 = ""] = dataUrl.split(",", 2);
  const binary = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  downloadBlob(new Blob([blobPart(binary)], { type: "image/png" }), "business-card.png");
}

export async function exportPdf(design: StudioDesignDocument) {
  const dataUrl = await createPdfDataUrl(design);
  const [, base64 = ""] = dataUrl.split(",", 2);
  const binary = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  downloadBlob(new Blob([blobPart(binary)], { type: "application/pdf" }), "business-card.pdf");
}

export async function exportPrintPdf(design: StudioDesignDocument) {
  const dataUrl = await createPrintPdfDataUrl(design);
  const [, base64 = ""] = dataUrl.split(",", 2);
  const binary = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  downloadBlob(new Blob([blobPart(binary)], { type: "application/pdf" }), "business-card-print.pdf");
}
