export type OptimizedImage = {
  dominantColor: string | null;
  width: number;
  height: number;
  webp: Blob | null;
  avif: Blob | null;
};

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')).join('');
}

async function blobFromCanvas(canvas: HTMLCanvasElement, type: string, quality = 0.86) {
  if (!canvas.toBlob) return null;
  return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function optimizeImageForLibrary(file: File, maxDimension = 2400): Promise<OptimizedImage | null> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return null;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) { bitmap.close(); return null; }
  context.drawImage(bitmap, 0, 0, width, height);
  const sampleSize = 32;
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleSize;
  sampleCanvas.height = sampleSize;
  const sample = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sample) { bitmap.close(); return null; }
  sample.drawImage(bitmap, 0, 0, sampleSize, sampleSize);
  const pixels = sample.getImageData(0, 0, sampleSize, sampleSize).data;
  let r = 0; let g = 0; let b = 0; let weight = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] / 255;
    if (alpha < 0.2) continue;
    r += pixels[i] * alpha; g += pixels[i + 1] * alpha; b += pixels[i + 2] * alpha; weight += alpha;
  }
  bitmap.close();
  const dominantColor = weight ? rgbToHex(r / weight, g / weight, b / weight) : null;
  const webp = await blobFromCanvas(canvas, 'image/webp', 0.86);
  const avif = await blobFromCanvas(canvas, 'image/avif', 0.78);
  return { dominantColor, width, height, webp, avif };
}

export async function blobToFile(blob: Blob, name: string) {
  return new File([blob], name, { type: blob.type, lastModified: Date.now() });
}
