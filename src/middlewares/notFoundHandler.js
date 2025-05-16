import createHttpError from 'http-errors';

export default function notFoundHandler(req, res, next) {
  next(createHttpError(404, 'Contact not found'));
}
