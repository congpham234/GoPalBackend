import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import getDeliveries from '../../../src/routes/delivery/get-deliveries';
import { GetDeliveryHandler } from '../../../src/handlers/v1/get-delivery-handler';

const mockGetDeliveryHandler = jest
  .spyOn(GetDeliveryHandler.prototype, 'getDelivery')
  .mockImplementationOnce(async () => {
    return Promise.resolve();
  });

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
        url: '/v1/delivery',
      } as Request,
      mockResponse,
      (() => {
        return 'test';
      }) as NextFunction,
    );

    // Assert
    expect(mockGetDeliveryHandler).toHaveBeenCalled();
  });
});
