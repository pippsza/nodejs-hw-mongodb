import { Contact } from '../models/contacts.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
) => {
  const contactQuery = Contact.find();
  if (typeof filter.type != 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite == true || filter.isFavourite == false) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    Contact.find()
      .merge(contactQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: contacts,
    totalItems,
    page,
    perPage,
    totalPages: totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
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
