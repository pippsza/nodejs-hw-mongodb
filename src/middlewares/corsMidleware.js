import cors from 'cors';
import { getEnvVar } from '../utils/getEnvVar.js';
const PORT = getEnvVar('PORT');

export const corsMiddleware = cors({
  origin: `http://localhost:${PORT}`,
  optionsSuccessStatus: 200,
});
