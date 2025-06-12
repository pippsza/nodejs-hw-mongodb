import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  confirmOAuthSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendResetEmailSchema,
} from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  loginController,
  registerController,
  logoutController,
  refreshController,
  sendResetEmailController,
  resetPasswordController,
  getOAuthController,
  confirmOAuthController,
} from '../controllers/auth.js';

const authRoutes = express.Router();
const jsonParser = express.json();
authRoutes.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRoutes.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRoutes.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);
authRoutes.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRoutes.post('/refresh', ctrlWrapper(refreshController));
authRoutes.post('/logout', ctrlWrapper(logoutController));

authRoutes.get('/get-oauth-url', ctrlWrapper(getOAuthController));

authRoutes.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);

export default authRoutes;
