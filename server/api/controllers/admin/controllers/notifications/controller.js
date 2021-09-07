import NotificationsService from '../../../../services/notifications.service';

export class Controller {
  async pushNotification(req, res, next) {
    try {
      const { title, body, imageUrl } = req.body;
      await NotificationsService.pushNotification(title, body, imageUrl);

      res.status(200).json({ message: 'Successfully pushed notification' });
    } catch (err) {
      next(err);
    }
  }
}

export default new Controller();
