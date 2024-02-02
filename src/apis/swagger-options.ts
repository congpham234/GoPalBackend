import swaggerJSDoc from 'swagger-jsdoc';
import getDeliveryDoc from './v1/get-delivery-doc';
import updateDeliveryDoc from './v1/update-delivery-doc';
import deliveryInstructionsEnum from './schemas/delivery-instructions-enum';
import deliveryStatusEnum from './schemas/delivery-status-enum';
import deliverySchema from './schemas/delivery-schema';

const components = {
  schemas: {
    Delivery: deliverySchema,
    DeliveryStatus: deliveryStatusEnum,
    DeliveryInstructions: deliveryInstructionsEnum,
  },
};

const deliveryPath = {
  get: getDeliveryDoc, post: updateDeliveryDoc,
};

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Service',
      version: '1.0.0',
      description: 'API Description for Delivery Service',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
      '/v1/delivery': deliveryPath,
    },
    components: components,
  },
  apis: [
    './src/routes/**/*.ts',
  ],
};

const swaggerOptions = swaggerJSDoc(options);

console.log(JSON.stringify(swaggerOptions));

export default swaggerOptions;
