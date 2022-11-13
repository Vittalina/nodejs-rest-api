const express = require("express");
const userController = require("../controllers/user.controller");
const { tryCatchWrapper } = require("../helpers");
const { auth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(userController.getContacts)
);
userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(userController.createContact)
);

module.exports = {
  userRouter,
};
