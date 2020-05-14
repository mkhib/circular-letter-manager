import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    expires: {
        type: Date
    },
    session: {
        type: String
    }
});

module.exports = mongoose.model('Sessions', sessionSchema);