// Define the DeliveryStatus enum
enum DeliveryStatus {
    OutForDelivery = 'Out for Delivery',
    Delivered = 'Delivered',
    Exception = 'Exception',
}

// Define the Deliveries table model
interface Delivery {
    OrderId: string;
    DeliveryId: string;
    DriverId: string;
    DeliveryDate: Date;
    DeliveryStatus: DeliveryStatus;
    RecipientName: string;
    RecipientAddress: string;
    DeliveryNotes: string;
    ProofOfDelivery?: string;
}

// Example usage:
export const sampleDelivery: Delivery = {
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
