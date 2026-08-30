import { Router } from 'express';
import categoryService from '../services/category-service.js';
import productService from '../services/product-service.js';
import { createProductSchema } from '../schemas/product-schema.js';

const adminProductsController = Router();

adminProductsController.get('/create', async (req, res) => {

    const categories = await categoryService.getAllCategories();

    res.render('admin/create', {
        title: 'Добави продукт',
        layout: 'admin',
        categories
    });
});

adminProductsController.post('/create', async (req, res) => {
    try {
        const productData = {
            ...req.body,
            categoryIds: Array.isArray(req.body.categoryIds)
                ? req.body.categoryIds
                : [req.body.categoryIds]
        };

        const validatedData = createProductSchema.parse(productData);

        await productService.createProduct(validatedData);

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(400).send('Invalid product data.');
    }
});

adminProductsController.get('/edit/:id', async (req, res) => {
    
    const categories = await categoryService.getAllCategories();

    res.render('admin/edit', {
        title: 'Редактирай продукт',
        layout: 'admin',
        categories
    });
});

export default adminProductsController;