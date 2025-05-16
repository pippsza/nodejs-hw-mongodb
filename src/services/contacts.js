import { Contact } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contacts = await Contact.findById(id);
  return contacts;
};

export const postContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (id, payload) => {
  return Contact.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
