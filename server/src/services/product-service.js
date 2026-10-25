import { generateSlug } from '../utils/slug.js';
import productRepository from '../repositories/product-repository.js';
import imageService from './image-service.js';
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

async function getAllProductsForAdmin() {
    return await productRepository.getAllProductsForAdmin();
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

    if (productData.name) {
        productData.slug = generateSlug(productData.name);
    }

    if (categoryIds) {
        productData.categories = {
            set: categoryIds.map(categoryId => ({ id: categoryId }))
        };
    }

    return await productRepository.updateProduct(id, productData);
}

async function deleteProduct(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
        throw new Error('Продуктът не е намерен.');
    }

    for( const image of product.images) {
        await imageService.deleteImage(image.id);
    }

    return await productRepository.deleteProduct(id);
}

async function updateProductPositions(productIds) {
    const products = productIds.map((id, index) => ({
        id,
        position: index + 1
    }));

    return await productRepository.updateProductPositions(products);
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
    getAllProductsForAdmin,
    updateProductPositions
};
