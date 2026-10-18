import { Router } from 'express';
import productService from '../services/product-service.js';
import categoryService from '../services/category-service.js';

const homeController = Router();

homeController.get('/', async (req, res) => {


    const categories = await categoryService.getAllCategories();
    const categoryId = req.query.category;

    const products = categoryId
        ? await productService.getProductsByCategory(categoryId)
        : await productService.getAllProducts();



    res.render('home', { title: 'Home Page', products, categories, selectedCategory: categoryId });
});

homeController.get('/search', async (req, res) => {
    try {
        const query = req.query.q?.trim();

        if (!query) {
            return res.json([]);
        }

        const products = await productService.searchProductsByName(query);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Грешка при търсенето.'
        });
    }
});

homeController.get('/filter', async (req, res) => {
    try {
        const categoryId = req.query.category;

        const products = categoryId
            ? await productService.getProductsByCategory(categoryId)
            : await productService.getAllProducts();

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Грешка при зареждането на продуктите.' });
    }
});



// React API endpoint for fetching all products

homeController.get('/api/products', async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Грешка при зареждането на продуктите.'
        });
    }
});


export default homeController;


// React API endpoint for fetching a single product by slug
homeController.get('/api/products/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await productService.getProductBySlug(slug);

        if (!product) {
            return res.status(404).json({ message: 'Продуктът не е намерен.' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Грешка при зареждането на продукта.' });
    }
});