const deliverySchema = {
  type: 'object',
  properties: {
    OrderId: { type: 'string' },
    DeliveryId: { type: 'string' },
    DriverId: { type: 'string' },
    DeliveryDate: { type: 'string', format: 'date-time' },
    DeliveryStatus: { $ref: '#/components/enums/DeliveryStatus' },
    RecipientName: { type: 'string' },
    RecipientAddress: { type: 'string' },
    DeliveryInstructions: { $ref: '#/components/enums/DeliveryInstructions' },
    ProofOfDelivery: { type: 'string' },
  },
};

export default deliverySchema;
