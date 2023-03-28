const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const boolParser = require("express-query-boolean");
const { HttpCode } = require("./helpers/constants");
require("dotenv").config();

const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// app.use(cors(), function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://api.privatbank.ua/",
//     "http://localhost:3000"
//   ); // update to match the domain you will make the request from//
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use("/", require("./routes/api"));

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status: status === HttpCode.INTERNAL_SERVER_ERROR ? "fail" : "error",
    code: status,
    message: err.message,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
