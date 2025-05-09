import pinoHttp from 'pino-http';

import 'dotenv/config';
import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';
import { Contact } from './models/contacts.js';
import cors from 'cors';

const app = express();
const logger = pinoHttp();
const PORT = getEnvVar('PORT');

async function setupServer() {
  try {
    app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }
      app.use(
        cors({
          origin: `http://localhost:${PORT}`,
          optionsSuccessStatus: 200,
        }),
      );

      function loggerMiddleware(req, res, next) {
        logger(req, res);
        //   req.log.info('something else');
        //   res.end('hello world');
        next();
      }

      app.use(loggerMiddleware);

      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.get('/contacts/:contactId', async (req, res) => {
  const id = req.params.contactId;
  const contacts = await Contact.findById(id);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default setupServer;
