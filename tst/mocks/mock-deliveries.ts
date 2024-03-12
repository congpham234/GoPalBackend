import { Delivery, DeliveryInstructions, DeliveryStatus } from '../../src/daos/models/delivery';


// Example usage:
const mockDelivery: Delivery = {
  deliveryId: 'delivery789',
  driverId: 'driverXYZ',
  deliveryDate: '2018-03-20T09:12:28Z',
  deliveryStatus: DeliveryStatus.DELIVERED,
  recipientName: 'John Doe',
  recipientAddress: '123 Main St, Cityville',
  deliveryInstructions: DeliveryInstructions.LEAVE_AT_BACK_DOOR,
  proofOfDelivery: 'ProofOfDelivery',
};

export default mockDelivery;
