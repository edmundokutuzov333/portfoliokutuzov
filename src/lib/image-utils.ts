// Utility helpers for handling image uploads with real proportions preserved.

export type ImageDimensions = { width: number; height: number };

/** Reads naturalWidth/Height from a File before upload. */
export async function readImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dims);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/** Returns a CSS aspect-ratio string (e.g. "16 / 9") or undefined. */
export function aspectFromDims(width?: number | null, height?: number | null) {
  if (!width || !height) return undefined;
  return `${width} / ${height}`;
}
