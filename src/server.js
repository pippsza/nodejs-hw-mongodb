import 'dotenv/config';
import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';
import contactRoutes from './routes/contacts.js';
import { loggerMiddleware } from './middlewares/contactMiddlewares.js';
import { corsMiddleware } from './middlewares/corsMidleware.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const PORT = getEnvVar('PORT');

app.use('/contacts', contactRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

async function setupServer() {
  app.use(corsMiddleware);

  app.use(loggerMiddleware);

  console.log(`Server started on port ${PORT}`);
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
  });
}

export default setupServer;
