import {
  loginUser,
  logoutUser,
  registerUser,
  refreshSession,
} from '../services/auth.js';

export async function registerController(req, res) {
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
    htttpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    htttpOnly: true,
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
  const session = await loginUser(req.body.email, req.body.password);
  res.cookie('sessionId', session._id, {
    htttpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    htttpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  res.json({
    status: 200,
    message: 'Refresh successfully!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
