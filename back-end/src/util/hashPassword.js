import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password length should be more than 8 characters.');
    }

    const hashed = bcrypt.hash(password, 12);
    return hashed;
}