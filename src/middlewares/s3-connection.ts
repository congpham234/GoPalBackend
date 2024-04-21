import { S3Client } from '@aws-sdk/client-s3';
import { container } from 'tsyringe';
import TOKENS from './di-tokens';

// Assuming these are set in your environment or configured elsewhere in your app
const region = 'us-west-2'; // Example region
export const generatedImageBucketName = 'client-image-bucket-id';

// Register the dependencies
container.register(TOKENS.region, { useValue: region });
container.register(TOKENS.generatedImageBucketName, { useValue: generatedImageBucketName });
container.register(TOKENS.clientImageBucketName, { useValue: generatedImageBucketName });

export const s3Client = new S3Client({
  region: region, // TODO: make this configurable
});
