require("dotenv").config();

const config = require("../knexfile");

module.exports = require("knex").knex(config);
