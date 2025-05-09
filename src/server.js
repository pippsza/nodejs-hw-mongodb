import 'dotenv/config';
import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';

import { getAllContacts, getContactById } from './services/contacts.js';
import { loggerMiddleware } from './middlewares/contactMiddlewares.js';
import { corsMiddleware } from './middlewares/corsMidleware.js';

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

app.get('/contacts', async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.get('/contacts/:contactId', async (req, res) => {
  const id = req.params.contactId;

  const contacts = await getContactById(id);
  if (contacts == null) {
    return res.status(404).send({ message: 'Contact not found' });
  }
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
