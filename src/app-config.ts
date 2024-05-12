import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export class AppConfig {
  private static instance: AppConfig | null = null;
  private static keyValueMap = new Map<AppConfigKey, string>();
  // Workaround for persisting Config across different lambda invocation
  private static initialized: boolean;

  private constructor() {}

  public static async getInstance(): Promise<AppConfig> {
    if (!AppConfig.instance || !AppConfig.initialized) {
      AppConfig.instance = new AppConfig();
      await AppConfig.initializeAppConfig();
      AppConfig.initialized = true;
    }
    return AppConfig.instance;
  }

  private static async initializeAppConfig(): Promise<void> {
    if (AppConfig.initialized) return;

    const awsRegion = 'us-west-2';
    AppConfig.keyValueMap.set(AppConfigKey.AWS_REGION, awsRegion);

    try {
      const bookingDotComApiKey = await getSecret(
        'BookingDotComAPIKey',
        awsRegion,
      );
      const openAiApiKey = await getSecret('OpenAiAPIKeyId', awsRegion);

      AppConfig.keyValueMap.set(
        AppConfigKey.BOOKING_DOT_COM_API_KEY,
        bookingDotComApiKey,
      );
      AppConfig.keyValueMap.set(AppConfigKey.OPEN_AI_API_KEY, openAiApiKey);
      AppConfig.initialized = true;
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  }

  public getValue(key: AppConfigKey): string {
    return AppConfig.keyValueMap.get(key) ?? '';
  }
}

export enum AppConfigKey {
  BOOKING_DOT_COM_API_KEY,
  OPEN_AI_API_KEY,
  AWS_REGION,
}

// Function to retrieve a secret
async function getSecret(
  secretName: string,
  awsRegion: string,
): Promise<string> {
  const client = new SecretsManagerClient({ region: awsRegion });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  try {
    const data = await client.send(command);
    if (data.SecretString) {
      return data.SecretString;
    }
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    throw error; // Re-throw the error to handle it in the calling function.
  }
  return ''; // Return an empty string if there is no secret or in case of error.
}
