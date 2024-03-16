import 'reflect-metadata';
import swaggerJSDoc from 'swagger-jsdoc';
import express, { Express } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import createRouter from './routes/router';
import { openApiValidator } from './middlewares/validator';
import errorHandler from './middlewares/error-handler';
import { readFileSync } from 'fs';
import { logger } from './middlewares/logger';

const app: Express = express();
let server: Server | null = null;

/** ------------------*/
const swaggerOptions = swaggerJSDoc({
  definition: JSON.parse(readFileSync('./openapi-spec.json', 'utf8')),
  apis: [
    './src/routes/**/*.ts',
  ],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
/** ------------------*/

app.use(errorHandler);
app.use(openApiValidator);

if (process.env.ENVIRONMENT !== 'lambda') {
  const port: number = Number(process.env.PORT) || 3000;

  server = app.listen(port, () => {
    logger.info('Server is listening to port: ' + port);
  });
}

app.use('/', createRouter());

export const closeServer = () => {
  if (server) {
    server.close();
  } else {
    logger.warn('Server Is Not Running!');
  }
};

export default app;
