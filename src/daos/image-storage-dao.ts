import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { inject, singleton } from 'tsyringe';
import { s3Client } from '../middlewares/s3-connection';
import TOKENS from '../middlewares/di-tokens';

@singleton()
export class ImageStorageDao {
  private generatedImageBucketName: string;
  private clientImageBucketName: string;

  constructor(
    @inject(TOKENS.generatedImageBucketName) generatedImageBucketName: string,
    @inject(TOKENS.clientImageBucketName) clientImageBucketName: string,
  ) {
    this.generatedImageBucketName = generatedImageBucketName;
    this.clientImageBucketName = clientImageBucketName;
    console.log(this.clientImageBucketName);
  }

  public async uploadImageAndGetUrlFromGeneratedImageBucket(fileKey: string, fileContent: Buffer): Promise<string> {
    await this.uploadImage(this.generatedImageBucketName, fileKey, fileContent);
    return this.getPresignedUrl(this.generatedImageBucketName, fileKey);
  }

  public async getClientImageUrlFromS3(fileKey: string) {
    return this.getPresignedUrl(this.clientImageBucketName, fileKey);
  }

  private async uploadImage(bucketName: string, fileKey: string, fileContent: Buffer): Promise<void> {
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileContent,
      });

      const response = await s3Client.send(uploadCommand);
      console.log(response);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  private async getPresignedUrl(bucketName: string, fileKey: string, expiration = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    try {
      // The getSignedUrl function creates a presigned URL that you can use to perform
      // the HTTP GET operation on the S3 object. The URL is valid for the specified duration.
      const url = await getSignedUrl(s3Client, command, { expiresIn: expiration });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }
}
