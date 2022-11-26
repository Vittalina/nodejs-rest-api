const { User } = require("../models/user.model");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const { JWT_SECRET, USER, PASS } = process.env;

// send email
async function sendRegisterEmail({ email, verificationToken }) {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: USER,
      pass: PASS,
    },
  });

  const url = `http://localhost:3000/api/users/verify/${verificationToken}`;

  const emailBody = {
    from: "info@contactsReader.com",
    to: email,
    subject: "Please verify your email",
    html: `<h1> Please open this link: ${url} to verify your email <h1>`,
    text: `Please open this link: ${url} to verify your email`,
  };

  const response = await transport.sendMail(emailBody);
  console.log("Email sent", response);
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken,
  });

  // no user
  if (!user) {
    throw new NotFound("User not found");
  }

  // user exists, not verified
  if (!user.verify) {
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.json({
      message: "Verification successful",
    });
  }

  // user exists, verified
  if (user.verify) {
    return res.json({
      message: "Your Email already verified",
    });
  }
}

async function repeatedVerification(req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // const { verificationToken } = user;
  const verificationToken = uuidv4();

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  if (!user) {
    throw new NotFound("Not found");
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  if (!user.verify) {
    await sendRegisterEmail({ email, verificationToken });
    res.status(200).json({ message: "Verification email sent" });
  }
}

async function signup(req, res, next) {
  const { email, password } = req.body;

  const verificationToken = uuidv4();

  const user = new User({ email, password, verificationToken });

  try {
    await user.save();
    await sendRegisterEmail({ email, verificationToken });
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

  if (!user.verify) {
    throw new Unauthorized("Email is not verified");
  }

  const isPasswordTheSame = await bcrypt.compare(password, user.password);
  if (!isPasswordTheSame) {
    throw new Unauthorized("wrong password");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

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

async function updateAvatar(req, res, next) {
  const { user } = req;
  // const { avatarURL } = req.body;
  const { filename } = req.file;
  const avatarURL = `avatars/${filename}`;

  // 1 - save file in public/avatars
  console.log(req.file);
  const newPath = path.join(__dirname, "../public/avatars", req.file.filename);
  await fs.rename(req.file.path, newPath);

  Jimp.read(newPath, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).quality(60).greyscale().write(newPath);
  });

  const updatedAvatar = await User.findByIdAndUpdate(
    user._id,
    {
      avatarURL,
    },
    { new: true }
  ).select({ avatarURL: 1, _id: 0 });

  return res.status(200).json({ status: "success", updatedAvatar });
}

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  verifyEmail,
  repeatedVerification,
};
