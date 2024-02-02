import {
  Delivery,
  DeliveryInstructions,
  DeliveryStatus,
} from '../../generated';

// Example usage:
const mockDeliveries: Delivery = {
  OrderId: 'order123',
  DeliveryId: 'delivery789',
  DriverId: 'driverXYZ',
  DeliveryDate: 'delivery date',
  DeliveryStatus: DeliveryStatus.DELIVERED,
  RecipientName: 'John Doe',
  RecipientAddress: '123 Main St, Cityville',
  DeliveryInstructions: DeliveryInstructions.LEAVE_AT_BACK_DOOR,
  ProofOfDelivery: 'ProofOfDelivery',
};

export default mockDeliveries;
