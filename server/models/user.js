import mongoose from 'mongoose';
import { defaultPassword } from '../common/config';

const User = new mongoose.Schema({
  //Primary Key of the user will be their roll number
  _id: {
    type: String,
    required: [true, 'Roll number required'],
  },
  //Name of the user
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  email: {
    type: String,
  },
  //Hashed password
  password: {
    type: String,
    default: defaultPassword,
  },
  //Firebase Cloud Messaging Token for push notifications
  fcmToken: {
    type: String,
  },
  //Base-64 encoded display picture or link to image on CDN
  dp: {
    type: String,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  //Scores in different categories
  score: {
    technical: {
      type: Number,
      default: 0,
    },
    managerial: {
      type: Number,
      default: 0,
    },
    oratory: {
      type: Number,
      default: 0,
    },
  },
  //Role of the user - user/admin. user by default
  role: {
    type: String,
    default: 'user',
  },
});

export default mongoose.model('User', User);
