import { initMongoConnection } from './initMongoConnection.js';
import setupServer from './server.js';

await initMongoConnection();
console.log('Mongo connection successfully established!');
setupServer();
