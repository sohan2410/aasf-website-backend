import EventsService from "../../services/events.service";

export class Controller {
  /**
   * @api {post} /events/attendance - Mark the attendance of a user for a particular event
   * @apiName Mark Attendance
   * @apiGroup Events
   *
   * @apiParam {String} hash - Hash scanned from the QR Code
   */
  async markAttendance(req, res) {
    try {
      const { roll } = req.user;
      await EventsService.markAttendance(roll, req.body.hash);
      res.status(200).send({ message: "Attendance Marked Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {get} /events - Get a list of events
   * @apiName Get Events
   * @apiGroup Events
   */
  async getEvents(req, res) {
    try {
      const events = await EventsService.getEvents();
      res.status(200).send({ events, message: "Event fetched Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
