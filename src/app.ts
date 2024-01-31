import express, { Express } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import createRouter from './routes/router';
import getDeliveryDoc from './apis/v1/get-delivery-doc';

const app: Express = express();
let server: Server | null = null;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Service',
      version: '1.0.0',
      description: 'API Description for Delivery Service',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
      '/delivery': getDeliveryDoc
    }
  },
  apis: [
    './src/routes/**/*.ts',
    './src/apis/**/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.ENVIRONMENT !== 'lambda') {
  const port: number = Number(process.env.PORT) || 3000;

  server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

app.use('/', createRouter());

export const closeServer = () => {
  if (server) {
    server.close();
  } else {
    console.log('Server is not running');
  }
};

export default app;
