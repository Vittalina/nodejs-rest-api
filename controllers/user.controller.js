const { User } = require("../models/user.model");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

async function signup(req, res, next) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
    await user.save();
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      throw new Conflict("Email in use");
    }

    throw error;
  }

  return res.status(201).json({
    data: {
      user: {
        _id: user._id,
      },
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("User does not exists");
  }
  const isPasswordTheSame = await bcrypt.compare(password, user.password);
  if (!isPasswordTheSame) {
    throw new Unauthorized("wrong password");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // user.token = token;
  await User.findByIdAndUpdate(user._id, { token });

  return res.json({
    data: {
      token,
    },
  });
}

async function logout(req, res, next) {
  const { user } = req;

  await User.findByIdAndUpdate(user._id, { token: null });

  return res.json({});
}

async function getCurrentUser(req, res, next) {
  const { user } = req;

  const Userdata = await User.findById(user._id).select({
    email: 1,
    subscription: 1,
    _id: 0,
  });

  return res.status(200).json({ status: "success", Userdata });
}

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
