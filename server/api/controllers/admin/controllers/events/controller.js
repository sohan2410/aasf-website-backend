import EventsService from "../../../../services/events.service";
import l from "../../../../../common/logger";

export class Controller {
  async uploadEvents(req, res) {
    try {
      if (req.file) await EventsService.uploadEvents(req.file.filename);
      else throw { status: 400, message: "Please upload a valid file" };
      res.status(200).json({ message: "Events Uploaded Successfully" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Some error has occurred" });
    }
  }

  async addEvent(req, res) {
    try {
      await EventsService.addEvent(req.body);
      res.status(200).json({ message: "Event Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async editEventDetails(req, res) {
    try {
      const event = await EventsService.editEventDetails(
        req.params.id,
        req.body
      );
      res.status(200).json({ event, message: "Event Updated Successfully" });
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

  async deleteEvent(req, res) {
    try {
      await EventsService.deleteEvent(req.params.id);
      res.status(200).json({ message: "Event deleted Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async addGoodies(req, res) {
    try {
      await EventsService.addGoodies(req.body.roll, req.body.eventId);
      res.status(200).json({ message: "Goodies Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async addWinners(req, res) {
    try {
      await EventsService.addWinners(req.body.winners, req.body.eventId);
      res.status(200).json({ message: "Winners Added Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async generateQRCode(req, res) {
    try {
      const qr = await EventsService.generateQRCode(
        req.params.id,
        req.params.day
      );
      res.status(200).json({ qr, message: "QR Code generated Successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async clearAttendances(req, res) {
    EventsService.clearAttendances();
    res.status(200).json({ message: "Attendances cleared successfully" });
  }
}
export default new Controller();
