import { GetDeliveryHandler } from '../../../src/handlers/v1/get-delivery-handler';
import mockDeliveries from '../../../tst/mocks/mock-deliveries';
import { Request, Response } from 'express';

describe('GetDeliveryHandler', () => {
  let handler: GetDeliveryHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    handler = new GetDeliveryHandler();
    mockRequest = {}; // We'll leave this empty for now
    mockResponse = {
      json: jest.fn(),
    };
  });

  it('should respond with mock deliveries', () => {
    handler.getDelivery(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.json).toHaveBeenCalledWith(mockDeliveries);
  });
});
