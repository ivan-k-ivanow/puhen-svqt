import jwt from 'jsonwebtoken';

export function generateAuthToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return token;
};


export function verifyAuthToken(token) {
    const secret = process.env.JWT_SECRET;

    return jwt.verify(token, secret);
}