const createError = require("http-errors");

const knex = require("../db/knex");

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

module.exports = {
  addNewTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
