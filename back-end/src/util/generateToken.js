import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const token = jwt.sign({
        userId
    }, "pwtfkipoewofkipejgfpewdjfpdoewfpokwxcvdjvkdsjf", {
        expiresIn: '2h'
    });

    return token;
}

export default generateToken;