import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const toCategoryTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

export default mongoose.model('ToCategoryType', toCategoryTypeSchema);