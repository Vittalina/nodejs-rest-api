const express = require("express");
const contactsController = require("../controllers/contacts.controllers");
const { tryCatchWrapper } = require("../helpers");
const { contactValidation } = require("../validation/joiValidation");

const contactsRouter = express.Router();

contactsRouter.get("/", tryCatchWrapper(contactsController.getAll));
contactsRouter.get("/:id", tryCatchWrapper(contactsController.getOneById));
contactsRouter.delete("/:id", tryCatchWrapper(contactsController.deleteById));
contactsRouter.post(
  "/",
  contactValidation,
  tryCatchWrapper(contactsController.create)
);
contactsRouter.put(
  "/:id",
  contactValidation,
  tryCatchWrapper(contactsController.updateById)
);
contactsRouter.patch(
  "/:id",
  tryCatchWrapper(contactsController.updateStatusById)
);

module.exports = {
  contactsRouter,
};
