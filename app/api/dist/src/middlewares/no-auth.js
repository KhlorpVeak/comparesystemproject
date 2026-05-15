export const noAuthMiddlware = async (c, next) => {
    c.set('noAuth', true);
    await next();
};
