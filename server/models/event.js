import mongoose from 'mongoose';

const Event = new mongoose.Schema({
  //Name of the event
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  //Start Date for the event
  startDate: {
    type: String,
    required: [true, 'Date required'],
  },
  //Number of days the event is going to last
  numberOfDays: {
    type: Number,
    default: 1,
  },
  //Category of the event
  category: {
    type: String,
    required: true,
    enum: ['technical', 'oratory', 'managerial', 'miscellaneous'],
    lowercase: true,
  },
  //Attendance for each day of the event, i.e., attendace[0] will have the attendance for Day 1,
  //attendance[1] for Day 2 and so on.
  attendance: {
    type: [
      {
        type: Number,
        default: 0,
      },
    ],
  },
  //Each event is assigned an importance from 1-3
  importance: Number,
  //Field to denote whether the QR Code for this event was generated or not.
  //This is used to calculate number of completed events.
  qr: {
    type: Boolean,
    default: false,
  },
  //Field to denote whether points were added to winners or not.
  //This is used to calculate total points given to calculate percentage score for a user.
  winners: {
    type: Boolean,
    default: false,
  },
  joinLink: {
    type: String,
  },
});

export default mongoose.model('Event', Event);
