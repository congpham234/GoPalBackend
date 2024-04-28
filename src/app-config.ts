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

    try {
      const bookingDotComApiKey = await getSecret('BookingDotComAPIKey');
      this.keyValueMap.set(AppConfigKey.BOOKING_DOT_COM_API_KEY, bookingDotComApiKey);
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
  BOOKING_DOT_COM_API_KEY = 'BOOKING_DOT_COM_API_KEY'
}

// Function to retrieve a secret
async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManager({
    region: 'us-west-2',
  });
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return data.SecretString ?? '';
}
