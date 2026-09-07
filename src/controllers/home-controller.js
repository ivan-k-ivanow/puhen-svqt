import { Router } from 'express';
import productService from '../services/product-service.js';

const homeController = Router();

homeController.get('/', async (req, res) => {

    const products = await productService.getAllProducts();



    res.render('home', { title: 'Home Page', products });
});

export default homeController;