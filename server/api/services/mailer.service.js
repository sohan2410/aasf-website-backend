import nodemailer from "nodemailer";

import l from "../../common/logger";
import { emailId, emailPassword } from "../../common/config";
import { reportRecipients } from "../../utils/emailRecipients";
import { reportTempate } from "../../utils/emailTemplates/report";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailId,
    pass: emailPassword,
  },
});

class MailerService {
  async sendReport(eventName, eventDetails) {
    try {
      let mailOptions = {
        from: emailId,
        to: reportRecipients,
        bcc: "bcs_201831@iiitm.ac.in",
        subject: `Report - ${eventName}`,
        text: reportTempate(eventDetails),
      };
      this.triggerMail(mailOptions);
    } catch (err) {
      l.error("[SEND REPORT]", err);
      throw err;
    }
  }

  async triggerMail(mailOptions) {
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      l.error("[SEND MAIL]", err);
      throw err;
    }
  }
}

export default new MailerService();
