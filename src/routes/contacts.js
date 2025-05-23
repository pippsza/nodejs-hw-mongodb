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
import validateBody from '../middlewares/validateBody.js';
import { contactSchema, updatecontactSchema } from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';

contactRoutes.get('/', ctrlWrapper(getAllContactsConroller));

contactRoutes.post(
  '/',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(postContactController),
);

contactRoutes.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRoutes.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

contactRoutes.patch(
  '/:contactId',
  jsonParser,
  validateBody(updatecontactSchema),
  isValidId,
  ctrlWrapper(updateContactController),
);

export default contactRoutes;
