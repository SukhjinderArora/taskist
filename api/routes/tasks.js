const router = require("express").Router();

const tasksController = require("../controllers/tasks");

const authMiddlewares = require("../middlewares/auth");
const tasksMiddlewares = require("../middlewares/tasks");

router.post(
  "/new",
  authMiddlewares.isAuthenticated,
  tasksMiddlewares.validateTaskSchema,
  tasksController.addNewTask,
  tasksMiddlewares.updateOrAddNewEvent
);
router.get(
  "/all",
  authMiddlewares.isAuthenticated,
  tasksController.getAllTasks
);
router.put(
  "/:taskId/update",
  authMiddlewares.isAuthenticated,
  tasksMiddlewares.validateTaskSchema,
  tasksController.updateTask,
  tasksMiddlewares.updateOrAddNewEvent
);
router.delete(
  "/:taskId/delete",
  authMiddlewares.isAuthenticated,
  tasksController.deleteTask,
  tasksMiddlewares.deleteAnEvent
);

module.exports = router;
