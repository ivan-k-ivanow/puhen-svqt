import { Router } from 'express';
import productService from '../services/product-service.js';

const productController = Router();


// React API endpoint for fetching a single product by slug
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

// productController.get('/:slug', async (req, res) => {

//     const { slug } = req.params;

//     try {

//         const product = await productService.getProductBySlug(slug);

//         const categoryIds = product.categories.map(category => category.id);

//         const similarProducts = await productService.getSimilarProducts(
//             product.id,
//             categoryIds,
//             6
//         );

//         if (!product) {
//             return res.status(404).send('Product not found.');
//         }

//         res.render('product/details', {
//             title: product.name,
//             product,
//             similarProducts
//         });

//     } catch (error) {

//         console.error(error);
//         res.status(500).send('Something went wrong.');

//     }
// });


export default productController;






