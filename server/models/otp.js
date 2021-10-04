import mongoose from 'mongoose';
const otp = new mongoose.Schema(
  {
    _id: { type: String, required: [true, 'Roll number required'] },
    otp: { type: Number, required: true },
    createdAt: { type: Date, required: true },
  },
  { expiresAfterSeconds: 10 }
);
export default mongoose.model('otp', otp);
