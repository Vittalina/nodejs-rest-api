// const { User } = require("../models/user.model");
// const { Conflict, Unauthorized } = require("http-errors");
const { User: UserModel } = require("../models/user.model");

async function getContacts(req, res, next) {
  const { user } = req;

  await UserModel.findOne(user._id).populate("contacts", {
    name: 1,
    datePublished: 1,
    _id: 1,
  });

  return res.status(200).json({
    data: {
      contacts: user.contacts,
    },
  });
}

async function createContact(req, res, next) {
  const { _id } = req.body;
  const { user } = req;

  user.contacts.push({
    _id,
  });

  await UserModel.findByIdAndUpdate(user._id, user);

  return res.status(201).json({
    data: {
      contacts: user.contacts,
    },
  });
}

module.exports = {
  getContacts,
  createContact,
};
