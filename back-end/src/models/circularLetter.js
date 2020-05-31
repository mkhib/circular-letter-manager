import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const circularLetterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    importNumber: {
        type: String,
        required: false
    },
    exportNumber: {
        type: String,
        required: false
    },
    referTo: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    subjectedTo: {
        type: String,
        required: true
    },
    toCategory: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    files: {
        type: Array,
        required: true
    }
});

export default mongoose.model('CircularLetter', circularLetterSchema);