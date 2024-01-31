import deliveryStatusEnum from './enums/delivery-status-enum';
import deliverySchema from './schemas/delivery-schema';

const components = {
  enums: {
    DeliveryStatus: deliveryStatusEnum,
  },
  schemas: {
    Delivery: deliverySchema,
  },
};

export default components;
