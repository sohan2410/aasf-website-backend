const csv = require("csvtojson");
const crypto = require("crypto");
import QRCode from "qrcode";

import l from "../../common/logger";
import userModel from "../../models/user";
import eventModel from "../../models/event";
import attendanceModel from "../../models/attendance";

import { encryptionKey, encryptionAlgorithm } from "../../common/config";

class EventsService {
  async uploadEvents(file) {
    try {
      const events = await csv().fromFile(
        __dirname + `/../../../public/events/${file}`
      );
      await eventModel.insertMany(events);
    } catch (err) {
      throw err;
    }
  }

  async addEvent(event) {
    try {
      await eventModel.create(event);
    } catch (err) {
      throw err;
    }
  }

  async editEventDetails(id, data) {
    try {
      const event = await eventModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!event) throw { message: "Event not found", status: 400 };
    } catch (err) {
      throw err;
    }
  }

  async getEvents() {
    try {
      return await eventModel.find({}, "-qr -winners -importance", {
        sort: { startDate: 1 },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteEvent(id) {
    try {
      await eventModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async addGoodies(roll, eventId) {
    try {
      const eventData = await eventModel.findById(eventId);
      if (!eventData) throw { message: "Event not found", status: 400 };

      const update = {};
      update[`score.${eventData.category}`] = eventData.importance * 5;
      const user = await userModel.findByIdAndUpdate(roll, { $inc: update });
      if (!user) throw { message: "User not found", status: 400 };
    } catch (err) {
      throw err;
    }
  }

  async addWinners(winners, eventId) {
    try {
      const eventData = await eventModel.findByIdAndUpdate(eventId, {
        winners: true,
      });
      if (!eventData) throw { message: "Event not found", status: 400 };

      const promises = [];
      const points = {};

      winners.forEach((winner, index) => {
        points[`score.${eventData.category}`] =
          eventData.importance * 5 + (2 - index) * 5;

        const achievement = {};
        if (index === 0) achievement["achievements.first"] = eventData.name;
        else if (index === 1)
          achievement["achievements.second"] = eventData.name;
        else if (index === 2)
          achievement["achievements.third"] = eventData.name;

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
      throw err;
    }
  }

  async generateQRCode(id, day) {
    try {
      const event = await eventModel.findOneAndUpdate(
        { _id: id, numberOfDays: { $gte: day } },
        { qr: true }
      );
      if (!event)
        throw { message: "Event not found or Invalid Day Number", status: 400 };

      const encrypt = crypto.createCipher(encryptionAlgorithm, encryptionKey);
      let hash = encrypt.update(
        JSON.stringify({ _id: event._id, day }),
        "utf8",
        "hex"
      );
      hash += encrypt.final("hex");

      return await QRCode.toDataURL(hash);
      // return hash;
    } catch (err) {
      throw err;
    }
  }

  async markAttendance(roll, hash) {
    try {
      if (await attendanceModel.findById(roll))
        throw {
          message: "You have already marked your attendance",
          status: 400,
        };

      const decrypt = crypto.createDecipher(encryptionAlgorithm, encryptionKey);
      let plain = decrypt.update(hash, "hex", "utf8");
      plain += decrypt.final("utf8");

      const data = JSON.parse(plain);
      if (!data._id || !data.day) throw { message: "Invalid QR", status: 400 };

      const eventData = await eventModel.findById(data._id);
      if (data.day > eventData.numberOfDays || data.day <= 0)
        throw { message: "Invalid QR", status: 400 };

      let eventDate = new Date(eventData.startDate);
      eventDate.setDate(eventDate.getDate() + parseInt(data.day, 10) - 1);
      eventDate = eventDate.toISOString().split("T")[0];

      const currentDate = new Date(new Date().getTime() + 330 * 60000)
        .toISOString()
        .split("T")[0];

      if (currentDate !== eventDate)
        throw { message: "Invalid QR", status: 400 };

      const attendance = attendanceModel.create({
        _id: roll,
        expireAt: new Date(
          new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const update = {};
      update[`score.${eventData.category}`] = eventData.importance * 5 + 5;
      const user = userModel.findByIdAndUpdate(roll, {
        $inc: update,
      });

      const increment = {};
      increment[`attendance.${parseInt(data.day, 10) - 1}`] = 1;
      const event = eventModel.findByIdAndUpdate(data._id, {
        $inc: increment,
      });

      await Promise.all([attendance, user, event]);
    } catch (err) {
      throw err;
    }
  }
}

export default new EventsService();
