// const express = require("express");

// const {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// } = require("../../models/contacts");
// const { contactValidation } = require("../../validation/joiValidation");

// const router = express.Router();

// router.get("/", async (req, res, next) => {
//   const contacts = await listContacts();
//   res.json({
//     status: "success",
//     code: 200,
//     data: {
//       contacts,
//     },
//   });
// });

// router.get("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   const contact = await getContactById(contactId);
//   if (contact) {
//     res.json({
//       status: "success",
//       code: 200,
//       data: {
//         contact,
//       },
//     });
//   }
//   return res.status(404).json({ mesage: "Not found" });
// });

// router.post("/", contactValidation, async (req, res, next) => {
//   const { name, email, phone } = req.body;
//   if (name || email || phone) {
//     const contact = await addContact(name, email, phone);
//     res.status(201).json({ message: "contact added", contact });
//   }
//   return res.status(400).json({ mesage: "missing required name field" });
// });

// router.delete("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   const removedContact = await removeContact(contactId);
//   if (removedContact) {
//     res.status(200).json({ message: "contact deleted" });
//   }
//   return res.status(404).json({ mesage: "Not found" });
// });

// router.put("/:contactId", contactValidation, async (req, res, next) => {
//   const { contactId } = req.params;
//   if (Object.keys(req.body).length === 0) {
//     return res.status(400).json({ mesage: "missing fields" });
//   }
//   const updatedContact = await updateContact(contactId, req.body);
//   if (updatedContact) {
//     res.status(200).json({ message: "success", contact: updatedContact });
//   }
//   return res.status(400).json({ mesage: "Not found" });
// });

// module.exports = router;
