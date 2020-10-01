import MailerService from "../../../../services/mailer.service";

export class Controller {
  async sendReport(req, res, next) {
    try {
      await MailerService.sendReport(req.body.eventName, req.body.eventDetails);
      res.status(200).send({ message: "Report Successfully sent" });
    } catch (err) {
      next(err)
    }
  }
}

export default new Controller();
