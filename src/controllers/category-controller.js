import { Router } from 'express';
import categoryService from '../services/category-service.js';

const categoryController = Router();
    
categoryController.get('/create', (req, res) => {
    res.render('admin/categories/create', {
        title: 'Създай категория',
        layout: 'admin',
    });
});

categoryController.post('/create', async (req, res) => {
    
    const { name } = req.body;
    await categoryService.createCategory(name);

    res.redirect('/admin/products/create');
});

categoryController.get('/d')

export default categoryController;