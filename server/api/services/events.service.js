const csv = require('csvtojson');
const crypto = require('crypto');
import QRCode from 'qrcode';

import l from '../../common/logger';
import userModel from '../../models/user';
import eventModel from '../../models/event';

import { encryptionKey, encryptionAlgorithm } from '../../common/config';

class EventsService {
  constructor() {
    /**
     * Memoize the events for which attendance is being marked
     * @param {Function} fetchEventData - The function which should be memoized
     */
    this.eventMemoize = fetchEventData => {
      let events = {};
      return {
        get: async id => {
          if (events[id]) return events[id];
          events[id] = await fetchEventData(id);
          return events[id];
        },
        clear: () => {
          events = {};
        },
        clearOne: id => {
          events[id] = null;
        },
      };
    };

    /**
     * Fetch event details
     * @param {String} id - Id of the event
     */
    this.fetchEventData = this.eventMemoize(async id => await eventModel.findById(id));

    this.attendances = {};

    this.clearAttendances = () => {
      this.attendances = {};
    };
  }

  /**
   * Upload a list of events from the csv into the database
   * @param {String} file - Name of the file uploaded
   */
  async uploadEvents(file) {
    try {
      const events = await csv().fromFile(__dirname + `/../../../public/events/${file}`);
      await eventModel.insertMany(events);
    } catch (err) {
      l.error('[UPLOAD EVENTS]', err);
      throw err;
    }
  }

  /**
   * Add a single event
   * @param {Object} event - Details of the event. Conforms to the event model
   */
  async addEvent(event) {
    try {
      await eventModel.create(event);
    } catch (err) {
      l.error('[ADD EVENT]', err);
      throw err;
    }
  }

