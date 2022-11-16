const createError = require("http-errors");
const Joi = require("joi");
const { google } = require("googleapis");

const knex = require("../db/knex");
const { oauth2Client, oauthScope } = require("../utils/auth");

const addNewTask = async (req, res, next) => {
  const { title, description, startDate } = req.body;
  const { userId } = req;
  try {
    let task = await knex("tasks")
      .insert({
        title,
        description,
        user_id: userId,
        start_at: startDate,
      })
      .returning("*");
    task = task[0];
    req.taskId = task.id;
    return next();
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

const updateTask = async (req, res, next) => {
  const { userId } = req;
  const { taskId } = req.params;
  const { title, description, startDate } = req.body;
  try {
    let task = await knex("tasks")
      .where({ id: taskId, user_id: userId })
      .update({
        title,
        description,
        user_id: userId,
        start_at: startDate,
      })
      .returning("*");
    task = task[0];
    if (!task) {
      const error = createError.NotFound();
      throw error;
    }
    req.taskId = task.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { userId } = req;
  const { taskId } = req.params;
  try {
    const taskToBeDeleted = await knex("tasks")
      .where({ id: taskId, user_id: userId })
      .select("*")
      .first();
    if (!taskToBeDeleted) {
      const error = createError.NotFound();
      throw error;
    }
    await knex("tasks").where({ id: taskId, user_id: userId }).del();
    req.deletedTask = taskToBeDeleted;
    return next();
  } catch (error) {
    return next(error);
  }
};

const syncEventsWithTasks = async (req, res, next) => {
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

  // Return if the user has not linked their calendar with the application.
  if (!calendar_id) {
    return res.status(200).json({});
  }
  // set the credentials to make the request to Google oauth servers
  oauth2Client.setCredentials({
    refresh_token: refresh_token,
    scope: oauthScope,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  let calendarExist;

  try {
    calendarExist = await calendar.calendars.get({
      calendarId: calendar_id,
    });
  } catch (error) {
    console.log("User has deleted the calendar from their Google account");
    await knex("users")
      .where({ id: userId })
      .update({ calendar_id: null, refresh_token: null });
    return res.status(200).json({});
  }

  if (calendarExist) {
    const events = await calendar.events.list({
      calendarId: calendarExist.data.id,
    });
    return res.status(200).json(events);
  }
};

module.exports = {
  addNewTask,
  getAllTasks,
  updateTask,
  deleteTask,
  syncEventsWithTasks,
};
