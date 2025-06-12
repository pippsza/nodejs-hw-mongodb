import createHttpError from 'http-errors';
import {
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resetPassword,
  sendResetEmail,
} from '../services/auth.js';
import { getOAuthURL, validateCode } from '../utils/googleOAuth.js';

export async function registerController(req, res, next) {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.json({
    status: 200,
    message: 'Login successfully!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { refreshToken, sessionId } = req.cookies;
  if (typeof sessionId == 'string') {
    await logoutUser(sessionId);
  }

  logoutUser(sessionId, refreshToken);
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function sendResetEmailController(req, res, next) {
  try {
    const { email } = req.body;

    await sendResetEmail(email);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    console.log(err);
    next(
      createHttpError[500]('Failed to send the email, please try again later.'),
    );
  }
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

export function getOAuthController(req, res) {
  const url = getOAuthURL();

  res.json({
    status: 200,
    data: {
      message: 'Successfully get OAuth url',
      oauth_url: url,
    },
  });
}

export async function confirmOAuthController(req, res) {
  const ticket = await validateCode(req.body.code);
  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Login with Google successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}
