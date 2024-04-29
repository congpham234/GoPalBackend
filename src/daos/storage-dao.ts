import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { singleton } from 'tsyringe';
import { ThirdPartyApps } from '../third-party-apps';

@singleton()
export class StorageDao {
  private generatedImageBucketName: string;
  private clientImageBucketName: string;

  constructor() {
    this.generatedImageBucketName = ThirdPartyApps.getInstance().generatedImageBucketName;
    this.clientImageBucketName = ThirdPartyApps.getInstance().clientImageBucketName;
  }

  public async uploadImageAndGetUrlFromGeneratedImageBucket(fileKey: string, fileContent: Buffer): Promise<string> {
    await this.uploadFile(this.generatedImageBucketName, fileKey, fileContent);
    return this.getPresignedUrl(this.generatedImageBucketName, fileKey);
  }

  public async getClientImageUrlFromS3(fileKey: string) {
    return this.getPresignedUrl(this.clientImageBucketName, fileKey);
  }

  private async uploadFile(bucketName: string, fileKey: string, fileContent: Buffer): Promise<void> {
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileContent,
      });

      await ThirdPartyApps.getInstance().s3Client.send(uploadCommand);
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
      const url = await getSignedUrl(ThirdPartyApps.getInstance().s3Client, command, { expiresIn: expiration });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }
}
