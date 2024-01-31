// Define the DeliveryStatus enum
export enum DeliveryStatus {
    OutForDelivery = 'Out for Delivery',
    Delivered = 'Delivered',
    Exception = 'Exception',
}

// Define the Deliveries table model
export interface Delivery {
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
