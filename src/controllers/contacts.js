import createHttpError from 'http-errors';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  postContact,
  updateContact,
} from '../services/contacts.js';

export async function getAllContactsConroller(req, res) {
  const contacts = await getAllContacts();
  if (contacts === null) {
    throw new createHttpError.NotFound('Contact not found.');
  }
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const id = req.params.contactId;

  const contacts = await getContactById(id);
  if (contacts === null) {
    throw new createHttpError.NotFound('Contact not found.');
  }
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function postContactController(req, res) {
  const contact = await postContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const contact = await updateContact(req.params.contactId, req.body);

  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found.');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContactController(req, res) {
  const contact = await deleteContact(req.params.contactId);
  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found.');
  }
  res.status(204).end();
}
