import { Contact } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contacts = await Contact.findById(id);
  return contacts;
};
