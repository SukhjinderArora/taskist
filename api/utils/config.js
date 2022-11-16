require("dotenv").config();

const DATABASE_URL =
  "postgres://taskist:VDWvjywZjCsjRmzyTM08UFkZfCGJp5cz@dpg-cdq6fscgqg47to0oqljg-a.singapore-postgres.render.com/taskist?ssl=true";

const {
  NODE_ENV,
  PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REDIRECT_URI,
} = process.env;

module.exports = {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REDIRECT_URI,
};
