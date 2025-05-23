import { isHttpError } from 'http-errors';
export default function errorHandler(err, req, res, next) {
  if (isHttpError(err) === true) {
    return res
      .status(err.status)
      .json({ status: err.status, message: err.message });
  }
  console.error('err handler: ', err);
  res
    .status(500)
    .json({ status: 500, message: 'Something went wrong', data: err.message });
}
