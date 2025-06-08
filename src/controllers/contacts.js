import createHttpError from 'http-errors';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  postContact,
  updateContact,
} from '../services/contacts.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFiltersParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getAllContactsConroller(req, res) {
  const query = req.query;
  const { page, perPage } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query);
  const filter = parseFilterParams(query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    ownerId: req.user.id,
  });
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

  const contacts = await getContactById({ id, ownerId: req.user.id });
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
  let photo = null;

  if (req.file.path !== undefined) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'avatars', req.file.filename),
      );

      photo = `${getEnvVar('APP_DOMAIN')}avatars/${req.file.filename}`;
    }
  }

  const contact = await postContact({
    payload: req.body,
    ownerId: req.user.id,
    photo,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  let photo = null;

  if (req.file.path !== undefined) {
    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'avatars', req.file.filename),
      );

      photo = `${getEnvVar('APP_DOMAIN')}avatars/${req.file.filename}`;
    }
  }
  const contact = await updateContact({
    id: req.params.contactId,
    payload: req.body,
    ownerId: req.user.id,
    photo,
  });

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
  const contact = await deleteContact({
    id: req.params.contactId,
    ownerId: req.user.id,
  });
  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found.');
  }
  res.status(204).end();
}
