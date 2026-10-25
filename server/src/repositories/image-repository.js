import { prisma } from '../lib/prisma.js';

async function addImage(imageData) {
    try {
        const newImage = await prisma.image.create({
            data: imageData,
        });
        return newImage;
    } catch (error) {
        console.error('Error adding image:', error);
        throw error;
    }
}

async function getImageById(imageId) {
    return await prisma.image.findUnique({
        where: {
            id: imageId,
        },
    });
}


async function deleteImage(imageId) {
    try {
        const deletedImage = await prisma.image.delete({
            where: {
                id: imageId,
            },
        });
        return deletedImage;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

export default {
    addImage,
    getImageById,
    deleteImage,
};
