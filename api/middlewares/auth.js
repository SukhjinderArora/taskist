const createError = require("http-errors");
const ms = require("ms");

const knex = require("../db/knex");
const { generateJWT } = require("../utils/auth");
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../utils/config");

const generateToken = async (req, res, next) => {
  try {
    const user = await knex("users")
      .where({
        id: req.userId,
      })
      .select("*")
      .first();

    if (!user) {
      const error = createError.Unauthorized();
      throw error;
    }
    const accessToken = generateJWT(
      req.userId,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFE
    );
    return res.status(200).json({
      user,
      accessToken,
      expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_LIFE)),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateToken,
};
