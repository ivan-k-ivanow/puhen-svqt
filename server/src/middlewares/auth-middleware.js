import authService from '../services/auth-service.js';
import {
    verifyAuthToken,
    generateAuthToken,
    shouldRefreshToken,
    setAuthCookie,
    clearAuthCookie,
} from '../utils/token-utils.js';

// Чете бисквитката „auth“ и слага влезлия потребител в req.user.
// Докато админът ползва сайта, сесията се подновява (най-много веднъж на ден),
// така че остава влязъл, без да въвежда паролата отново.
export async function authMiddleware(req, res, next) {
    const token = req.cookies.auth;

    if (!token) {
        return next();
    }

    let decodedToken;

    try {
        decodedToken = verifyAuthToken(token);
    } catch {
        clearAuthCookie(res);
        return next();
    }

    if (decodedToken.role === 'ADMIN' && shouldRefreshToken(decodedToken)) {
        try {
            // Проверяваме в базата, че акаунтът още съществува и е админ.
            const admin = await authService.getActiveAdmin(decodedToken.id);

            if (!admin) {
                clearAuthCookie(res);
                return next();
            }

            setAuthCookie(res, generateAuthToken(admin));
        } catch (error) {
            // Ако базата не отговори, просто не подновяваме този път.
            console.error('Session refresh error:', error);
        }
    }

    req.user = decodedToken;
    res.locals.user = decodedToken;

    next();
}

export function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Нямате достъп.' });
    }

    next();
}
