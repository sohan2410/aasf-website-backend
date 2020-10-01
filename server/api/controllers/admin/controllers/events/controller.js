import EventsService from "../../../../services/events.service";
import l from "../../../../../common/logger";

export class Controller {
  async uploadEvents(req, res, next) {
    try {
      if (req.file) await EventsService.uploadEvents(req.file.filename);
      else throw { status: 400, message: "Please upload a valid file" };
      res.status(200).send({ message: "Events Uploaded Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async addEvent(req, res, next) {
    try {
      await EventsService.addEvent(req.body);
      res.status(200).send({ message: "Event Added Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async editEventDetails(req, res, next) {
    try {
      const event = await EventsService.editEventDetails(
        req.params.id,
        req.body
      );
      res.status(200).send({ event, message: "Event Updated Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async getEvents(req, res, next) {
    try {
      const events = await EventsService.getEvents();
      res.status(200).send({ events, message: "Event fetched Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async deleteEvent(req, res, next) {
    try {
      await EventsService.deleteEvent(req.params.id);
      res.status(200).send({ message: "Event deleted Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async addGoodies(req, res, next) {
    try {
      await EventsService.addGoodies(req.body.roll, req.body.eventId);
      res.status(200).send({ message: "Goodies Added Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async addWinners(req, res, next) {
    try {
      await EventsService.addWinners(req.body.winners, req.body.eventId);
      res.status(200).send({ message: "Winners Added Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async generateQRCode(req, res, next) {
    try {
      const qr = await EventsService.generateQRCode(
        req.params.id,
        req.params.day
      );
      res.status(200).send({ qr, message: "QR Code generated Successfully" });
    } catch (err) {
      next(err)
    }
  }

  async clearAttendances(req, res) {
    EventsService.clearAttendances();
    res.status(200).send({ message: "Attendances cleared successfully" });
  }
}
export default new Controller();
