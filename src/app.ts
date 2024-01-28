import express, { Express } from 'express';
import { Server } from 'http';
import routes from './routes';

const app: Express = express();
let server: Server | null = null;

if (process.env.ENVIRONMENT !== 'lambda') {
  const port: number = Number(process.env.PORT) || 3000;

  server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

app.use('/', routes);

export const closeServer = () => {
  if (server) {
    server.close();
  } else {
    console.log('Server is not running');
  }
};

export default app;
