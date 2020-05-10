import mongoose from "mongoose";
import { defaultPassword } from "../common/config";

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
    default: defaultPassword
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
    first: {
      type: [String],
      default: []
    },
    second: {
      type: [String],
      default: []
    },
    third: {
      type: [String],
      default: []
    }
  },
  role: {
    type: String,
    default: "user"
  }
});

export default mongoose.model("User", User);
