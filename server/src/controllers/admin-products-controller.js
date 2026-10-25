import { Router } from 'express';
import categoryService from '../services/category-service.js';
import productService from '../services/product-service.js';
import { createProductSchema, updateProductSchema } from '../schemas/product-schema.js';
import upload from '../middlewares/upload-middleware.js';
import imageService from '../services/image-service.js';

const adminProductsController = Router();

adminProductsController.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProductsForAdmin();

        return res.json(products);
    } catch (error) {
        console.error('Error fetching admin products:', error);

        return res.status(500).json({
            message: 'Грешка при зареждането на продуктите.'
        });
    }
});


adminProductsController.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Грешка при зареждането на продукта.' });
    }
});



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




adminProductsController.put(
    '/:id',
    upload.array('images', 10),
    async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: 'Продуктът не е намерен.',
                });
            }

            const productData = {
                name: req.body.name,
                price: req.body.price,
                shortDescription: req.body.shortDescription,
                description: req.body.description,
            };

            if (req.body.categoryIds !== undefined) {
                productData.categoryIds = Array.isArray(req.body.categoryIds)
                    ? req.body.categoryIds
                    : [req.body.categoryIds];
            }

            const validatedData = updateProductSchema.parse(productData);

            const deletedImageIds = req.body.deletedImageIds
                ? JSON.parse(req.body.deletedImageIds)
                : [];

            for (const imageId of deletedImageIds) {
                const belongsToProduct = product.images.some(
                    image => image.id === imageId
                );

                if (!belongsToProduct) {
                    return res.status(400).json({
                        message: 'Невалидна снимка за изтриване.',
                    });
                }
            }

            await productService.updateProduct(
                req.params.id,
                validatedData
            );

            for (const file of req.files ?? []) {
                await imageService.uploadImage(file, req.params.id);
            }

            for (const imageId of deletedImageIds) {
                await imageService.deleteImage(imageId);
            }

            const updatedProduct = await productService.getProductById(
                req.params.id
            );

            return res.json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);

            return res.status(400).json({
                message: 'Грешка при редактирането на продукта.',
            });
        }
    }
);




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