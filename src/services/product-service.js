import productRepository from '../repositories/product-repository.js';

async function createProduct(data) {
    return await productRepository.createProduct(data);
}

async function getAllProducts() {
    return await productRepository.getAllProducts();
}

async function getProductById(id) {
    return await productRepository.getProductById(id);
}

async function getLatestProducts(limit) {
    return await productRepository.getLatestProducts(limit);
}

async function searchProductsByName(name) {
    return await productRepository.searchProductsByName(name);
}

async function getBySlug(slug) {
    return await productRepository.getBySlug(slug);
}

async function updateProduct(id, data) {
    return await productRepository.updateProduct(id, data);
}

async function deleteProduct(id) {
    return await productRepository.deleteProduct(id);
}

export {
    createProduct,
    getAllProducts,
    getProductById,
    getLatestProducts,
    searchProductsByName,
    getBySlug,
    updateProduct,
    deleteProduct,
};
