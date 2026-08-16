import { Router } from 'express';

const adminProductsController = Router();

adminProductsController.get('/create', (req, res) => {
    res.render('admin/create', {
        title: 'Добави продукт',
        layout: 'admin'
    });
});

adminProductsController.get('/edit', (req, res) => {
    res.render('admin/edit', {
        title: 'Редактирай продукт',
        layout: 'admin'
    });
});

export default adminProductsController;