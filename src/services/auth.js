import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';
import crypto from 'node:crypto';
import { sendMail } from '../utils/sendMail.js';
import * as fs from 'fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { getEnvVar } from '../utils/getEnvVar.js';
import jwt from 'jsonwebtoken';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'send-email-template.hbs'),
  'UTF-8',
);
const dataExpiredForToken = new Date(Date.now() + 15 * 60 * 1000);
const dataExpiredForRefresh = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use.');
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  await Session.deleteOne({ userId: user._id });
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: user._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: dataExpiredForToken,
    refreshTokenValidUntil: dataExpiredForRefresh,
  });
}
export async function logoutUser(sessionId, refreshToken) {
  await Session.deleteOne({ _id: sessionId, refreshToken });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId });

  if (session == null) {
    throw new createHttpError.Unauthorized('Session not found.');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired.');
  }

  await Session.deleteOne({ userId: session._id });

  const accessToken = crypto.randomBytes(30).toString('base64');

  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: session._id,
    accessToken: accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: dataExpiredForToken,
    refreshTokenValidUntil: dataExpiredForRefresh,
  });
}

export async function sendResetEmail(email) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw new createHttpError.NotFound('User not found!');
  }
  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);
  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  await sendMail(
    user.email,
    'Reset password',

    template({
      link: `${getEnvVar('APP_DOMAIN')}reset-password/?token=${token}`,
    }),
  );
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw new createHttpError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }

    throw error;
  }
}
