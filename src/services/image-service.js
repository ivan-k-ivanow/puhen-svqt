import imageRepository from '../repositories/image-repository.js';

async function addImage(imageData) {
    return await imageRepository.addImage(imageData);
}

async function deleteImage(imageId) {
    return await imageRepository.deleteImage(imageId);
}

export default {
    addImage,
    deleteImage,
};