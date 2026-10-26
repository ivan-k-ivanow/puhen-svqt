import { Router } from 'express';
import authService from '../services/auth-service.js';
import { loginSchema } from '../schemas/auth-schema.js';
import { ZodError } from 'zod';
import { generateAuthToken } from '../utils/token-utils.js';

const adminAuthController = Router();


adminAuthController.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await authService.login(email, password);
        const token = generateAuthToken(user);

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Нямате достъп до тази страница.' });
        }

        res.cookie('auth', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
        });

        return res.status(200).json({
            message: 'Успешен вход',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: 'Невалидни данни', errors: error.errors });
        }

        console.error(error);

        return res.status(500).json({ message: 'Възникна грешка при вход' });
    }
});

adminAuthController.post('/logout', (req, res) => {
    res.clearCookie('auth', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return res.status(200).json({ message: 'Успешен изход' });
});


adminAuthController.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'Не сте влезли в системата.',
        });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'Нямате права за достъп до админ панела.',
        });
    }

    return res.status(200).json({
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
        },
    });
});


export default adminAuthController;