  /**
   * Edit the details of an event
   * @param {String} id - Id of the event
   * @param {Object} data - Details of the event. Conforms to the event model
   */
  async editEventDetails(id, data) {
    try {
      const event = await eventModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!event) throw { message: 'Event not found', status: 400 };
    } catch (err) {
      l.error('[EDIT EVENT]', err, id, data);
      throw err;
    }
  }

  /**
   * Fetch the list of events sorted according to start date
   */
  async getEvents() {
    try {
      return await eventModel.find({}, '-qr -winners -importance', {
        sort: { startDate: 1 },
      });
    } catch (err) {
      l.error('[GET EVENTS]', err);
      throw err;
    }
  }

  /**
   * Delete an event
   * @param {String} id - Id of the event
   */
  async deleteEvent(id) {
    try {
      await eventModel.findByIdAndDelete(id);
    } catch (err) {
      l.error('[DELETE EVENT]', err, id);
      throw err;
    }
  }

  /**
   * Add goodie points to a student
   * @param {String} roll - Roll number of the student
   * @param {String} eventId - Id of the event
   */
  async addGoodies(roll, eventId) {
    try {
      const eventData = await eventModel.findById(eventId);
      if (!eventData) throw { message: 'Event not found', status: 400 };

      const update = {};
      update[`score.${eventData.category}`] = eventData.importance * 5 + 5;
      update['totalScore'] = eventData.importance * 5 + 5;
      const user = await userModel.findByIdAndUpdate(roll, { $inc: update });
      if (!user) throw { message: 'User not found', status: 400 };
    } catch (err) {
      l.error('[ADD GOODIES]', err, roll, eventId);
      throw err;
    }
  }

  /**
   * Add points to winners of an event
   * @param {Array<String[]>} winners - A 2D Array of winners. 0th index contains the list of
   *                                    roll numbers of students who stood 1st and so on.
   * @param {String} eventId - Id of the event
   */
  async addWinners(winners, eventId) {
    try {
      const eventData = await eventModel.findByIdAndUpdate(eventId, {
        winners: true,
      });
      if (!eventData) throw { message: 'Event not found', status: 400 };

      const promises = [];
      const points = {};

      winners.forEach((winner, index) => {
        points[`score.${eventData.category}`] = eventData.importance * 5 + (2 - index) * 5;
        points['totalScore'] = eventData.importance * 5 + (2 - index) * 5;

        winner.forEach(userId => {
          promises.push(
            achievementModel.create({
              userId: userId,
              eventId,
              position: index + 1,
            })
          )
        });
        promises.push(
          userModel.updateMany(
            { _id: { $in: winner } },
            {
              $inc: points,
              $push: achievement,
            }
          )
        );
      });

      await Promise.all(promises);
    } catch (err) {
      l.error('[ADD WINNERS]', err, winners, eventId);
      throw err;
    }
  }

  /**
   * Generate QR code for an event
   * @param {String} id - Id of the event
   * @param {Number} day - Day number of the event. Has to be less than equal to the total
   *                       number of days allotted to the event
   */
  async generateQRCode(id, day) {
    try {
      const event = await eventModel.findOneAndUpdate(
        { _id: id, numberOfDays: { $gte: day } },
        { qr: true }
      );
      if (!event) throw { message: 'Event not found or Invalid Day Number', status: 400 };

      const encrypt = crypto.createCipher(encryptionAlgorithm, encryptionKey);
      let hash = encrypt.update(JSON.stringify({ _id: event._id, day }), 'utf8', 'hex');
      hash += encrypt.final('hex');

      return await QRCode.toDataURL(hash);
    } catch (err) {
      l.error('[GENERATE QR]', err, id, day);
      throw err;
    }
  }

  /**
   * Upload Attendance via csv file
   * @param {string} file - name of the file in which attendance has been recorded
   * @param {string} eventId - Event ID
   * @param {number} day - Day number of the event
   */
  async uploadAttendance(file, eventId, day) {
    try {
      const attendance = await csv().fromFile(__dirname + `/../../../public/events/${file}`);
      const eventData = await this.fetchEventData.get(eventId);
      let eventDate = new Date(eventData.startDate);
      eventDate.setDate(eventDate.getDate() + parseInt(day, 10) - 1);
      eventDate = eventDate.toISOString().split('T')[0];

      const validRollNumbers = attendance.filter(student => {
        return !this.attendances[student.roll] || this.attendances[student.roll] < eventDate;
      });

      validRollNumbers.forEach(student => {
        this.attendances[student.roll] = eventDate;
      });

      const rollNumbers = validRollNumbers.map(student => student.roll);

      const update = {};
      update[`score.${eventData.category}`] = eventData.importance * 5;
      update['totalScore'] = eventData.importance * 5;

      //Update users' scores
      const user = userModel.updateMany(
        { _id: { $in: rollNumbers } },
        {
          $inc: update,
        }
      );

      //Increment the event's attendance
      const increment = {};
      increment[`attendance.${parseInt(day, 10) - 1}`] = rollNumbers.length;
      const event = eventModel.findByIdAndUpdate(eventId, {
        $inc: increment,
      });

      await Promise.all([user, event]);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Mark the attendance of a student for a particular event
   * @param {String} roll - Roll number of the student
   * @param {String} hash - Hash scanned from the QR Code
   */
  async markAttendance(roll, hash) {
    try {
      const currentDate = new Date(new Date().getTime() + 330 * 60000).toISOString().split('T')[0];
      //Check if the student has already marked his attendance.
      if (this.attendances[roll] >= currentDate)
        throw {
          message: 'You have already marked your attendance',
          status: 400,
          inApp: true,
        };

      const decrypt = crypto.createDecipher(encryptionAlgorithm, encryptionKey);
      let plain = decrypt.update(hash, 'hex', 'utf8');
      plain += decrypt.final('utf8');

      const data = JSON.parse(plain);
      if (!data._id || !data.day) throw { message: 'Invalid QR', status: 400, inApp: true };

      //Fetch event details from memoizer
      const eventData = await this.fetchEventData.get(data._id);

      if (data.day > eventData.numberOfDays || data.day <= 0)
        throw { message: 'Invalid QR', status: 400, inApp: true };

      let eventDate = new Date(eventData.startDate);
      eventDate.setDate(eventDate.getDate() + parseInt(data.day, 10) - 1);
      eventDate = eventDate.toISOString().split('T')[0];

      //Validate event
      if (currentDate !== eventDate) throw { message: 'Invalid QR', status: 400, inApp: true };

      this.attendances[roll] = currentDate;

      //Update the student's score
      const update = {};
      update[`score.${eventData.category}`] = eventData.importance * 5 + 5;
      update['totalScore'] = eventData.importance * 5 + 5;
      const user = userModel.findByIdAndUpdate(roll, {
        $inc: update,
      });

      //Increment the event's attendance
      const increment = {};
      increment[`attendance.${parseInt(data.day, 10) - 1}`] = 1;
      const event = eventModel.findByIdAndUpdate(data._id, {
        $inc: increment,
      });

      await Promise.all([user, event]);
    } catch (err) {
      l.error('[MARK ATTENDANCE]', err, roll, hash);
      if (err.inApp) throw err;
      else throw { message: 'Invalid QR', status: 400 };
    }
  }
}

export default new EventsService();
