import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../../common/config";

// eslint-disable-next-line no-unused-vars, no-shadow
export default async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token) res.status(401).send({ message: "Token missing" });
  else {
    try {
      const user = jwt.verify(token, jwtSecret);
      req.user = user;
      next();
    } catch (err) {
      res.status(401).send({ message: err.message || "Invalid Token" });
    }
  }
}
