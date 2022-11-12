const router = require("express").Router();

const authController = require("../controllers/auth");
const authMiddlewares = require("../middlewares/auth");

router.post(
  "/signin/google",
  authController.signinGoogle,
  authMiddlewares.generateToken
);

module.exports = router;
