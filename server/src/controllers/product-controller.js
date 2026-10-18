import { Router } from 'express';
import productService from '../services/product-service.js';

const productController = Router();

productController.get('/:slug/similar', async (req, res) => {
    try {
        const { slug } = req.params;

        // 1. Find the current product
        const product = await productService.getProductBySlug(slug);

        if (!product) {
            return res.status(404).json({
                message: 'Продуктът не е намерен.'
            });
        }

        // 2. Get the IDs of its categories
        const categoryIds = product.categories.map(category => category.id);

        // 3. Find similar products
        const similarProducts = await productService.getSimilarProducts(
            product.id,
            categoryIds,
            6
        );

        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Грешка при зареждането на подобните продукти.'
        });
    }
});

productController.get('/:slug', async (req, res) => {
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

export default productController;






