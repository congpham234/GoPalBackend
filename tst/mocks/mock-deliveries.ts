import { Delivery, DeliveryInstructions, DeliveryStatus } from '../../src/daos/models/delivery';


// Example usage:
const mockDeliveries: Delivery = {
  OrderId: 'order123',
  DeliveryId: 'delivery789',
  DriverId: 'driverXYZ',
  DeliveryDate: '2018-03-20T09:12:28Z',
  DeliveryStatus: DeliveryStatus.DELIVERED,
  RecipientName: 'John Doe',
  RecipientAddress: '123 Main St, Cityville',
  DeliveryInstructions: DeliveryInstructions.LEAVE_AT_BACK_DOOR,
  ProofOfDelivery: 'ProofOfDelivery',
};

export default mockDeliveries;
