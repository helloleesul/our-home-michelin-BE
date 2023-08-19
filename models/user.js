import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  fridge: {
    ingredient: [
      {
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        bestBefore : { type: Date, require: true}
      },
    ],
  },
});

export default mongoose.model('User', userSchema);
