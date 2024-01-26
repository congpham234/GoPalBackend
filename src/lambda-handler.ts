import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const server = awsServerlessExpress.createServer(app);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  awsServerlessExpress.proxy(server, event, context)

  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  return {
      statusCode: 200,
      body: JSON.stringify({    
          message: 'hello world 2',
      }),
   };
};
