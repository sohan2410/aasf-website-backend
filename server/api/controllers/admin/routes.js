import * as express from "express";
import userRouter from "./controllers/users/router";
import eventRouter from "./controllers/events/router";

export default express
  .Router()
  .use("/users", userRouter)
  .use("/events", eventRouter);
