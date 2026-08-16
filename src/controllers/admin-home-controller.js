import { Router } from 'express';

const adminController = Router();

adminController.get('/', (req, res) => {
    res.render('admin/index', {
        title: 'Admin Panel',
        layout: 'admin'
    });
});

export default adminController;