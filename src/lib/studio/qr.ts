import qrcode from "qrcode-generator";

export function qrDataUrl(value: string, cellSize = 8) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  return qr.createDataURL(cellSize, 0);
}
