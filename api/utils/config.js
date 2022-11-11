require("dotenv").config();
const { DATABASE_URL } = process.env;

module.exports = {
  DATABASE_URL,
};
