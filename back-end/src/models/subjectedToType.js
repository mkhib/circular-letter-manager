import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subjectedToTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

export default mongoose.model('SubjectedToType', subjectedToTypeSchema);