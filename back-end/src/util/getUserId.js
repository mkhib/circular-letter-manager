import jwt from 'jsonwebtoken';

const getUserId = (req, requireAuth = true) => {
    const header = req.headers.authorization || '';

    if (header) {
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, "pwtfkipoewofkipejgfpewdjfpdoewfpokwxcvdjvkdsjf");
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required');
    }

    return null;
}

export { getUserId as default }