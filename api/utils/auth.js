const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("./config");

const oauthScope =
  "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/userinfo.email openid";

const generateJWT = (userId, secret, expiresIn) =>
  jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn }
  );

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

module.exports = {
  generateJWT,
  oauth2Client,
  oauthScope,
};
