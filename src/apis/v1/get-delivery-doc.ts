/** for /delivery GET route */
const getDeliveryDoc = {
  responses: {
    '200': {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Delivery',
          },
        },
      },
    },
  },
};

export default getDeliveryDoc;
