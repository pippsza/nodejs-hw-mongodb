import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
const contactRoutes = express.Router();
// const jsonParser = express.json();

import {
  getAllContactsConroller,
  getContactByIdController,
} from '../controllers/contacts.js';

contactRoutes.get('/', ctrlWrapper(getAllContactsConroller));

contactRoutes.get('/:contactId', ctrlWrapper(getContactByIdController));

contactRoutes.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
export default contactRoutes;
