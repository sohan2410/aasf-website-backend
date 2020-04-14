import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"]
  },
  startDate: {
    type: String,
    required: [true, "Date required"]
  },
  numberOfDays: {
    type: Number,
    default: 1
  }
});

export default mongoose.model("User", User);
