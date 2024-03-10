import 'reflect-metadata';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GetDeliveriesDao } from '../../src/daos/get-deliveries-dao';
import { ddbClient } from '../../src/middlewares/dynamodb-connection';

// Mock DynamoDB client
jest.mock('../../src/middlewares/dynamodb-connection', () => ({
  ddbClient: {
    send: jest.fn(),
  },
}));

// Mock marshall and unmarshall functions
jest.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: jest.fn(),
  unmarshall: jest.fn(),
}));

describe('DeliveriesDao', () => {
  let deliveriesDao: GetDeliveriesDao;

  beforeEach(() => {
    deliveriesDao = new GetDeliveriesDao();
  });

  afterEach(() => {
    // Reset the mocked ddbClient
    jest.clearAllMocks();
  });

  describe('getDeliveryById', () => {
    it('should return null if item is not found', async () => {
      // Mock DynamoDBClient's send method to return null Item
      (ddbClient.send as jest.Mock).mockResolvedValueOnce({ Item: null });
      (marshall as jest.Mock).mockImplementation((input) => input);


      const deliveryId = '1';
      const orderId = '123';

      const result = await deliveriesDao.getDeliveryById(deliveryId, orderId);

      expect(result).toBeNull();
      expect(ddbClient.send).toHaveBeenCalledTimes(1);
    });

    it('should return the delivery if item is found', async () => {
      // Mock DynamoDBClient's send method to return a mock Item
      const mockItem = { DeliveryId: '1', OrderId: '123' /* other fields */ };
      (ddbClient.send as jest.Mock).mockResolvedValueOnce({ Item: mockItem });
      (marshall as jest.Mock).mockImplementation((input) => input);
      (unmarshall as jest.Mock).mockImplementation((input) => input);

      const deliveryId = '1';
      const orderId = '123';

      const result = await deliveriesDao.getDeliveryById(deliveryId, orderId);

      expect(result).toEqual(mockItem);
      expect(ddbClient.send).toHaveBeenCalledTimes(1);
    });
  });
});
