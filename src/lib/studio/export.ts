import { PDFDocument } from "pdf-lib";
import { designToSvg } from "./svg";
import type { StudioDesignDocument } from "./types";

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
  const svg = designToSvg(design);
  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "business-card.svg");
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
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportPng(design: StudioDesignDocument) {
  const png = await svgToPngBytes(design);
  downloadBlob(new Blob([png], { type: "image/png" }), "business-card.png");
}

export async function exportPdf(design: StudioDesignDocument) {
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
  const bytes = await pdf.save();
  downloadBlob(new Blob([bytes], { type: "application/pdf" }), "business-card.pdf");
}
