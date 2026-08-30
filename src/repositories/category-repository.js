import { prisma } from '../lib/prisma.js';

async function createCategory(name) {
    return await prisma.category.create({
        data: {
            name,
        },
    });
}

async function getAllCategories() {
    return await prisma.category.findMany();
}

async function deleteCategoryById(id) {
    return await prisma.category.delete({
        where: {
            id,
        },
    });
}

async function updateCategoryById(id, name) {
    return await prisma.category.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
}

export default {
    createCategory,
    getAllCategories,
    deleteCategoryById,
    updateCategoryById,
};