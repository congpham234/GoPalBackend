import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AppConfig, AppConfigKey } from './app-config';
import { S3Client } from '@aws-sdk/client-s3';
import OpenAI from 'openai';
import { Logger } from '@aws-lambda-powertools/logger';

export class ThirdPartyApps {
  private static instance: ThirdPartyApps | null = null;
  public readonly ddbClient: DynamoDBClient;
  public readonly s3Client: S3Client;
  public readonly openAI: OpenAI;
  public readonly generatedImageBucketName: string = 'client-image-bucket-id';
  public readonly clientImageBucketName: string = 'client-image-bucket-id';
  public readonly logger: Logger;

  private constructor() {
    const appConfig = AppConfig.getInstance();
    this.ddbClient = new DynamoDBClient({
      region: appConfig.getValue(AppConfigKey.AWS_REGION),
    });
    this.s3Client = new S3Client({
      region: appConfig.getValue(AppConfigKey.AWS_REGION),
    });
    this.openAI = new OpenAI({
      apiKey: appConfig.getValue(AppConfigKey.OPEN_AI_API_KEY),
    });
    this.logger = new Logger();
  }

  public static getInstance(): ThirdPartyApps {
    if (!ThirdPartyApps.instance) {
      ThirdPartyApps.instance = new ThirdPartyApps();
    }
    return ThirdPartyApps.instance;
  }
}
