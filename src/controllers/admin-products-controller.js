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

adminProductsController.get('/edit', (req, res) => {
    res.render('admin/edit', {
        title: 'Редактирай продукт',
        layout: 'admin'
    });
});

export default adminProductsController;