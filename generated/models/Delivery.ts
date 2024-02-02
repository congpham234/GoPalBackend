/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* eslint-disable */
import type { DeliveryInstructions } from './DeliveryInstructions';
import type { DeliveryStatus } from './DeliveryStatus';
export type Delivery = {
    OrderId?: string;
    DeliveryId?: string;
    DriverId?: string;
    DeliveryDate?: string;
    DeliveryStatus?: DeliveryStatus;
    RecipientName?: string;
    RecipientAddress?: string;
    DeliveryInstructions?: DeliveryInstructions;
    ProofOfDelivery?: string;
};

