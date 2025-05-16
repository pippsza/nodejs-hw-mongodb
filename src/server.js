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

async function setupServer() {
  try {
    app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }
      app.use(corsMiddleware);

      app.use(loggerMiddleware);

      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
app.use('/contacts', contactRoutes);

app.use((req, res, next) => {
  return notFoundHandler(req, res, next);
});

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default setupServer;
