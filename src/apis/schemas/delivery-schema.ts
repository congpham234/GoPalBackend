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
    DeliveryNotes: { type: 'string' },
    ProofOfDelivery: { type: 'string' },
  },
};

export default deliverySchema;
