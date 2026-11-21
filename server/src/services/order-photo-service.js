import { randomUUID } from 'node:crypto';
import path from 'node:path';
import supabase from '../lib/supabase.js';

// Снимките на клиентите са лични данни: пазят се в отделен частен bucket
// и се отварят само с временен линк.
function getBucket() {
    const bucket = process.env.SUPABASE_ORDER_BUCKET;

    if (!bucket) {
        throw new Error('SUPABASE_ORDER_BUCKET is not defined.');
    }

    return bucket;
}

const SIGNED_URL_SECONDS = 60 * 60;

async function uploadOrderPhoto(file, folder) {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const storagePath = `${folder}/${randomUUID()}${extension}`;

    const { error } = await supabase.storage
        .from(getBucket())
        .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to upload order photo: ${error.message}`);
    }

    return { path: storagePath, name: file.originalname || path.basename(storagePath) };
}

async function removeOrderPhotos(paths) {
    if (paths.length === 0) {
        return;
    }

    const { error } = await supabase.storage.from(getBucket()).remove(paths);

    if (error) {
        throw new Error(`Failed to remove order photos: ${error.message}`);
    }
}

async function createPhotoLinks(photo) {
    const bucket = supabase.storage.from(getBucket());

    const [{ data: view }, { data: download }] = await Promise.all([
        bucket.createSignedUrl(photo.path, SIGNED_URL_SECONDS),
        bucket.createSignedUrl(photo.path, SIGNED_URL_SECONDS, { download: photo.name || true }),
    ]);

    return {
        url: view?.signedUrl ?? null,
        downloadUrl: download?.signedUrl ?? null,
    };
}

export default {
    uploadOrderPhoto,
    removeOrderPhotos,
    createPhotoLinks,
};
