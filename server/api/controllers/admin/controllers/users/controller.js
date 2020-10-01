import UsersService from "../../../../services/users.service";
import l from "../../../../../common/logger";

export class Controller {
  async uploadUsers(req, res) {
    try {
      if (req.file) await UsersService.uploadUsers(req.file.filename);
      else throw { status: 400, message: "Please upload a valid file" };
      res.status(200).json({ message: "Users Uploaded Successfully" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Some error has occurred" });
    }
  }

  async editUserDetails(req, res) {
    try {
      const user = await UsersService.editUserDetails(
        req.params.roll,
        req.body
      );
      res
        .status(200)
        .json({ user, message: "User details updated successfully" });
    } catch (err) {
      res.status(err.status || 500).json({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
