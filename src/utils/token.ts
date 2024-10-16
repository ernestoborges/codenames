import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const generateToken = ({ roomId, username, uuid }: { roomId: string, username: string, uuid: string }) => {
    return jwt.sign({ roomId, username, uuid }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        if(!token) return null;
        const decoded = jwt.verify(token, SECRET_KEY);
        if (typeof decoded === 'object') {
            return decoded as JwtPayload;
        }
        return null;
    } catch (err) {
        return null;
    }
};