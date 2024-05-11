import 'reflect-metadata';
import swaggerJSDoc from 'swagger-jsdoc';
import express, { Express } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import createRouter from './router';
import errorHandler from './middlewares/error-handler';
import { readFileSync } from 'fs';
import bodyParser from 'body-parser';
import { AppConfig } from './app-config';
import { ThirdPartyApps } from './third-party-apps';
import cors from 'cors';

const app: Express = express();
let server: Server | null = null;

/** ------------------*/
const swaggerOptions = swaggerJSDoc({
  definition: JSON.parse(readFileSync('./openapi-spec.json', 'utf8')),
  apis: ['./src/routes/**/*.ts'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
/** ------------------*/
app.use(cors({
  origin: true,
  methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  allowedHeaders: '*',
}));

app.use(errorHandler);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

export const startServer = async () => {
  if (process.env.ENVIRONMENT !== 'lambda') {
    const port: number = Number(process.env.PORT) || 3001;

    try {
      await AppConfig.getInstance().initializeAppConfig();
      await ThirdPartyApps.getInstance();

      server = app.listen(port, () => {
        console.log('Server is listening to port: ' + port);
      });

      app.use('/', createRouter());
    } catch (error) {
      console.error('Error initializing AppConfig:', error);
      // Handle the error appropriately
    }
  }
};

startServer();

export const closeServer = () => {
  if (server) {
    server.close();
  } else {
    console.log('Server Is Not Running!');
  }
};

export default app;
