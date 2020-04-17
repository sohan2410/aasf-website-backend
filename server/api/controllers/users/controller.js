import UsersService from "../../services/users.service";

export class Controller {
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

  async changePassword(req, res) {
    try {
      const { roll } = req.user;
      const { currentPassword, newPassword } = req.body;
      await UsersService.changePassword(roll, currentPassword, newPassword);
      res.status(200).send({ message: "Password successfully changed!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }
}
export default new Controller();
