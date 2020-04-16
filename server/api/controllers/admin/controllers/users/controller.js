import UsersService from "../../../../services/users.service";

export class Controller {
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
}
export default new Controller();
