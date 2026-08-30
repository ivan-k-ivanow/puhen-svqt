import categoryRepository from '../repositories/category-repository.js';

async function createCategory(name) {
    return await categoryRepository.createCategory(name);
}

async function getAllCategories() {
    return await categoryRepository.getAllCategories();
}

async function deleteCategoryById(id) {
    return await categoryRepository.deleteCategoryById(id);
}

// async function updateCategoryById(id, name) {
//     return await categoryRepository.updateCategoryById(id, name);
// }

export default {
    createCategory,
    getAllCategories,
    deleteCategoryById,
    // updateCategoryById,
};