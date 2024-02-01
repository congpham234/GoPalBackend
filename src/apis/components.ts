import deliveryInstructionsEnum from './enums/delivery-instructions-enum';
import deliveryStatusEnum from './enums/delivery-status-enum';
import deliverySchema from './schemas/delivery-schema';

const components = {
  enums: {
    DeliveryStatus: deliveryStatusEnum,
    DeliveryInstructions: deliveryInstructionsEnum
  },
  schemas: {
    Delivery: deliverySchema,
  },
};

export default components;
