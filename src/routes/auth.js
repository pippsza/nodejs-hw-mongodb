import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { loginController, registerController } from '../controllers/auth.js';
const authRoutes = express.Router();
const jsonParser = express.json();
authRoutes.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRoutes.post(
  'login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);
export default authRoutes;
