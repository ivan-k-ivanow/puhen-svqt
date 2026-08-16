import { Router } from 'express';

const adminLoginController = Router();

adminLoginController.get('/', (req, res) => {
    res.render('admin/auth/login', {
        title: 'Admin Login',
        layout: 'admin'
    });
});

export default adminLoginController;