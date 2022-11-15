const Joi = require("joi");
const { google } = require("googleapis");

const knex = require("../db/knex");
const { oauth2Client, oauthScope } = require("../utils/auth");

const validateTaskSchema = (req, res, next) => {
  const { title, description, startDate } = req.body;

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.string().isoDate(),
  });

  const validationResult = schema.validate({
    title,
    description,
    startDate,
  });

  if (validationResult.error) {
    return res.status(422).json({
      code: "VALIDATION_ERROR",
      field: validationResult.error.details[0].path[0],
      message: validationResult.error.message,
    });
  }
  return next();
};

const updateOrAddNewEvent = async (req, res) => {
  const { taskId, userId } = req;
  // get the calendar id and oauth refresh token from the database.
  const user = await knex("users")
    .where({
      id: userId,
    })
    .select("*")
    .first();

  const task = await knex("tasks")
    .where({
      id: taskId,
      user_id: userId,
    })
    .select("*")
    .first();

  const { calendar_id, refresh_token } = user;
  const { event_id } = task;

  // Return if the user has not linked their calendar with the application.
  if (!calendar_id) {
    return res.status(200).json(task);
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
      if (event_id) {
        return calendar.events.get({
          calendarId: existingCalendar.data.id,
          eventId: event_id,
        });
      } else {
        return null;
      }
    })
    .then((existingEvent) => {
      if (existingEvent) {
        return calendar.events.update({
          calendarId: calendar_id,
          eventId: existingEvent.data.id,
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
          },
        });
      } else {
        return calendar.events.insert({
          calendarId: calendar_id,
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
      }
    })
    .then((event) => {
      return knex("tasks").where({ id: taskId, user_id: userId }).update({
        event_id: event.data.id,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return res.status(200).json(task);
};

const deleteAnEvent = async (req, res) => {
  const { deletedTask, userId } = req;

  // get the calendar id and oauth refresh token from the database.
  const user = await knex("users")
    .where({
      id: userId,
    })
    .select("*")
    .first();

  const { calendar_id, refresh_token } = user;
  const { event_id } = deletedTask;

  // Return if the user has not linked their calendar with the application.
  if (!calendar_id || !event_id) {
    return res.status(200).json({ message: "success" });
  }
  // set the credentials to make the request to Google oauth servers
  oauth2Client.setCredentials({
    refresh_token: refresh_token,
    scope: oauthScope,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  calendar.calendars
    .get({
      calendarId: calendar_id,
    })
    .then((existingCalendar) => {
      return calendar.events.delete({
        calendarId: existingCalendar.data.id,
        eventId: event_id,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return res.status(200).json({ message: "success" });
};

module.exports = {
  validateTaskSchema,
  updateOrAddNewEvent,
  deleteAnEvent,
};
