import { getAllContacts, getContactById } from '../services/contacts.js';

export async function getAllContactsConroller(req, res) {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const id = req.params.contactId;

  const contacts = await getContactById(id);
  if (contacts == null) {
    return res.status(404).send({ message: 'Contact not found' });
  }
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
