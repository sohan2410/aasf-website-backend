import mongoose from "mongoose";

const User = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, "Roll number required"]
  },
  name: {
    type: String,
    required: [true, "Name required"]
  },
  password: {
    type: String,
    default: "$2y$10$EO8svgIoIJTEclQZ8XgvOe5IkDXw2ODgQnnIK8.L0dmIIrjkI6hKC"
  },
  dp: {
    type: String
    //set a default dp later
  },
  score: {
    technical: {
      type: Number,
      default: 0
    },
    managerial: {
      type: Number,
      default: 0
    },
    oratory: {
      type: Number,
      default: 0
    }
  },
  achievements: {
    first: [String],
    second: [String],
    third: [String]
  },
  role: {
    type: String,
    default: "user"
  }
});

export default mongoose.model("User", User);
