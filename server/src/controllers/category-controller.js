import { Router } from 'express';
import categoryService from '../services/category-service.js';

const categoryController = Router();

categoryController.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        return res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);

        return res.status(500).json({ error: 'Грешка при извличане на категориите' });
    }
});
    
categoryController.get('/create', (req, res) => {
    res.render('admin/categories/create-category', {
        title: 'Създай категория',
        layout: 'admin',
    });
});

categoryController.post('/create', async (req, res) => {
    
    const { name } = req.body;
    await categoryService.createCategory(name);

    res.redirect('/admin/products/create');
});


categoryController.delete('/delete/:id', async (req, res) => {
    try {
        await categoryService.deleteCategoryById(req.params.id);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

export default categoryController;