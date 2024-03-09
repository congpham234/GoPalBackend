export class Delivery {
  OrderId?: string;
  DeliveryId?: string;
  DriverId?: string;
  DeliveryDate?: string;
  DeliveryStatus?: DeliveryStatus;
  RecipientName?: string;
  RecipientAddress?: string;
  DeliveryInstructions?: DeliveryInstructions;
  ProofOfDelivery?: string;
}

export enum DeliveryStatus {
  DELIVERED = 'DELIVERED',
  IN_TRANSIT = 'IN_TRANSIT',
  PENDING = 'PENDING',
}

export enum DeliveryInstructions {
  LEAVE_AT_FRONT_DOOR = 'LEAVE_AT_FRONT_DOOR',
  LEAVE_AT_BACK_DOOR = 'LEAVE_AT_BACK_DOOR',
  OTHER = 'OTHER',
}
