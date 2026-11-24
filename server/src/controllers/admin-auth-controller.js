import { Router } from 'express';
import authService from '../services/auth-service.js';
import { loginSchema } from '../schemas/auth-schema.js';
import { ZodError } from 'zod';
import { generateAuthToken, setAuthCookie, clearAuthCookie } from '../utils/token-utils.js';
import { loginRetryAfter, recordLoginFailure, clearLoginFailures } from '../utils/login-limiter.js';

const adminAuthController = Router();


const WRONG_CREDENTIALS = 'Грешен имейл или парола.';

adminAuthController.post('/login', async (req, res) => {
    let credentials;

    try {
        credentials = loginSchema.parse(req.body);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.issues[0]?.message || 'Невалидни данни.' });
        }

        throw error;
    }

    const { email, password } = credentials;

    // Твърде много грешни опити – спираме входа за малко.
    const retryAfter = loginRetryAfter(req.ip, email);

    if (retryAfter > 0) {
        res.set('Retry-After', String(retryAfter));

        return res.status(429).json({
            message: `Твърде много опити. Опитайте пак след ${Math.ceil(retryAfter / 60)} мин.`,
        });
    }

    try {
        const user = await authService.login(email, password);

        // Едно и също съобщение за грешна парола и за акаунт без админ права,
        // за да не се разбира кои имейли съществуват.
        if (!user || user.role !== 'ADMIN') {
            recordLoginFailure(req.ip, email);

            return res.status(401).json({ message: WRONG_CREDENTIALS });
        }

        clearLoginFailures(req.ip, email);
        setAuthCookie(res, generateAuthToken(user));

        return res.status(200).json({
            message: 'Успешен вход',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({ message: 'Възникна грешка при вход.' });
    }
});

adminAuthController.post('/logout', (req, res) => {
    clearAuthCookie(res);

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