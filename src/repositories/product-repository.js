import { prisma } from '../lib/prisma.js';


async function createProduct(data) {
    return prisma.product.create({
        data,
    });
}

async function getAllProducts() {
    return prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            categories: true,
            images: true
        }
    });
}

async function getProductById(id) {
    return prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            categories: true,
            images: true,
        },
    });
}

async function getProductsByCategory(categoryId) {
    return prisma.product.findMany({
        where: {
            categoryId,
        },
        include: {
            categories: true,
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
            categories: true,
            images: true,
        },
    });
};

async function getSimilarProducts(productId, categoryIds, limit = 6) {
    return await prisma.product.findMany({
        where: {
            id: {
                not: productId,
            },
            categories: {
                some: {
                    id: {
                        in: categoryIds,
                    },
                },
            },
            isActive: true,
        },
        include: {
            categories: true,
            images: true,
        },
        take: limit,
    });
}

async function searchProductsByName(name) {
    return prisma.product.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
        },
        include: {
            categories: true,
            images: true,
        },
    });
}

async function getProductBySlug(slug) {
    return prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            categories: true,
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

export default {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductBySlug,
    getLatestProducts,
    getSimilarProducts,
    searchProductsByName,
    updateProduct,
    deleteProduct,
};