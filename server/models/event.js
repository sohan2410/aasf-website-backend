import mongoose from "mongoose";

const Event = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  startDate: {
    type: String,
    required: [true, "Date required"],
  },
  numberOfDays: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
    required: true,
    enum: ["technical", "oratory", "managerial", "miscellaneous"],
    lowercase: true,
  },
  attendance: {
    type: [
      {
        type: Number,
        default: 0,
      },
    ],
  },
  importance: Number,
  qr: {
    type: Boolean,
    default: false,
  },
  winners: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Event", Event);
