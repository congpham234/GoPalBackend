import express, { Express } from 'express';
import { Server } from 'http';
import routes from './routes/delivery';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Express = express();
let server: Server | null = null;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your mom',
      version: '1.0.0',
      description: 'Your API description',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.ts'], // paths to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
