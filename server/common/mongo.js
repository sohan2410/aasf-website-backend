const mongoose = require("mongoose");
import { mongodbUri } from "./config";

export default async () => {
  const connection = await mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  return connection.connection.db;
};
