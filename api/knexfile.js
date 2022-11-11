const { DATABASE_URL } = require("./utils/config");

module.exports = {
  client: "pg",
  connection: DATABASE_URL,
  pool: {
    min: 0,
    max: 15,
  },
  migrations: {
    directory: __dirname + "/db/migrations",
  },
  seeds: {
    directory: __dirname + "/db/seeds",
  },
};
