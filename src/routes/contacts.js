import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
const contactRoutes = express.Router();
const jsonParser = express.json();

import {
  deleteContactController,
  getAllContactsConroller,
  getContactByIdController,
  postContactController,
  updateContactController,
} from '../controllers/contacts.js';

contactRoutes.get('/', ctrlWrapper(getAllContactsConroller));

contactRoutes.post('/', jsonParser, ctrlWrapper(postContactController));

contactRoutes.get('/:contactId', ctrlWrapper(getContactByIdController));

contactRoutes.delete('/:contactId', ctrlWrapper(deleteContactController));

contactRoutes.patch(
  '/:contactId',
  jsonParser,
  ctrlWrapper(updateContactController),
);

contactRoutes.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
export default contactRoutes;
