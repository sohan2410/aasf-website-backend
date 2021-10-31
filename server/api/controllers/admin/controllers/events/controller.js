import EventsService from '../../../../services/events.service';
import l from '../../../../../common/logger';
import MailerService from '../../../../services/mailer.service';
export class Controller {
  async uploadEvents(req, res, next) {
    try {
      if (req.file) await EventsService.uploadEvents(req.file.filename);
      else throw { status: 400, message: 'Please upload a valid file' };
      res.status(200).json({ message: 'Events Uploaded Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async addEvent(req, res, next) {
    try {
      await EventsService.addEvent(req.body);
      res.status(200).json({ message: 'Event Added Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async editEventDetails(req, res, next) {
    try {
      const event = await EventsService.editEventDetails(req.params.id, req.body);
      res.status(200).json({ event, message: 'Event Updated Successfully' });
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

  async deleteEvent(req, res, next) {
    try {
      await EventsService.deleteEvent(req.params.id);
      res.status(200).json({ message: 'Event deleted Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async uploadAttendance(req, res, next) {
    try {
      if (req.files?.[0] && req.body.eventId && req.body.day)
        await EventsService.uploadAttendance(
          req.files?.[0].originalname,
          req.body.eventId,
          req.body.day
        );
      else throw { status: 400, message: 'Please upload a valid file' };
      res.status(200).json({ message: 'Successfully uploaded attendance' });
    } catch (err) {
      next(err);
    }
  }

  async addGoodies(req, res, next) {
    try {
      await EventsService.addGoodies(req.body.roll, req.body.eventId);
      res.status(200).json({ message: 'Goodies Added Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async addWinners(req, res, next) {
    try {
      await EventsService.addWinners(req.body.winners, req.body.eventId);
      res.status(200).json({ message: 'Winners Added Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async generateQRCode(req, res, next) {
    try {
      const qr = await EventsService.generateQRCode(req.params.id, req.params.day);
      res.status(200).json({ qr, message: 'QR Code generated Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async clearAttendances(_, res) {
    EventsService.clearAttendances();
    res.status(200).json({ message: 'Attendances cleared successfully' });
  }

  async sendEventReminder(req, res, next) {
    try {
      const { text, eventName, link } = req.body;

      await MailerService.sendEventReminder(text, eventName, link);

      res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
      next(error);
    }
  }
}
export default new Controller();
