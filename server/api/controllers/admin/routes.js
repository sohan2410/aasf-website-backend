import * as express from "express";
import userRouter from "./controllers/users/router";

export default express.Router().use("/users", userRouter);
