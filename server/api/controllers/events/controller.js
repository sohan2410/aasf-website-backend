import EventsService from "../../services/events.service";

export class Controller {
  async markAttendance(req, res) {
    try {
      const { roll } = req.user;
      await EventsService.markAttendance(roll, req.body.hash);
      res.status(200).json({ message: "Attendance Marked Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async getEvents(req, res) {
    try {
      const events = await EventsService.getEvents();
      res.status(200).json({ events, message: "Event fetched Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
