const jwt = require("jsonwebtoken");

const generateJWT = (userId, secret, expiresIn) =>
  jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn }
  );

module.exports = {
  generateJWT,
};
