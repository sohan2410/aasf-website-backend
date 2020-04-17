import * as express from "express";
import controller from "./controller";

import isAuthenticated from "../../middlewares/isAuthenticated";

export default express
  .Router()
  .get("/", controller.getEvents)
  .post("/attendance", isAuthenticated, controller.markAttendance);
