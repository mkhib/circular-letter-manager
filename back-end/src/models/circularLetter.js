import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose_fuzzy_searching from 'mongoose-fuzzy-searching-v2';
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

circularLetterSchema.plugin(mongoosePaginate);
circularLetterSchema.plugin(mongoose_fuzzy_searching, {
    fields:
        ["title", "tags", "from", "referTo", "importNumber", "exportNumber", "number", "toCategory", "subjectedTo", "date"]
});

export default mongoose.model('CircularLetter', circularLetterSchema);