const router = require("express").Router();

const authController = require("../controllers/auth");
const authMiddlewares = require("../middlewares/auth");

router.post(
  "/signin/google",
  authController.signinGoogle,
  authMiddlewares.generateToken
);

router.post(
  "/verify-auth-code",
  authMiddlewares.isAuthenticated,
  authController.verifyAuthCode
);

module.exports = router;
