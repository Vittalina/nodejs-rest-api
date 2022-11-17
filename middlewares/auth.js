const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  const [tokenType, token] = authHeader.split(" ");
  if (tokenType === "Bearer" && token) {
    try {
      const verifiedToken = jwt.verify(token, JWT_SECRET);
      console.log("token is valid", verifiedToken);

      const user = await User.findById(verifiedToken._id);

      if (!token) {
        next(new Unauthorized("Not authorized"));
      }

      if (!user || token !== user.token) {
        throw new Unauthorized("Not authorized");
      }

      user.token = token;
      req.user = user;

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        next(new Unauthorized(error.name));
      }
      if (error.name === "JsonWebTokenError") {
        next(new Unauthorized(error.name));
      }

      throw error;
    }
  }

  return next(new Unauthorized("No token"));
}

module.exports = {
  auth,
};
