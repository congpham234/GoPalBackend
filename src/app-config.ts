import { SecretsManager } from 'aws-sdk';

export class AppConfig {
  private static instance: AppConfig | null = null;
  private keyValueMap = new Map<AppConfigKey, string>();
  private initialized = false;

  private constructor() { }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public async initializeAppConfig(): Promise<void> {
    if (this.initialized) return;

    const awsRegion = 'us-west-2';
    this.keyValueMap.set(AppConfigKey.AWS_REGION, awsRegion);

    try {
      const bookingDotComApiKey = await getSecret('BookingDotComAPIKey', awsRegion);
      const openAiApiKey = await getSecret('OpenAiAPIKeyId', awsRegion);

      this.keyValueMap.set(AppConfigKey.BOOKING_DOT_COM_API_KEY, bookingDotComApiKey);
      this.keyValueMap.set(AppConfigKey.OPEN_AI_API_KEY, openAiApiKey);
      this.initialized = true;
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  }

  public getValue(key: AppConfigKey): string {
    return this.keyValueMap.get(key) ?? '';
  }
}

export enum AppConfigKey {
  BOOKING_DOT_COM_API_KEY,
  OPEN_AI_API_KEY,
  AWS_REGION,
}

// Function to retrieve a secret
async function getSecret(secretName: string, awsRegion: string): Promise<string> {
  const client = new SecretsManager({
    region: awsRegion,
  });
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return data.SecretString ?? '';
}
