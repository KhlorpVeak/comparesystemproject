import { UnauthorizedException } from '@comparesystem/error';
import { db } from '@comparesystem/db';
export const authMiddleware = async (c, next) => {
    const isAuthRoute = c.req.path.includes('/auth/register') || c.req.path.includes('/auth/login');
    if (c.get('noAuth') || isAuthRoute) {
        await next();
        return;
    }
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException({ message: 'Token is not provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = await db
            .selectFrom('user_session')
            .where('token', '=', token)
            .innerJoin('users', 'users.id', 'user_session.userId')
            .selectAll('users')
            .executeTakeFirstOrThrow();
        c.set('users', user);
        await next();
    }
    catch (err) {
        throw new UnauthorizedException({ message: 'Invalid token' });
    }
};
