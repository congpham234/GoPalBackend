import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AppConfig, AppConfigKey } from './app-config';
import { S3Client } from '@aws-sdk/client-s3';
import OpenAI from 'openai';

export class ThirdPartyApps {
  private static instance: ThirdPartyApps | null = null;
  private static ddbClient: DynamoDBClient;
  private static s3Client: S3Client;
  private static openAI: OpenAI;
  private static generatedImageBucketName = 'client-image-bucket-id';
  private static clientImageBucketName = 'client-image-bucket-id';
  // Workaround for persisting Config across different lambda invocations
  private static initialized: boolean;

  private constructor() {}

  private static async initializeThirdPartyApp(): Promise<void> {
    const appConfig = await AppConfig.getInstance();
    ThirdPartyApps.ddbClient = new DynamoDBClient({
      region: appConfig.getValue(AppConfigKey.AWS_REGION),
    });
    this.s3Client = new S3Client({
      region: appConfig.getValue(AppConfigKey.AWS_REGION),
    });
    this.openAI = new OpenAI({
      apiKey: appConfig.getValue(AppConfigKey.OPEN_AI_API_KEY),
    });
  }

  public static async getInstance(): Promise<ThirdPartyApps> {
    if (!ThirdPartyApps.instance || !ThirdPartyApps.initialized) {
      ThirdPartyApps.instance = new ThirdPartyApps();
      ThirdPartyApps.initializeThirdPartyApp();
      ThirdPartyApps.initialized = true;
    }
    return ThirdPartyApps.instance;
  }

  public get ddbClientInstance(): DynamoDBClient {
    return ThirdPartyApps.ddbClient;
  }

  public get s3ClientInstance(): S3Client {
    return ThirdPartyApps.s3Client;
  }

  public get openAIInstance(): OpenAI {
    return ThirdPartyApps.openAI;
  }

  public get generatedImageBucket(): string {
    return ThirdPartyApps.generatedImageBucketName;
  }

  public get clientImageBucket(): string {
    return ThirdPartyApps.clientImageBucketName;
  }
}
