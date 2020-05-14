import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
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

fileSchema.set('toObjenct', { viruals: true });

var Files = mongoose.model('Upload', fileSchema);

module.exports = Files;