import { Request, Response } from 'express';
import mockDeliveries from '../../../src/mocks/mock-deliveries';
import getDeliveryHandler from '../../../src/handlers/v1/get-delivery-handler';

describe('getDeliveryHandler', () => {
  it('should respond with mock deliveries', () => {
    // Mock Express request and response objects
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Call the handler
    getDeliveryHandler(req, res);

    // Check if res.json is called with the mock deliveries
    expect(res.json).toHaveBeenCalledWith(mockDeliveries);
  });
});
