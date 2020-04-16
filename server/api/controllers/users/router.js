import * as express from "express";
import controller from "./controller";

import isAuthenticated from "../../middlewares/isAuthenticated";

export default express
  .Router()
  .post("/login", controller.login)
  .post("/changepassword", isAuthenticated, controller.changePassword)
  .get("/details", isAuthenticated, controller.getUserDetails);
