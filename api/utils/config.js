require("dotenv").config();

const NODE_ENV = "production";

const {
  DATABASE_URL,
  // NODE_ENV,
  PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
} = process.env;

module.exports = {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
};
