require("dotenv").config();

const config = require("../knexfile");

module.exports = require("knex")(config);
