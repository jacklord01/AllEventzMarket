import QRCode from "qrcode";

/**
 * Generate a data URL PNG for embedding or emailing.
 * You can also store the PNG to S3 and save the URL instead.
 */
export async function qrDataUrl(payload: Record<string, any>) {
  const text = JSON.stringify(payload);
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 1, scale: 6 });
}
