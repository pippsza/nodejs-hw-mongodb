import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import contactRoutes from './routes/contacts.js';
import { loggerMiddleware } from './middlewares/contactMiddlewares.js';
import { corsMiddleware } from './middlewares/corsMidleware.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import { auth } from './middlewares/auth.js';
const app = express();

const PORT = getEnvVar('PORT');

app.use(cookieParser());

app.use(corsMiddleware);

app.use(loggerMiddleware);

app.use('/contacts', auth, contactRoutes);

app.use('/auth', authRoutes);

app.use(errorHandler);

app.use(notFoundHandler);

async function setupServer() {
  console.log(`Server started on port ${PORT}`);
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
  });
}

export default setupServer;
