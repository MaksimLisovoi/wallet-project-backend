require("dotenv").config();

// {
//   path: __dirname + "/.env";
// }
const mongoose = require("mongoose");

const uriDb = process.env.DATABASE_URL;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (e) => {
  console.log(`Error mongoose connecting ${e.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Connection to DB terminated");
    process.exit(1);
  });
});

module.exports = db;
