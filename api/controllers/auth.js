const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const createError = require("http-errors");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../utils/config");
const knex = require("../db/knex");

const googleClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

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
  const code = req.body.code;
  try {
    if (xRequestedWithHeader !== "XmlHttpRequest" || !code) {
      const error = createError.Forbidden("Unauthorized request");
      throw error;
    }
    console.log("-----------------");
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      "postmessage"
    );
    let { tokens } = await oauth2Client.getToken(code);
    // let { tokens } = await googleClient.getToken(code);
    console.log(tokens);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    // const ticket = await googleClient.verifyIdToken({
    //   idToken: tokens.id_token,
    //   audience: GOOGLE_CLIENT_ID,
    // });
    console.log(ticket.getPayload());
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token,
      token_type: "Bearer",
    });
    // googleClient.setCredentials(tokens);
    // google.set;

    // insert a new calendar
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const c = await calendar.calendars.insert({
      // oauth_token: tokens.access_token,
      requestBody: {
        summary: "taskist",
      },
    });
    // console.log(c);
    // get an existing calendar
    const cal = await calendar.calendars.get({ calendarId: c.data.id });
    console.log(cal);

    await calendar.events.insert({
      calendarId: c.data.id,
      sendNotifications: true,
      sendUpdates: "all",
      requestBody: {
        summary: "Title of the test event",
        description: "This is a test event",
        start: {
          date: "2022-11-15",
          timeZone: "Asia/Kolkata",
        },
        end: {
          date: "2022-11-16",
          timeZone: "Asia/Kolkata",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 60 },
          ],
        },
      },
    });

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signinGoogle,
  verifyAuthCode,
};
