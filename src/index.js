const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./db/db");
const errorHandler = require("./middleware/errorHandler");

// route files
const bootcampsRouter = require("./routers/bootcamps");

// connect to db
connectDB();

// dotenv config
dotenv.config({ path: path.resolve(__dirname, "./config/config.env") });

const app = express();

// body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

// mount routers
app.use("/api/bootcamps", bootcampsRouter);

// error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`server runing in ${process.env.NODE_ENV} on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // close server.
  server.close();
});
