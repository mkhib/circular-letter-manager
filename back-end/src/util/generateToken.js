import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const token = jwt.sign({
        userId
    }, "pwtfkipoewofkipejgfpewdjfpdoewfpokwxcvdjvkdsjf", {
        expiresIn: '10h'
    });

    return token;
}

export default generateToken;