import { singleton } from 'tsyringe';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@singleton()
export class AppConfig {
  private secrets: Map<string, string>;

  constructor() {
    this.secrets = new Map<string, string>();
    this.secrets.set(
      AppConfigKey.AWS_REGION,
      process.env.AWS_REGION || 'us-west-2',
    );
  }

  public async getValue(key: AppConfigKey): Promise<string> {
    if (this.secrets.has(key)) {
      return this.secrets.get(key) as string;
    } else {
      const secret = await getSecret(
        key,
        this.secrets.get(AppConfigKey.AWS_REGION) as string,
      );
      this.secrets.set(key, secret);
      return secret;
    }
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
  AWS_REGION = 'AWS_REGION',
}
