import jwt from 'jsonwebtoken';

// Колко дълго админът остава влязъл без да ползва админа.
// Докато работи, сесията се подновява сама (виж shouldRefreshToken).
export const SESSION_DAYS = 30;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

// Подновяваме бисквитката най-много веднъж на ден.
const REFRESH_AFTER_SECONDS = 24 * 60 * 60;

// Сайтът (puhensvqt.com) и API-то (api.puhensvqt.com) са един и същ сайт,
// затова стига SameSite=Lax – бисквитката не се праща от чужди сайтове.
const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
};

export function generateAuthToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: `${SESSION_DAYS}d`,
        algorithm: 'HS256',
    });
}

export function verifyAuthToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
}

export function shouldRefreshToken(decodedToken) {
    const issuedAt = decodedToken?.iat ?? 0;

    return Date.now() / 1000 - issuedAt > REFRESH_AFTER_SECONDS;
}

export function setAuthCookie(res, token) {
    res.cookie('auth', token, { ...AUTH_COOKIE_OPTIONS, maxAge: SESSION_MS });
}

export function clearAuthCookie(res) {
    res.clearCookie('auth', AUTH_COOKIE_OPTIONS);
}
