import imageCompression from "browser-image-compression";

function assertBrowser() {
	if (typeof window === "undefined") {
		throw new Error("imageThumb can only run in the browser");
	}
}

function isHeicLike(file: File) {
	const name = file.name.toLowerCase();
	return (
		file.type === "image/heic" ||
		file.type === "image/heif" ||
		name.endsWith(".heic") ||
		name.endsWith(".heif")
	);
}

async function toJpegIfHeic(input: File): Promise<File> {
	if (!isHeicLike(input)) return input;

	assertBrowser();

	// ★ ここがポイント：動的 import（ブラウザで呼ばれた時だけ読み込む）
	const { default: heic2any } = await import("heic2any");

	const convertedBlob = (await heic2any({
		blob: input,
		toType: "image/jpeg",
		quality: 0.95,
	})) as Blob;

	return new File(
		[convertedBlob],
		input.name.replace(/\.(heic|heif)$/i, ".jpg"),
		{ type: "image/jpeg", lastModified: Date.now() },
	);
}

async function applyExifOrientationIfNeeded(input: File): Promise<File> {
	assertBrowser();

	// ★ exifr も動的 import
	const exifr = await import("exifr");

	const orientation = (await exifr.orientation(input).catch(() => 1)) as number;
	if (!orientation || orientation === 1) return input;

	const bitmap = await createImageBitmap(input);
	const w = bitmap.width;
	const h = bitmap.height;

	const swap = [5, 6, 7, 8].includes(orientation);
	const canvas = document.createElement("canvas");
	canvas.width = swap ? h : w;
	canvas.height = swap ? w : h;

	const ctx = canvas.getContext("2d");
	if (!ctx) return input;

	// orientation transform
	switch (orientation) {
		case 2:
			ctx.translate(w, 0);
			ctx.scale(-1, 1);
			break;
		case 3:
			ctx.translate(w, h);
			ctx.rotate(Math.PI);
			break;
		case 4:
			ctx.translate(0, h);
			ctx.scale(1, -1);
			break;
		case 5:
			ctx.rotate(0.5 * Math.PI);
			ctx.scale(1, -1);
			break;
		case 6:
			ctx.rotate(0.5 * Math.PI);
			ctx.translate(0, -h);
			break;
		case 7:
			ctx.rotate(0.5 * Math.PI);
			ctx.translate(w, -h);
			ctx.scale(-1, 1);
			break;
		case 8:
			ctx.rotate(-0.5 * Math.PI);
			ctx.translate(-w, 0);
			break;
		default:
			break;
	}

	ctx.drawImage(bitmap, 0, 0);

	const blob: Blob = await new Promise((resolve, reject) => {
		canvas.toBlob(
			(b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
			"image/jpeg",
			0.92,
		);
	});

	const base = input.name.replace(/\.[^.]+$/, "");
	return new File([blob], `${base}.oriented.jpg`, {
		type: "image/jpeg",
		lastModified: Date.now(),
	});
}

export async function buildThumbForUpload(input: File): Promise<{
	normalizedOriginal: File;
	thumb: File;
}> {
	assertBrowser();

	// 1) HEIC→JPEG
	let normalized = await toJpegIfHeic(input);

	// 2) 向き補正（必要なら）
	normalized = await applyExifOrientationIfNeeded(normalized);

	// 3) thumb生成
	const thumb = (await imageCompression(normalized, {
		maxWidthOrHeight: 512,
		useWebWorker: true,
		fileType: "image/jpeg",
		initialQuality: 0.85,
	})) as File;

	const base = normalized.name.replace(/\.[^.]+$/, "");
	const thumbNamed = new File([thumb], `${base}.thumb.jpg`, {
		type: "image/jpeg",
		lastModified: Date.now(),
	});

	return { normalizedOriginal: normalized, thumb: thumbNamed };
}
