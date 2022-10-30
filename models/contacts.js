const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  console.table(result);
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const getContact = result.find((contact) => contact.id === contactId);
  console.table(getContact);
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const newData = result.filter((contact) => contact.id !== contactId);
  console.table(newData);
  fs.writeFile(contactsPath, JSON.stringify(newData));
};

const addContact = async (name, email, phone) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  result.push({ name, email, phone });
  console.table(result);
  fs.writeFile(contactsPath, JSON.stringify(result));
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const getIndex = result.findIndex((contact) => contact.id === contactId);
  const contactIndex = result[getIndex];
  if (contactIndex === -1) {
    return;
  }
  Object.assign(result[getIndex], body);
  fs.writeFile(contactsPath, JSON.stringify(result));
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
