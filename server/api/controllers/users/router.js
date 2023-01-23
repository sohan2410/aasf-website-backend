import * as express from 'express';
import multer from 'multer';
import Cloudinary from 'cloudinary';

import controller from './controller';

import isAuthenticated from '../../middlewares/isAuthenticated';

const imageStorage = multer.diskStorage({
  destination: function(_, __, callback) {
    callback(null, __dirname + '../../../../../public/dps');
  },
  filename: function(_, file, callback) {
    callback(null, file.originalname);
  },
});

const fileFilter = (_, file, callback) => {
  if (!/(jpe?g|tiff|png)$/i.test(file.mimetype))
    return callback(
      new Error('Please upload a valid jpg, jpeg or png image'),
      false
    );
  else return callback(null, true);
};

var upload = multer({ storage: imageStorage, fileFilter: fileFilter });

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default express
  .Router()
  .post('/login', controller.login)
  .post('/suggestions', isAuthenticated, controller.sendSuggestion)
  .put('/password', isAuthenticated, controller.changePassword)
  .put(
    '/dp',
    isAuthenticated,
    upload.single('dp'),
    controller.changeProfilePicture
  )
  .put('/fcmToken', isAuthenticated, controller.changeFcmToken)
  .get('/details', isAuthenticated, controller.getUserDetails)
  .get('/leaderboard', isAuthenticated, controller.getLeaderboard)
  .post('/forgotPassword', controller.forgotPassword)
  .post('/resetPassword', controller.resetPassword);
