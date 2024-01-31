import { Request, Response } from 'express';
import getDeliveryHandler from '../../../src/handlers/v1/get-delivery-handler';

// Mock Express objects
const mockRequest = {} as Request;
const mockResponse = {
  send: jest.fn(),
} as unknown as Response;

describe('getDeliveryHandler', () => {
  it('should send "App running" response', () => {
    // Call the function with the mocked request and response
    getDeliveryHandler(mockRequest, mockResponse);

    // Assert that the response.send method was called with
    // the expected argument
    expect(mockResponse.send).toHaveBeenCalledWith('App running');
  });
});
