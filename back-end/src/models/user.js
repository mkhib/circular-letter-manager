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
    },
    // tokenVersion: {
    //     type: Number,
    //     default: 0
    // }
});

// userSchema.set('toObjenct', { viruals: true });

// var Users = mongoose.model('User', userSchema);

// module.exports = Users;

export default mongoose.model('User', userSchema);