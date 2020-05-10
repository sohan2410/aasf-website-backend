import UsersService from "../../services/users.service";
import xss from "xss";

import { xssOptions } from "../../../common/config";
import validImage from "../../../utils/validImage";

export class Controller {
  /**
   * @api {post} /users/login - Login
   * @apiName Login
   * @apiGroup Users
   *
   * @apiParam {String} roll - Roll number of the student
   * @apiParam {String} password - Password of the student
   */
  async login(req, res) {
    try {
      const { roll, password } = req.body;
      const token = await UsersService.login(roll, password);
      res.status(200).send({ token, message: "Successfully Logged in!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }

  /**
   * @api {get} /users/details - Get User Details
   * @apiName Details
   * @apiGroup Users
   */
  async getUserDetails(req, res) {
    try {
      const { roll } = req.user;
      const user = await UsersService.getUserDetails(roll);
      res.status(200).send({ user, message: "Details successfully fetched" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }

  /**
   * @api {get} /users/leaderboard - Fetch the current leaderboard
   * @apiName Leaderboard
   * @apiGroup Users
   */
  async getLeaderboard(req, res) {
    try {
      const { leaderboard, totalScore } = await UsersService.getLeaderboard();
      res.status(200).send({
        leaderboard,
        totalScore,
        message: "Leaderboard successfully fetched",
      });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }

  /**
   * @api {put} /users/password - Change a user's password
   * @apiName Change Password
   * @apiGroup Users
   *
   * @apiParam {String} currentPassword - Current password of the student
   * @apiParam {String} newPassword - New password of the student
   */
  async changePassword(req, res) {
    try {
      const { roll } = req.user;
      let { currentPassword, newPassword } = req.body;

      currentPassword = xss(currentPassword, xssOptions);
      newPassword = xss(newPassword, xssOptions);
      if (!currentPassword || !newPassword)
        throw { status: 400, message: "Invalid Password" };

      await UsersService.changePassword(roll, currentPassword, newPassword);
      res.status(200).send({ message: "Password successfully changed!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }

  /**
   * @api {put} /users/dp - Change a user's profile picture
   * @apiName Change DP
   * @apiGroup Users
   *
   * @apiParam {String} dp - URL/Data URL of the picture
   */
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
      res.status(200).send({
        user: updatedUser,
        message: "Profile Picture Successfully Changed",
      });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
