const express = require("express");
const cors = require("cors");
const createError = require("http-errors");

const { NODE_ENV } = require("./utils/config");
const { errorLogger, errorResponder } = require("./middlewares/error-handler");

const authRoutes = require("./routes/auth");

const app = express();

const isDevEnv = NODE_ENV === "development";

if (isDevEnv) {
  app.use(
    cors({
      origin: "http://localhost:4200",
      optionsSuccessStatus: 200,
    })
  );
}

app.use(express.json({ type: "application/json" }));

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorLogger);
app.use(errorResponder);

module.exports = app;
