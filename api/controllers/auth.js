const { google } = require("googleapis");
const createError = require("http-errors");

const knex = require("../db/knex");
const { oauth2Client, oauthScope } = require("../utils/auth");
const { GOOGLE_CLIENT_ID } = require("../utils/config");

const signinGoogle = async (req, res, next) => {
  const { token } = req.body;
  try {
    const ticket = await oauth2Client.verifyIdToken({
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
    const user = await knex("users")
      .insert({
        name,
        email,
        google_id: googleId,
      })
      .returning("*");
    req.userId = user[0].id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyAuthCode = async (req, res, next) => {
  const xRequestedWithHeader = req.header("X-Requested-With");
  const { code } = req.body;
  const { userId } = req;

  try {
    if (xRequestedWithHeader !== "XmlHttpRequest" || !code) {
      const error = createError.Forbidden("Unauthorized request");
      throw error;
    }
    let { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: "Bearer",
      scope: oauthScope,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Check whether the user has already created a calendar
    const user = await knex("users")
      .where({
        id: userId,
      })
      .select("*")
      .first();

    if (user.calendar_id) {
      try {
        const existingCalendar = await calendar.calendars.get({
          calendarId: user.calendar_id,
        });
        if (existingCalendar) {
          return res.status(200).json({ message: "success" });
        }
      } catch (error) {
        console.log(
          "User has deleted the calendar from Google server, creating new one."
        );
      }
    }

    // Create a new calendar if the user has not created a calendar before.
    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary: "taskist",
      },
    });

    await knex("users").where({ id: userId }).update({
      calendar_id: newCalendar.data.id,
      refresh_token: tokens.refresh_token,
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signinGoogle,
  verifyAuthCode,
};
