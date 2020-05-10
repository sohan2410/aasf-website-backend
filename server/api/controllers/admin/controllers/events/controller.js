import EventsService from "../../../../services/events.service";
import l from "../../../../../common/logger";

export class Controller {
  /**
   * @api {post} /admin/events/upload - Upload a list of events
   * @apiName Upload
   * @apiGroup Admin/Events
   *
   * @apiParam {File} events - CSV file with a list of events containing 4 columns.
   *                           name, startDate, numberOfDays, category
   *                           (technical, oratory, managerial, miscellaneous), importance(Range: 1-3)
   */
  async uploadEvents(req, res) {
    try {
      if (req.file) await EventsService.uploadEvents(req.file.filename);
      else throw { status: 400, message: "Please upload a valid file" };
      res.status(200).send({ message: "Events Uploaded Successfully" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }

  /**
   * @api {post} /admin/events - Add a single event
   * @apiName Add
   * @apiGroup Admin/Events
   *
   * @apiParam {Object} body - Details of the event. Conforms to the event model.
   */
  async addEvent(req, res) {
    try {
      await EventsService.addEvent(req.body);
      res.status(200).send({ message: "Event Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {post} /admin/events/:id - Update an event
   * @apiName Edit
   * @apiGroup Admin/Events
   *
   * @apiParam {Object} body - Updated details of the event. Conforms to the event model.
   */
  async editEventDetails(req, res) {
    try {
      const event = await EventsService.editEventDetails(
        req.params.id,
        req.body
      );
      res.status(200).send({ event, message: "Event Updated Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {get} /admin/events - Get the list of events
   * @apiName Get
   * @apiGroup Admin/Events
   *
   * @apiParam {Object} body - Details of the event. Conforms to the event model.
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

  /**
   * @api {post} /admin/events/:id - Delete an event
   * @apiName Delete
   * @apiGroup Admin/Events
   */
  async deleteEvent(req, res) {
    try {
      await EventsService.deleteEvent(req.params.id);
      res.status(200).send({ message: "Event deleted Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {post} /admin/events/goodies - Add goodie points to a student
   * @apiName Goodie
   * @apiGroup Admin/Events
   *
   * @apiParam {String} roll - Roll number of the student
   * @apiParam {String} eventId - Id of the event
   */
  async addGoodies(req, res) {
    try {
      await EventsService.addGoodies(req.body.roll, req.body.eventId);
      res.status(200).send({ message: "Goodies Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {post} /admin/events/winners - Add points to winners of an event
   * @apiName Winners
   * @apiGroup Admin/Events
   *
   * @apiParam {Array<String[]>} winners - A 2D Array of winners. 0th index contains the list of
   *                                    roll numbers of students who stood 1st and so on.
   * @apiParam {String} eventId - Id of the event
   */
  async addWinners(req, res) {
    try {
      await EventsService.addWinners(req.body.winners, req.body.eventId);
      res.status(200).send({ message: "Winners Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {get} /admin/events/qr/:id/:day - Generate QR Code for an event
   * @apiName QR Code
   * @apiGroup Admin/Events
   */
  async generateQRCode(req, res) {
    try {
      const qr = await EventsService.generateQRCode(
        req.params.id,
        req.params.day
      );
      res.status(200).send({ qr, message: "QR Code generated Successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async clearAttendances(req, res) {
    EventsService.clearAttendances();
    res.status(200).send({ message: "Attendances cleared successfully" });
  }
}
export default new Controller();
