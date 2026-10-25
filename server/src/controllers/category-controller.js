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


categoryController.post('/create', async (req, res) => {
      console.log('Request body:', req.body);

    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Името на категорията е задължително' });
        }

        const category = await categoryService.createCategory(name);

        return res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Грешка при създаване на категория' });
    }
});


categoryController.delete('/delete/:id', async (req, res) => {
    try {
        await categoryService.deleteCategoryById(req.params.id);

        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

export default categoryController;