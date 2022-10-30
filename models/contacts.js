const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  console.table(result);
  return result;
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const getContact = result.find((contact) => contact.id === contactId);
  console.table(getContact);
  return getContact;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const newData = result.filter((contact) => contact.id !== contactId);
  console.table(newData);
  if (newData.length === result.length) {
    return false;
  }
  fs.writeFile(contactsPath, JSON.stringify(newData));
  return true;
};

const addContact = async (name, email, phone) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const result = JSON.parse(data);
  const contact = { name, email, phone };
  result.push(contact);
  console.table(result);
  fs.writeFile(contactsPath, JSON.stringify(result));
  return contact;
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
  return contactIndex;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
