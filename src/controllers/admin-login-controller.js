import { Router } from 'express';
import { loginSchema } from '../schemas/auth-schema.js';
import authService from '../services/auth-service.js';

const adminLoginController = Router();

adminLoginController.get('/', (req, res) => {
    res.render('admin/auth/login', {
        title: 'Admin Login',
        layout: 'admin'
    });
});

adminLoginController.post('/', async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await authService.login(email, password);

    console.log(user);

    res.redirect('/admin');
});

export default adminLoginController;