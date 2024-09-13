import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const generateToken = (userId: string, roomId: string) => {
    return jwt.sign({ userId, roomId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (typeof decoded === 'object') {
            return decoded as JwtPayload;
        }
        return null;
    } catch (err) {
        return null;
    }
};