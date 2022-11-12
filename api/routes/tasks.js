const router = require("express").Router();

const tasksController = require("../controllers/tasks");
const authMiddlewares = require("../middlewares/auth");

router.post(
  "/new",
  authMiddlewares.isAuthenticated,
  tasksController.addNewTask
);
router.get(
  "/all",
  authMiddlewares.isAuthenticated,
  tasksController.getAllTasks
);

module.exports = router;
