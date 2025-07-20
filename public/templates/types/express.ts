type IAuthUserRole = 'admin' | 'user';

interface IAuthUser {
    id: number;
    role: IAuthUserRole;
}

declare namespace Express {
    interface Request {
        user: IAuthUser;
    }
}
