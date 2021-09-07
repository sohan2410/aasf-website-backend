import * as express from 'express';
import multer from 'multer';
import multerAzure from 'multer-azure';

import controller from './controller';

import isAuthenticated from '../../middlewares/isAuthenticated';

import { azureStorageConnectionString, azureAccountName, azureKey } from '../../../common/config';

const storage = multerAzure({
  connectionString: azureStorageConnectionString, //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
  container: 'dps', //Any container name, it will be created if it doesn't exist
  blobPathResolver: (req, file, callback) => {
    const blobPath = `${req.user.roll}.${file.mimetype.split('/')[1]}`; //Calculate blobPath in your own way.
    callback(null, blobPath);
  },
});

const fileFilter = (req, file, callback) => {
  if (!/(jpe?g|tiff|png)$/i.test(file.mimetype))
    return callback(new Error('Please upload a valid jpg, jpeg or png image'), false);
  else return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default express
  .Router()
  .post('/login', controller.login)
  .post('/suggestions', isAuthenticated, controller.sendSuggestion)
  .put('/password', isAuthenticated, controller.changePassword)
  .put('/dp', isAuthenticated, upload.single('dp'), controller.changeProfilePicture)
  .put('/fcmToken', isAuthenticated, controller.changeFcmToken)
  .get('/details', isAuthenticated, controller.getUserDetails)
  .get('/leaderboard', isAuthenticated, controller.getLeaderboard);
