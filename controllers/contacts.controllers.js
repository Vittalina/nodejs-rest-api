const { Contact } = require("../models/contacts.model");
const { createNotFoundHttpError } = require("../helpers");

async function getAll(req, res, next) {
  const contacts = await Contact.find();

  return res.json({
    data: contacts,
  });
}

async function getOneById(req, res, next) {
  const { id, owner } = req.params;
  const contact = await Contact.findById(id, owner);
  if (contact) {
    return res.json({ data: { contact } });
  }
  return next(createNotFoundHttpError());
}

async function deleteById(req, res, next) {
  const { id, owner } = req.params;

  const contact = await Contact.findById(id, owner);
  if (contact) {
    await Contact.findByIdAndDelete(id, owner);
    return res.json({ data: { contact } });
  }
  return next(createNotFoundHttpError());
}

async function create(req, res, next) {
  const createdContact = await Contact.create(req.body);
  return res.status(201).json({
    data: {
      contact: createdContact,
    },
  });
}

async function updateById(req, res, next) {
  const { id, owner } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { $set: req.body },
    {
      new: true,
    },
    owner
  );
  console.log(updatedContact);
  return res.json({ data: { contact: updatedContact } });
}

async function updateStatusById(req, res, next) {
  const { favourite, owner } = req.body;
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updatedStatus = await Contact.findByIdAndUpdate(id, favourite, owner, {
    new: true,
  });
  if (!updatedStatus) {
    res.status(404).json({ message: "Not found" });
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
