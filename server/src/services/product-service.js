import { generateSlug } from '../utils/slug.js';
import productRepository from '../repositories/product-repository.js';
async function createProduct(data) {
    const { categoryIds, ...productData } = data;

    productData.slug = generateSlug(productData.name);

    productData.categories = {
        connect: categoryIds.map(id => ({ id }))
    };

    return await productRepository.createProduct(productData);
}

async function getAllProducts() {
    return await productRepository.getAllProducts();
}

async function getProductById(id) {
    return await productRepository.getProductById(id);
}

async function getProductsByCategory(categoryId) {
    return await productRepository.getProductsByCategory(categoryId);
}

async function getLatestProducts(limit) {
    return await productRepository.getLatestProducts(limit);
}

async function getSimilarProducts(productId, categoryIds, limit = 6) {
    return await productRepository.getSimilarProducts(
        productId,
        categoryIds,
        limit
    );
}

async function searchProductsByName(name) {
    return await productRepository.searchProductsByName(name);
}

async function getProductBySlug(slug) {
    return await productRepository.getProductBySlug(slug);
}

async function updateProduct(id, data) {
    const { categoryIds, ...productData } = data;

    return await productRepository.updateProduct(id, {
        ...productData,
        categories: {
            set: categoryIds.map(categoryId => ({ id: categoryId }))
        }
    });
}

async function deleteProduct(id) {
    return await productRepository.deleteProduct(id);
}

export default {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getLatestProducts,
    searchProductsByName,
    getProductBySlug,
    getSimilarProducts,
    updateProduct,
    deleteProduct,
};
