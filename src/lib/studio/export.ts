import { PDFDocument } from "pdf-lib";
import { designToSvg } from "./svg";
import type { StudioDesignDocument } from "./types";
import { trackStudioClientEvent } from "./analytics";

const RASTER_SCALE = 4;

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

async function svgToPngBytes(design: StudioDesignDocument): Promise<Uint8Array> {
  const svg = designToSvg(design);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    const width = Math.round(design.widthMm * 3.7795275591 * RASTER_SCALE);
    const height = Math.round(design.heightMm * 3.7795275591 * RASTER_SCALE);
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
  } finally { URL.revokeObjectURL(url); }
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
    const width = design.widthMm / 25.4 * 72;
    const height = design.heightMm / 25.4 * 72;
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
