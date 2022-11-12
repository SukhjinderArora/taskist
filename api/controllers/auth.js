const { OAuth2Client } = require("google-auth-library");

const { GOOGLE_CLIENT_ID } = require("../utils/config");
const knex = require("../db/knex");

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const signinGoogle = async (req, res, next) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const existingUser = await knex("users")
      .where({
        email: payload.email,
      })
      .select("id")
      .first();
    if (existingUser) {
      req.userId = existingUser.id;
      return next();
    }
    const { name, email, sub: googleId } = payload;
    const user = await knex("users").insert({
      name,
      email,
      google_id: googleId,
    });
    console.log(user);
    req.userId = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signinGoogle,
};
