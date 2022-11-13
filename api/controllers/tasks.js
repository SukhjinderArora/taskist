const Joi = require("joi");

const knex = require("../db/knex");

const addNewTask = async (req, res, next) => {
  const { title, description, startDate } = req.body;
  const { userId } = req;

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

  const task = await knex("tasks")
    .insert({
      title,
      description,
      user_id: userId,
      start_at: startDate,
    })
    .returning("*");

  return res.status(200).json(task[0]);
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
