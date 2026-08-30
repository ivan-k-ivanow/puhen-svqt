import { Router } from 'express';
import authService from '../services/auth-service.js';
import { loginSchema } from '../schemas/auth-schema.js';
import { ZodError } from 'zod';
import { generateAuthToken } from '../utils/token-utils.js';

const adminAuthController = Router();

adminAuthController.get('/login', (req, res) => {
    res.render('admin/auth/login', {
        title: 'Админ вход',
        layout: 'admin',
    });
});

adminAuthController.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await authService.login(email, password);

        const token = generateAuthToken(user);

        res.cookie('auth', token, {
            httpOnly: true,
        });

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);

        let errorMessage = 'Възникна грешка. Моля, опитайте отново.';

        if (error instanceof ZodError) {
            errorMessage = error.issues[0].message;
        } else {
            errorMessage = error.message;
        }

        res.status(400).render('admin/auth/login', {
            title: 'Админ вход',
            layout: 'admin',
            error: errorMessage,
        });
    }
});

adminAuthController.post('/logout', (req, res) => {
    res.clearCookie('auth');

    res.redirect('/admin/login');
});

export default adminAuthController;