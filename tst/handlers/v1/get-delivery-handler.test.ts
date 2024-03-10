import 'reflect-metadata';
import { GetDeliveriesDao } from '../../../src/daos/get-deliveries-dao';
import { GetDeliveryHandler } from '../../../src/handlers/v1/get-delivery-handler';
import mockDeliveries from '../../../tst/mocks/mock-deliveries';
import { Request, Response } from 'express';
import { DeliveryNotFoundException } from '../../../src/exceptions/delivery-not-found-exception';

describe('GetDeliveryHandler', () => {
  let mockDeliveriesDao: jest.Mocked<GetDeliveriesDao>;
  let getDeliveryHandler: GetDeliveryHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockDeliveriesDao = {
      getDeliveryById: jest.fn(),
    } as unknown as jest.Mocked<GetDeliveriesDao>;

    getDeliveryHandler = new GetDeliveryHandler(mockDeliveriesDao);

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  it('should return the delivery when found', async () => {
    mockDeliveriesDao.getDeliveryById.mockResolvedValue(mockDeliveries);

    await getDeliveryHandler.getDelivery(mockRequest as Request, mockResponse as Response);

    expect(mockDeliveriesDao.getDeliveryById).toHaveBeenCalledWith('delivery789', 'order123');
    expect(mockResponse.json).toHaveBeenCalledWith(mockDeliveries);
  });

  it('should throw DeliveryNotFoundException when delivery not found', async () => {
    mockDeliveriesDao.getDeliveryById.mockResolvedValue(null);

    await expect(getDeliveryHandler.getDelivery(mockRequest as Request, mockResponse as Response))
      .rejects.toThrow(DeliveryNotFoundException);

    expect(mockDeliveriesDao.getDeliveryById).toHaveBeenCalledWith('delivery789', 'order123');
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
