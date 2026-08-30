import { Router } from 'express';
import productService from '../services/product-service.js';
const adminController = Router();

adminController.get('/', async (req, res) => {

    const products = await productService.getAllProducts();
    res.render('admin/index', {
        title: 'Admin Panel',
        layout: 'admin',
        products
    });
});

export default adminController;