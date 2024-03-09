import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Create a DynamoDB client
export const ddbClient = new DynamoDBClient({ region: 'us-west-2' });
