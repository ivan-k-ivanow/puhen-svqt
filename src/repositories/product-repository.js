import { prisma } from '../lib/prisma.js';


async function createProduct(data) {
    return prisma.product.create({
        data,
    });
}

async function getAllProducts() {
    return prisma.product.findMany({
        include: {
            category: true,
            images: true,
        },
    });
}

async function getProductById(id) {
    return prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            images: true,
        },
    });
}

async function getLatestProducts(limit) {
    return prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        include: {
            category: true,
            images: true,
        },
    });
};

async function searchProductsByName(name) {
    return prisma.product.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
        },
        include: {
            category: true,
            images: true,
        },
    });
}

async function getBySlug(slug) {
    return prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,
            images: true,
        },
    });
}

async function updateProduct(id, data) {
    return prisma.product.update({
        where: {
            id,
        },
        data,
    });
}

async function deleteProduct(id) {
    return prisma.product.delete({
        where: {
            id,
        },
    });
}

export {
    createProduct,
    getAllProducts,
    getProductById,
    getBySlug,
    getLatestProducts,
    searchProductsByName,
    updateProduct,
    deleteProduct,
};