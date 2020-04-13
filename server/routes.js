import examplesRouter from "./api/controllers/examples/router";
import usersRouter from "./api/controllers/users/router";

export default function routes(app) {
  app.use("/users", usersRouter);
  app.use("/api/v1/examples", examplesRouter);
}
