import UsersService from "../../services/users.service";
import xss from "xss";

import { xssOptions } from "../../../common/config";
import validImage from "../../../utils/validImage";

export class Controller {
  async login(req, res) {
    try {
      const { roll, password } = req.body;
      const token = await UsersService.login(roll, password);
      res.status(200).json({ token, message: "Successfully Logged in!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Some error has occurred" });
    }
  }

  async getUserDetails(req, res) {
    try {
      const { roll } = req.user;
      const user = await UsersService.getUserDetails(roll);
      res.status(200).json({ user, message: "Details successfully fetched" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Some error has occurred" });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const { leaderboard, totalScore } = await UsersService.getLeaderboard();
      res.status(200).json({
        leaderboard,
        totalScore,
        message: "Leaderboard successfully fetched",
      });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { roll } = req.user;
      let { currentPassword, newPassword } = req.body;

      currentPassword = xss(currentPassword, xssOptions);
      newPassword = xss(newPassword, xssOptions);
      if (!currentPassword || !newPassword)
        throw { status: 400, message: "Invalid Password" };

      await UsersService.changePassword(roll, currentPassword, newPassword);
      res.status(200).json({ message: "Password successfully changed!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Some error has occurred" });
    }
  }

  async changeProfilePicture(req, res) {
    try {
      const { roll } = req.user;

      req.body.dp = xss(req.body.dp, xssOptions);
      if (!req.body.dp || !validImage(req.body.dp))
        throw { status: 400, message: "Invalid Profile Picture" };

      const updatedUser = await UsersService.changeProfilePicture(
        roll,
        req.body.dp
      );
      res.status(200).json({
        user: updatedUser,
        message: "Profile Picture Successfully Changed",
      });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
