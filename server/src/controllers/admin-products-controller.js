import { Router } from 'express';
import categoryService from '../services/category-service.js';
import productService from '../services/product-service.js';
import imageService from '../services/image-service.js';
import { createProductSchema, updateProductSchema } from '../schemas/product-schema.js';

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

adminProductsController.get('/details/:id', async (req, res) => {
    const product = await productService.getProductById(req.params.id);

    res.render('admin/details', {
        title: 'Детайли за продукт',
        layout: 'admin',
        product
    });
});


adminProductsController.get('/edit/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        const categories = await categoryService.getAllCategories();

        const productCategoryIds = product.categories.map(category => category.id);

        const categoriesWithSelection = categories.map(category => ({
            ...category,
            selected: productCategoryIds.includes(category.id)
        }));

        res.render('admin/edit', {
            title: 'Редактирай продукт',
            layout: 'admin',
            product,
            categories: categoriesWithSelection
        });
    } catch (error) {
        console.error(error);
        res.status(404).send('Product not found.');
    }
});


adminProductsController.post('/edit/:id', async (req, res) => {
    try {
        const productData = {
            ...req.body,
            categoryIds: Array.isArray(req.body.categoryIds)
                ? req.body.categoryIds
                : [req.body.categoryIds]
        };

        const validatedData = updateProductSchema.parse(productData);

        await productService.updateProduct(req.params.id, validatedData);

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(400).send('Invalid product data.');
    }
});


adminProductsController.delete('/:id', async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Product not found.' });
    }
});


export default adminProductsController;