import admin from 'firebase-admin';

import userModel from '../../models/user';
import l from '../../common/logger';

import serviceAccount from '../../../firebase.json';

class NotificationsService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  /**
   * Sends push notifications to users
   * @param {string} title - Title to be shown on the notification
   * @param {string} body - Body of the notification
   * @param {string} imageUrl - URL of an image to be displayed on the notification
   */
  async pushNotification(title, body, imageUrl) {
    try {
      //Fetch only those users whose FCM token is defined in the database.
      const users = await userModel.find({ fcmToken: { $exists: true } }, 'fcmToken');
      const tokens = users.map(user => user.fcmToken);

      await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
          imageUrl,
        },
      });
    } catch (err) {
      l.error('[PUSH NOTIFICATION]', err);
      throw err;
    }
  }
}

export default new NotificationsService();
