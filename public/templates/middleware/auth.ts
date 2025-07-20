import { auth } from '@/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const { validateToken } = {
    validateToken: (roles?: IAuthUserRole[]) => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const token = req.header('Authorization');

            if (!token) {
                res.status(401).json({ message: 'access denied' });
                return;
            }
            const accessToken = token.split(' ')[1];

            try {
                const decoded = jwt.verify(accessToken, auth.jwt.access.secret) as IAuthUser;
                req.user = decoded;

                if (!roles) return next();

                if (!roles?.includes(decoded.role)) {
                    res.status(403).json({ message: 'permission denied' });
                    return;
                }

                next();
            } catch (error) {
                res.status(401).json({ message: 'invalid token' });
            }
        };
    }
};
