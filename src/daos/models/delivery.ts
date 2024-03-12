export class Delivery {
  deliveryId?: string;
  driverId?: string;
  deliveryDate?: string;
  deliveryStatus?: DeliveryStatus;
  recipientName?: string;
  recipientAddress?: string;
  deliveryInstructions?: DeliveryInstructions;
  proofOfDelivery?: string;
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
