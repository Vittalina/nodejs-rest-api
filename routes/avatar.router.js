const express = require("express");

const avatarRouter = express.Router();

avatarRouter.get("/:avatarId", express.static("./public/avatars"));

module.exports = {
  avatarRouter,
};
