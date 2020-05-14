import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    personelNumber: {
        type: Number,
        required: true,
        unique: true
    },
    identificationNumber: {
        type: Number,
        required: true
    },
    authorized: {
        type: Boolean,
        required: true
    },
    changedPassword: {
        type: Boolean,
        required: true
    }
});

userSchema.set('toObjenct', { viruals: true });

var Users = mongoose.model('User', userSchema);

module.exports = Users;