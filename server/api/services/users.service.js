const csv = require("csvtojson");
const bcrypt = require("bcrypt");
import * as jwt from "jsonwebtoken";

import l from "../../common/logger";
import userModel from "../../models/user";
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
        password: hash
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

  generateToken(roll) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 1000000);

    return jwt.sign(
      {
        roll,
        exp: exp.getTime() / 1000
      },
      jwtSecret
    );
  }
}

export default new UsersService();
