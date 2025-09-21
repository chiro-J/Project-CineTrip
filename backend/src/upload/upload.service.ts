import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    // AWS 설정이 있는 경우에만 S3 클라이언트 초기화
    if (awsAccessKeyId && awsSecretAccessKey && bucketName) {
      this.s3Client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });
      this.bucketName = bucketName;
    } else {
      console.warn('AWS S3 설정이 없습니다. 개발 모드에서는 모의 업로드를 사용합니다.');
    }
  }

  async uploadImageToS3(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    // AWS S3 설정이 없는 경우 모의 업로드
    if (!this.s3Client || !this.bucketName) {
      const mockUrl = `https://mock-bucket.s3.ap-northeast-2.amazonaws.com/uploads/${Date.now()}-${fileName}`;
      console.log(`모의 S3 업로드: ${mockUrl}`);
      return mockUrl;
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
      // ACL 제거 - 버킷 정책으로 public access 설정
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'ap-northeast-2'}.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`S3 업로드 실패: ${error.message}`);
    }
  }

  async getPresignedUrl(fileName: string, mimeType: string): Promise<{ uploadUrl: string; imageUrl: string }> {
    // AWS S3 설정이 없는 경우 모의 URL 반환
    if (!this.s3Client || !this.bucketName) {
      const key = `uploads/${Date.now()}-${fileName}`;
      const mockUrl = `https://mock-bucket.s3.ap-northeast-2.amazonaws.com/${key}`;
      console.log(`모의 Presigned URL 생성: ${mockUrl}`);
      return {
        uploadUrl: mockUrl,
        imageUrl: mockUrl
      };
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
      // ACL 제거 - 버킷 정책으로 public access 설정
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      const imageUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'ap-northeast-2'}.amazonaws.com/${key}`;

      return { uploadUrl, imageUrl };
    } catch (error) {
      throw new Error(`Presigned URL 생성 실패: ${error.message}`);
    }
  }
}
