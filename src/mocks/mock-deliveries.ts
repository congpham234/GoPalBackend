import { Delivery, DeliveryStatus } from '../models/delivery';

// Example usage:
const mockDeliveries: Delivery = {
  OrderId: 'order123',
  DeliveryId: 'delivery789',
  DriverId: 'driverXYZ',
  DeliveryDate: new Date(),
  DeliveryStatus: DeliveryStatus.OutForDelivery,
  RecipientName: 'John Doe',
  RecipientAddress: '123 Main St, Cityville',
  DeliveryNotes: 'Leave at the doorstep',
  ProofOfDelivery: 'ProofOfDelivery',
};

export default mockDeliveries;
