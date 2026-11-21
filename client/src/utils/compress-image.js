// Смалява снимката в браузъра, преди да се качи.
// Снимка от телефон (3–8 MB) става JPEG около 300–700 KB –
// достатъчно за изработката, а сървърът и клиентът не мъкнат мегабайти.

const MAX_SIDE = 2000;
const QUALITY = 0.85;

export async function compressImage(file) {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
        return file;
    }

    let bitmap;

    try {
        // imageOrientation завърта снимката правилно според EXIF на телефона.
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        // Браузърът не може да отвори формата (напр. HEIC в Chrome) – пращаме оригинала.
        return file;
    }

    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    // Бял фон, за да не почернеят прозрачните PNG-та.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', QUALITY));

    // Ако не е станала по-малка (вече е малка снимка), оставяме оригинала.
    if (!blob || blob.size >= file.size) {
        return file;
    }

    const name = `${file.name.replace(/\.[^.]+$/, '') || 'snimka'}.jpg`;

    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}
