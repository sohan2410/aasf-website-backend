import MailerService from "../../../../services/mailer.service";

export class Controller {
  async sendReport(req, res) {
    try {
      await MailerService.sendReport(req.body.eventName, req.body.eventDetails);
      res.status(200).send({ message: "Report Successfully sent" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}

export default new Controller();
