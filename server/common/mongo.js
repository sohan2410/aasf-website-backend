const mongoose = require("mongoose");

export default async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  return connection.connection.db;
};
