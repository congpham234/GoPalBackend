import { Router, Request, Response, NextFunction } from 'express';
import getDeliveries from '../../../src/routes/delivery/get-deliveries';
import getDeliveryHandler from '../../../src/handlers/v1/get-delivery-handler';

jest.mock('../../../src/handlers/v1/get-delivery-handler', () => jest.fn());

describe('getDeliveries route', () => {
  it('should call getDeliveryHandler when /delivery is requested', async () => {
    // Setup
    const router = Router();

    // Mock the response object
    const mockResponse = {
      send: jest.fn(),
    } as unknown as Response;

    // Use the route handler directly without making an HTTP request
    // This is to setup the router first
    getDeliveries(router);

    // This is to simulate the request after the router for
    // getDelivereies is setup
    router(
      {
        method: 'GET',
        url: '/delivery',
      } as Request,
      mockResponse,
      (() => {
        return 'test';
      }) as NextFunction,
    );

    // Assert
    expect(getDeliveryHandler).toHaveBeenCalled();
  });
});
