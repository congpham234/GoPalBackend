const requestBody = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Delivery',
      },
    },
  },
};

/** for /delivery POST route */
const updateDeliveryDoc = {
  responses: {
    '200': {
      description: 'Successful response',
    },
  },
  requestBody: requestBody,
};


export default updateDeliveryDoc;
