import * as express from 'express';
const multer = require('multer');
import controller from './controller';

const fileFilter = (_, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/))
    return callback(new Error('Please upload a valid .csv file'), false);
  else return callback(null, true);
};

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, __dirname + `/../../../../../../public/events/`);
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

//Upload a .csv file with field name as "events" as form-data body

export default express
  .Router()
  .get('/', controller.getEvents)
  .post('/', controller.addEvent)
  .put('/:id', controller.editEventDetails)
  .delete('/:id', controller.deleteEvent)
  .get('/qr/:id/:day', controller.generateQRCode)
  .post('/clearattendance', controller.clearAttendances)
  .post('/upload', upload.single('events'), controller.uploadEvents)
  .post('/attendance/upload', upload.any(), controller.uploadAttendance)
  .post('/goodies', controller.addGoodies)
  .post('/winners', controller.addWinners)
  .post('/sendEventReminder', controller.sendEventReminder);
