import * as express from "express";
import controller from "./controller";

import isAuthenticated from "../../middlewares/isAuthenticated";

export default express
  .Router()
  .post("/login", controller.login)
  .put("/password", isAuthenticated, controller.changePassword)
  .put("/dp", isAuthenticated, controller.changeProfilePicture)
  .get("/details", isAuthenticated, controller.getUserDetails)
  .get("/leaderboard", isAuthenticated, controller.getLeaderboard);
