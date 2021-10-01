import mongoose from 'mongoose';
const Achievement = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  eventId: { type: String, required: true, ref: 'Event' },
  position: { type: Number, required: true },
});

export default mongoose.model('Achievement', Achievement);
