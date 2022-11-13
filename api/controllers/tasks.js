const Joi = require("joi");
const { google } = require("googleapis");

const knex = require("../db/knex");
const { oauth2Client, oauthScope } = require("../utils/auth");

const addNewTask = async (req, res, next) => {
  const { title, description, startDate } = req.body;
  const { userId } = req;
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      startDate: Joi.string().isoDate(),
    });

    const validationResult = schema.validate({ title, description, startDate });
    if (validationResult.error) {
      return res.status(422).json({
        code: "VALIDATION_ERROR",
        field: validationResult.error.details[0].path[0],
        message: validationResult.error.message,
      });
    }

    let task = await knex("tasks")
      .insert({
        title,
        description,
        user_id: userId,
        start_at: startDate,
      })
      .returning("*");

    task = task[0];

    // get the calendar id and oauth refresh token from the database.
    const user = await knex("users")
      .where({
        id: userId,
      })
      .select("*")
      .first();

    const { calendar_id, refresh_token } = user;
    if (!calendar_id || !refresh_token) {
      return res.status(200).json(task[0]);
    }
    // set the credentials to make the request to Google oauth servers
    oauth2Client.setCredentials({
      refresh_token: refresh_token,
      scope: oauthScope,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Check if user has not deleted the calendar from their application
    calendar.calendars
      .get({
        calendarId: calendar_id,
      })
      .then((existingCalendar) => {
        calendar.events.insert({
          calendarId: existingCalendar.data.id,
          sendNotifications: true,
          sendUpdates: "all",
          requestBody: {
            summary: task.title,
            description: task.description,
            start: {
              timeZone: "Asia/Kolkata",
              dateTime: task.start_at,
            },
            end: {
              timeZone: "Asia/Kolkata",
              dateTime: task.start_at,
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
      })
      .then(() => console.log("Event created successfully"))
      .catch((error) => console.log(error));

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  const { userId } = req;
  try {
    const tasks = await knex("tasks")
      .where({
        user_id: userId,
      })
      .orderBy("start_at", "asc");
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addNewTask,
  getAllTasks,
};
