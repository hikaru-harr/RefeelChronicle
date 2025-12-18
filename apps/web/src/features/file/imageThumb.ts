import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import * as exifr from "exifr";

// TODO:実装理解する

function isHeicLike(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function orientationToCanvasTransform(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
) {
  // 1: up, 2: up-mirrored, 3: down, 4: down-mirrored,
  // 5: left-mirrored, 6: right, 7: right-mirrored, 8: left
  switch (orientation) {
    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

async function canvasToFile(
  canvas: HTMLCanvasElement,
  name: string,
  type: string,
  quality = 0.85,
): Promise<File> {
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      type,
      quality,
    );
  });
  return new File([blob], name, { type, lastModified: Date.now() });
}

async function applyExifOrientationIfNeeded(file: File): Promise<File> {
  // exifr は jpg/tiff のEXIFが主。HEICはまずJPEG化してからが安全。
  const orientation = (await exifr.orientation(file).catch(() => 1)) as number;

  if (!orientation || orientation === 1) return file;

  // 画像デコード
  const bitmap = await createImageBitmap(file);
  const w = bitmap.width;
  const h = bitmap.height;

  // 回転するケース(5,6,7,8)は canvas の縦横が入れ替わる
  const swap = [5, 6, 7, 8].includes(orientation);
  const canvas = document.createElement("canvas");
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  orientationToCanvasTransform(ctx, orientation, w, h);
  ctx.drawImage(bitmap, 0, 0);

  const base = file.name.replace(/\.[^.]+$/, "");
  return canvasToFile(canvas, `${base}.oriented.jpg`, "image/jpeg", 0.92);
}

/**
 * originalは保持しつつ、「一覧用thumb」を作る
 * - HEIC/HEIFならJPEG化
 * - EXIF orientation を必要なら補正
 * - 長辺512で圧縮
 */
export async function buildThumbForUpload(input: File): Promise<{
  normalizedOriginal: File; // HEIC→JPEG化した“表示互換”原本（※元のまま保持したいなら別で保存）
  thumb: File;
}> {
  // 1) HEICならJPEGへ（ブラウザ互換のため）
  let normalized = input;
  if (isHeicLike(input)) {
    const convertedBlob = (await heic2any({
      blob: input,
      toType: "image/jpeg",
      quality: 0.95,
    })) as Blob;
    normalized = new File(
      [convertedBlob],
      input.name.replace(/\.(heic|heif)$/i, ".jpg"),
      { type: "image/jpeg", lastModified: Date.now() },
    );
  }

  // 2) 向き補正（必要な場合）
  normalized = await applyExifOrientationIfNeeded(normalized);

  // 3) thumb生成（512px）
  const thumb = (await imageCompression(normalized, {
    maxWidthOrHeight: 512,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.85,
    // 最大サイズ指定もできるが、まずは画質優先でOK
    // maxSizeMB: 0.2,
  })) as File;

  // thumbのファイル名を分かりやすく
  const base = normalized.name.replace(/\.[^.]+$/, "");
  const thumbNamed = new File([thumb], `${base}.thumb.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return { normalizedOriginal: normalized, thumb: thumbNamed };
}
