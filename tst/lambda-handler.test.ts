import {handler} from '../src/lambda-handler';
import {Context, APIGatewayEvent} from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';

const eventMock: jest.Mocked<APIGatewayEvent> =
  {} as jest.Mocked<APIGatewayEvent>;
const contextMock: jest.Mocked<Context> = {} as jest.Mocked<Context>;

// Mock the createServer function with jest.fn()
jest.mock('aws-serverless-express', () => ({
  createServer: jest.fn().mockImplementation(() => ({})),
  proxy: jest.fn().mockImplementation(() => Promise.resolve()),
}));

// Mock app
jest.mock('../src/app', () => ({}));

describe('Lambda Handler', () => {
  it('should proxy the request using aws-serverless-express', async () => {
    // Call the handler with the mock data
    await handler(eventMock, contextMock);

    // Check if aws-serverless-express.createServer was called
    expect(awsServerlessExpress.createServer).toHaveBeenCalled();

    // Check if aws-serverless-express.proxy
    // was called with the correct arguments
    expect(awsServerlessExpress.proxy).toHaveBeenCalledWith(
        {},
        eventMock,
        contextMock,
    );
  });
});
