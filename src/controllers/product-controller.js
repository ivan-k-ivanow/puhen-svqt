import { Router } from 'express';
import productService from '../services/product-service.js';

const productController = Router();

productController.get('/:slug', async (req, res) => {

    const { slug } = req.params;

    try {

        const product = await productService.getProductBySlug(slug);

        const categoryIds = product.categories.map(category => category.id);

        const similarProducts = await productService.getSimilarProducts(
            product.id,
            categoryIds,
            6
        );

        if (!product) {
            return res.status(404).send('Product not found.');
        }

        res.render('product/details', {
            title: product.name,
            product,
            similarProducts
        });

    } catch (error) {

        console.error(error);
        res.status(500).send('Something went wrong.');

    }
});

export default productController;