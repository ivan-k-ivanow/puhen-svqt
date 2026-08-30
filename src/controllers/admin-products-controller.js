import { Router } from 'express';
import categoryService from '../services/category-service.js';

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
    
    const newProductData = req.body;

    try {
        const productData = createProductSchema.parse(newProductData);

        await productService.createProduct(productData);

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