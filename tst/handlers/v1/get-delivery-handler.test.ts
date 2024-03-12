import 'reflect-metadata';
import { GetDeliveryHandler } from '../../../src/handlers/v1/get-delivery-handler';
import mockDelivery from '../../../tst/mocks/mock-deliveries';
import { DeliveryNotFoundError } from '../../../src/exceptions/delivery-not-found-error';

// Mocking the DAO and its method
const mockDeliveriesDao = {
  async getDeliveryById(deliveryId: string) {
    return deliveryId === 'delivery123' ? mockDelivery : null;
  },
};

describe('GetDeliveryHandler', () => {
  let getDeliveryHandler: GetDeliveryHandler;

  beforeEach(() => {
    getDeliveryHandler = new GetDeliveryHandler(mockDeliveriesDao);
  });

  it('should return delivery when it exists', async () => {
    const deliveryId = 'delivery123';
    const delivery = await getDeliveryHandler.getDelivery(deliveryId);
    expect(delivery).toEqual(mockDelivery);
  });

  it('should throw DeliveryNotFoundError when delivery does not exist', async () => {
    const deliveryId = 'nonExistentDelivery';
    await expect(getDeliveryHandler.getDelivery(deliveryId)).rejects.toThrow(DeliveryNotFoundError);
  });
});
