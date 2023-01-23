import nodemailer from 'nodemailer';

import l from '../../common/logger';
import { emailId, emailPassword } from '../../common/config';
import { reportRecipients, aasf, dev } from '../../utils/emailRecipients';
import { reportTempate } from '../../utils/emailTemplates/report';
import { suggestionTemplate } from '../../utils/emailTemplates/suggestion';
import { otpTemplate } from '../../utils/emailTemplates/otpTemplate';
import { eventTemplate } from '../../utils/emailTemplates/eventTemplate';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailId,
    pass: emailPassword,
  },
});

class MailerService {
  /**
   * Send Report to authorities
   * @param {string} eventName - Name of the event
   * @param {string} eventDetails - date, venue, time, organizersHeading, organizers, description, photos
   */
  async sendReport(eventName, eventDetails) {
    try {
      const mailOptions = {
        from: emailId,
        to: reportRecipients,
        bcc: 'bcs_201831@iiitm.ac.in',
        subject: `Report - ${eventName}`,
        text: reportTempate(eventDetails),
      };
      this.triggerMail(mailOptions);
    } catch (err) {
      l.error('[SEND REPORT]', err, eventName);
      throw err;
    }
  }

  /**
   * Send a suggestion to AASF
   * @param {string} suggestion - Suggestion be sent
   * @param {string} roll - Roll number of the student or null if anonymous
   */
  async sendSuggestion(suggestion, roll) {
    const mailOptions = {
      from: emailId,
      to: aasf,
      bcc: dev,
      subject: `[SUGGESTION] Suggestion from a student`,
      text: suggestionTemplate(suggestion, roll ?? 'a friendly student'),
    };
    this.triggerMail(mailOptions);
  }

  /**
   *  Send OTP to the user
   * @param {string} mail - mailId of student
   * @param {integer} otp - otp
   */
  async sendPasswordResetEmail(userEmailId, userName, otp) {
    const mailOptions = {
      from: {
        name: "Abhigyan Abhikaushalam Students' Forum",
        address: emailId,
      },
      to: userEmailId,
      subject: `OTP to Reset AASF Account Password`,
      html: otpTemplate(userName, otp),
    };
    this.triggerMail(mailOptions);
  }

  /**
   * Send event reminder email
   * @param {array} eventRecipients Strings of array containing email recipients
   * @param {string} text Text to be sent
   * @param {string} eventName Event Name
   * @param {string} link Link for the event
   */
  async sendEventReminder(eventRecipients, text, eventName, link) {
    const mailOptions = {
      from: {
        name: "Abhigyan Abhikaushalam Students' Forum",
        address: emailId,
      },
      to: eventRecipients,
      subject: `Reminder - ${eventName}`,
      html: eventTemplate(text, link),
    };
    this.triggerMail(mailOptions);
  }
  async triggerMail(mailOptions) {
    await transporter.sendMail(mailOptions);
  }
}

export default new MailerService();
