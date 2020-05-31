import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
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
        type: String,
        required: true,
        unique: true
    },
    identificationNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    authorized: {
        type: Boolean,
        required: true
    },
    changedPassword: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('User', userSchema);