const express = require("express");
const contactsController = require("../controllers/contacts.controllers");
const { tryCatchWrapper } = require("../helpers");
const {
  contactValidation,
  contactFavoriteValidation,
} = require("../validation/joiValidation");
const { auth } = require("../middlewares/auth");

const contactsRouter = express.Router();

contactsRouter.use(auth);

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
  "/:id/favorite",
  contactFavoriteValidation,
  tryCatchWrapper(contactsController.updateStatusById)
);

module.exports = {
  contactsRouter,
};
