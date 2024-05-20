import { singleton } from 'tsyringe';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@singleton()
export class AppConfig {
  private keyvalues: Map<string, string>;

  constructor() {
    this.keyvalues = new Map<string, string>();
  }

  public async getValue(key: AppConfigKey): Promise<string> {
    if (this.keyvalues.has(key)) {
      return this.keyvalues.get(key) as string;
    } else {
      await this.loadSecrets();
      if (this.keyvalues.has(key)) {
        return this.keyvalues.get(key) as string;
      } else {
        throw new Error(`Could not find the API KEY: ${key}`);
      }
    }
  }

  private async loadSecrets(): Promise<void> {
    const secretString = await getSecret(
      'GoPalBackendExternalAPIKeyId',
      this.keyvalues.get(AppConfigKey.AWS_REGION) as string,
    );

    const secretObject = JSON.parse(secretString);
    for (const [key, value] of Object.entries(secretObject)) {
      this.keyvalues.set(key, value as string);
    }

    this.keyvalues.set(
      AppConfigKey.AWS_REGION,
      process.env.AWS_REGION || 'us-west-2',
    );
  }
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
    } else {
      throw new Error('No secret string returned for ' + secretName);
    }
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    throw error;
  }
}

// Define an enum for AppConfig keys
export enum AppConfigKey {
  BOOKING_DOT_COM_API_KEY = 'BookingDotComAPIKey',
  OPEN_AI_API_KEY = 'OpenAiAPIKeyId',
  GOOGLE_PLACES_API_KEY = 'GooglePlacesAPIKey',
  PIXABAY_API_KEY = 'PixabayAPIKey',
  AWS_REGION = 'AWS_REGION',
}
