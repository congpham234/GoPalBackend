import 'reflect-metadata';
import { GetDeliveriesDao } from '../../../src/daos/get-deliveries-dao';
import { GetDeliveryHandler } from '../../../src/handlers/v1/get-delivery-handler';
import mockDeliveries from '../../../tst/mocks/mock-deliveries';
import { Request, Response } from 'express';

const mockDeliveriesDao = jest
  .spyOn(GetDeliveriesDao.prototype, 'getDeliveryById')
  .mockImplementationOnce(async () => {
    // You can return null here if needed, assuming mockDeliveries is of type Delivery
    return Promise.resolve(mockDeliveries);
  });


describe('GetDeliveryHandler', () => {
  let handler: GetDeliveryHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    handler = new GetDeliveryHandler(new GetDeliveriesDao());
    mockRequest = {}; // We'll leave this empty for now
    mockResponse = {
      json: jest.fn(),
    };
  });

  it('should respond with mock deliveries', async () => {
    await handler.getDelivery(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.json).toHaveBeenCalledWith(mockDeliveries);
    expect(mockDeliveriesDao).toHaveBeenCalled();
  });
});
