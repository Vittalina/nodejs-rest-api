const express = require("express");
const userController = require("../controllers/user.controller");
const { tryCatchWrapper } = require("../helpers");
const { auth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/signup", tryCatchWrapper(userController.signup));
userRouter.post("/login", tryCatchWrapper(userController.login));
userRouter.post(
  "/logout",
  tryCatchWrapper(auth),
  tryCatchWrapper(userController.logout)
);
userRouter.get(
  "/current",
  tryCatchWrapper(auth),
  tryCatchWrapper(userController.getCurrentUser)
);

module.exports = {
  userRouter,
};
