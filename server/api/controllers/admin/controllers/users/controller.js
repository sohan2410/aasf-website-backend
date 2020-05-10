import UsersService from "../../../../services/users.service";
import l from "../../../../../common/logger";

export class Controller {
  /**
   * @api {post} /admin/users/password - Upload a list of users
   * @apiName Upload
   * @apiGroup Admin/Users
   *
   * @apiParam {File} users - CSV file with a list of users containing 2 columns, _id and name.
   *                          _id contains the roll number of the student
   */
  async uploadUsers(req, res) {
    try {
      if (req.file) await UsersService.uploadUsers(req.file.filename);
      else throw { status: 400, message: "Please upload a valid file" };
      res.status(200).send({ message: "Users Uploaded Successfully" });
    } catch (err) {
      res
        .status(err.status || 500)
        .send({ message: err.message || "Some error has occurred" });
    }
  }

  /**
   * @api {put} /admin/users/:roll - Change a user's details
   * @apiName Change Details
   * @apiGroup Admin/Users
   *
   * @apiParam {Object} body - Updated user details. Conforms to the user model
   */
  async editUserDetails(req, res) {
    try {
      const user = await UsersService.editUserDetails(
        req.params.roll,
        req.body
      );
      res
        .status(200)
        .send({ user, message: "User details updated successfully" });
    } catch (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong, please try again.",
      });
    }
  }
}
export default new Controller();
