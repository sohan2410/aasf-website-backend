import mongoose from "mongoose";

const Attendance = new mongoose.Schema({
  _id: {
    type: String,
  },
  expireAt: {
    type: Date,
  },
});

Attendance.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Attendance", Attendance);
