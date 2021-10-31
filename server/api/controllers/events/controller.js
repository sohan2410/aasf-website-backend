import EventsService from '../../services/events.service';

export class Controller {
  async markAttendance(req, res, next) {
    try {
      const { roll } = req.user;
      await EventsService.markAttendance(roll, req.body.hash);
      res.status(200).json({ message: 'Attendance Marked Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getEvents(_, res, next) {
    try {
      const events = await EventsService.getEvents();
      res.status(200).json({ events, message: 'Event fetched Successfully' });
    } catch (err) {
      next(err);
    }
  }
}
export default new Controller();
