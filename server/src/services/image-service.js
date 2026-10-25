import imageRepository from '../repositories/image-repository.js';
import { randomUUID } from 'crypto';
import path from 'node:path';
import supabase from '../lib/supabase.js'


async function addImage(imageData) {
    return await imageRepository.addImage(imageData);
}

async function uploadImage(file, productId) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    const extension = path.extname(file.originalname).toLowerCase();
    const storagePath = `${productId}/${randomUUID()}${extension}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);


    try {
        return await imageRepository.addImage({
            productId,
            url: data.publicUrl
        });
    } catch (error) {
        await supabase.storage
            .from(bucket)
            .remove([storagePath]);

        throw new Error(`Failed to add image to repository: ${error.message}`);
    }
}

async function deleteImage(imageId) {
    const image = await imageRepository.getImageById(imageId);

    if (!image) {
        throw new Error(`Image with ID ${imageId} not found`);
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    const publicUrlMarker = `/storage/v1/object/public/${bucket}/`;
    const url = new URL(image.url);
    const markerIndex = url.pathname.indexOf(publicUrlMarker);

    if (markerIndex === -1) {
        throw new Error(`Invalid image URL: ${image.url}`);
    }

    const storagePath = decodeURIComponent(
        url.pathname.slice(markerIndex + publicUrlMarker.length));

    const {error: storageError} = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

    if (storageError) {
        throw new Error(`Failed to remove image from storage: ${storageError.message}`);
    }

    return await imageRepository.deleteImage(imageId);
}

export default {
    addImage,
    uploadImage,
    deleteImage,
};