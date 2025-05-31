import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import { User } from '../models/user.model.js';

export async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    next(new createHttpError.Unauthorized('Please provide access token.'));
  }
  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' && typeof accessToken !== 'undefined') {
    next(new createHttpError.Unauthorized('Please provide access token.'));
  }

  const session = Session.findOne({ accessToken });
  if (session === null) {
    next(new createHttpError.Unauthorized('Session not found'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    next(new createHttpError.Unauthorized('Access token expired'));
  }
  const user = User.findOne({ _id: session.userId });
  if (user === null) {
    next(new createHttpError.Unauthorized('User not found'));
  }
  req.user = { id: user._id, name: user.name };

  next();
}
