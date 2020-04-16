import examplesRouter from "./api/controllers/examples/router";
import usersRouter from "./api/controllers/users/router";
import adminRouter from "./api/controllers/admin/routes";

import isAuthenticated from "./api/middlewares/isAuthenticated";
import isAdmin from "./api/middlewares/isAdmin";

export default function routes(app) {
  app.use("/users", usersRouter);
  app.use("/admin", isAuthenticated, isAdmin, adminRouter);
  app.use("/api/v1/examples", examplesRouter);
}
