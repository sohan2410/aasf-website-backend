import * as express from "express";
const multer = require("multer");
import controller from "./controller";

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/))
    return callback(new Error("Please upload a valid .csv file"), false);
  else return callback(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + `/../../../../../../public/events/`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

//Upload a .csv file with field name as "events" as form-data body

export default express
  .Router()
  .get("/", controller.getEvents)
  .post("/", controller.addEvent)
  .put("/:id", controller.editEventDetails)
  .delete("/:id", controller.deleteEvent)
  .get("/qr/:id/:day", controller.generateQRCode)
  .post("/upload", upload.single("events"), controller.uploadEvents)
  .post("/goodies", controller.addGoodies)
  .post("/winners", controller.addWinners);
