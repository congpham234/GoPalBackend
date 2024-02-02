const deliverySchema = {
  type: 'object',
  properties: {
    OrderId: { type: 'string' },
    DeliveryId: { type: 'string' },
    DriverId: { type: 'string' },
    DeliveryDate: { type: 'string', format: 'date-time' },
    DeliveryStatus: { $ref: '#/components/schemas/DeliveryStatus' },
    RecipientName: { type: 'string' },
    RecipientAddress: { type: 'string' },
    DeliveryInstructions: { $ref: '#/components/schemas/DeliveryInstructions' },
    ProofOfDelivery: { type: 'string' },
  },
};

export default deliverySchema;
