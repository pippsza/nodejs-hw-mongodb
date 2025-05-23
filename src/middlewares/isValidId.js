import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export default function isValidId(req, res, next) {
  const id = req.params.contactId;
  if (isValidObjectId(id) !== true) {
    return next(createHttpError.BadRequest('Incorrect id.'));
  }
  next();
}
