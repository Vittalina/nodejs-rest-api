const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    const [, token] = authHeader.split(" ");
    if (!token) {
      next(new Unauthorized("Not authorized"));
    }
    const user = jwt.decode(token, JWT_SECRET);
    const authUser = await User.findById(user._id);

    if (!authUser || token !== authUser.token) {
      throw new Unauthorized("Not authorized");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    return next(new Unauthorized("No token"));
  }
}

module.exports = {
  auth,
};
