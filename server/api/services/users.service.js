const csv = require("csvtojson");
const bcrypt = require("bcrypt");
import * as jwt from "jsonwebtoken";

import l from "../../common/logger";
import userModel from "../../models/user";
import eventModel from "../../models/event";
import { jwtSecret } from "../../common/config";

const saltRounds = 10;

class UsersService {
  async uploadUsers(file) {
    try {
      const users = await csv().fromFile(
        __dirname + `/../../../public/users/${file}`
      );
      await userModel.insertMany(users);
    } catch (err) {
      throw err;
    }
  }

  async login(roll, password) {
    try {
      const user = await userModel.findById(roll);
      if (!user) throw { status: 400, message: "User not found" };

      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) throw { status: 401, message: "Invalid Password" };

      return this.generateToken(user._id);
    } catch (err) {
      throw err;
    }
  }

  async changePassword(roll, currentPassword, newPassword) {
    try {
      const user = await userModel.findById(roll);
      if (!user) throw { status: 400, message: "User not found" };

      const verifyPassword = bcrypt.compareSync(currentPassword, user.password);
      if (!verifyPassword) throw { status: 401, message: "Invalid Password" };

      const hash = await bcrypt.hash(newPassword, saltRounds);
      await userModel.findByIdAndUpdate(roll, {
        password: hash,
      });
    } catch (err) {
      throw err;
    }
  }

  async getUserDetails(roll) {
    try {
      const user = await userModel.findById(roll, "-password");
      if (!user) throw { status: 400, message: "User not found" };

      return user;
    } catch (err) {
      throw err;
    }
  }

  async editUserDetails(roll, data) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, saltRounds);
      }
      const user = await userModel.findByIdAndUpdate(roll, data, {
        new: true,
        select: { password: 0 },
      });
      if (!user) throw { status: 400, message: "User not found" };
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getLeaderboard() {
    try {
      const leaderboard = await userModel.aggregate([
        {
          $match: { role: "user" },
        },
        {
          $addFields: {
            totalScore: {
              $add: ["$score.technical", "$score.managerial", "$score.oratory"],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalScore: 1,
          },
        },
        {
          $sort: {
            totalScore: -1,
          },
        },
      ]);
      const events = await eventModel.find({
        $or: [{ qr: true }, { winners: true }],
      });
      const totalScore = {
        technical: 0,
        managerial: 0,
        oratory: 0,
      };
      events.forEach((event) => {
        if (event.qr) totalScore[event.category] += event.importance * 5 + 5;
        if (event.winners)
          totalScore[event.category] += event.importance * 5 + 10;
      });
      return { leaderboard, totalScore };
    } catch (err) {
      throw err;
    }
  }

  generateToken(roll) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 1000000);

    return jwt.sign(
      {
        roll,
        exp: exp.getTime() / 1000,
      },
      jwtSecret
    );
  }
}

export default new UsersService();
