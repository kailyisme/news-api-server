const express = require("express");
const {
  notFound,
  serverError,
  customErrors,
} = require("./errors_handlers/mainHandlers");
const mainRouter = require("./routers/mainRouter");
const cors = require("cors")

const app = express();
app.use(cors())

app.use(express.json());

app.use(mainRouter);

app.use(notFound);
app.use(customErrors);
app.use(serverError);

module.exports = app;
