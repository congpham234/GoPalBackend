import { SecretsManager } from 'aws-sdk';

// Function to retrieve a secret
async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManager({
    region: 'us-west-2',
  });
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return data.SecretString ?? '';
}

let bookingDotComApiKey: string;

(async () => {
  bookingDotComApiKey = await getSecret('BookingDotComAPIKeyId');
})();

export { bookingDotComApiKey };
