import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  encoding: {
    type: String,
    required: true
  }
});

export default mongoose.model('Upload', fileSchema);