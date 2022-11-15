const { Contact } = require("../models/contacts.model");
const { createNotFoundHttpError } = require("../helpers");

async function getAll(req, res, next) {
  const { _id } = req.user;

  const contacts = await Contact.find({ owner: _id });

  return res.json({
    data: contacts,
  });
}

async function getOneById(req, res, next) {
  const { id } = req.params;
  const { _id } = req.user;

  const contact = await Contact.findById({ _id: id, owner: _id });
  if (contact) {
    return res.json({ data: { contact } });
  }
  return next(createNotFoundHttpError());
}

async function deleteById(req, res, next) {
  const { id } = req.params;
  const { _id } = req.user;

  const contact = await Contact.findOneAndDelete({ _id: id, owner: _id });
  if (contact) {
    return res.json({ data: { contact } });
  }
  return next(createNotFoundHttpError());
}

async function create(req, res, next) {
  const { _id } = req.user;
  // const { name, email, phone } = req.body;

  const createdContact = await Contact.create({ owner: _id, ...req.body });
  return res.status(201).json({
    data: {
      contact: createdContact,
    },
  });
}

async function updateById(req, res, next) {
  const { id } = req.params;
  const { _id } = req.user;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner: _id },
    { $set: req.body },
    {
      new: true,
    }
  );
  return res.json({ data: { contact: updatedContact } });
}

async function updateStatusById(req, res, next) {
  const { favorite } = req.body;
  const { id } = req.params;
  const { _id } = req.user;

  const updatedStatus = await Contact.findOneAndUpdate(
    { _id: id, owner: _id },
    { favorite },
    {
      new: true,
    }
  );
  if (!updatedStatus) {
    res.status(400).json({ message: "Not found" });
    return;
  }
  res
    .status(200)
    .json({ message: "success", data: { contact: updatedStatus } });
}

module.exports = {
  getAll,
  getOneById,
  deleteById,
  create,
  updateById,
  updateStatusById,
};
