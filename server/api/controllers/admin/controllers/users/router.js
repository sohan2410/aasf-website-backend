import * as express from "express";
const multer = require("multer");
import controller from "./controller";

const fileFilter = (_, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/))
    return callback(new Error("Please upload a valid .csv file"), false);
  else return callback(null, true);
};

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, __dirname + `/../../../../../../public/users/`);
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

//Upload a .csv file with field name as "users" as form-data body

export default express
  .Router()
  .post("/upload", upload.single("users"), controller.uploadUsers)
  .put("/:roll", controller.editUserDetails);
