import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

interface UploadRequest {
  fileName: string;
  mimeType: string;
}


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(@Body() body: UploadRequest) {
    const { fileName, mimeType } = body;

    if (!fileName || !mimeType) {
      throw new BadRequestException('fileName과 mimeType이 필요합니다.');
    }

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
    }

    try {
      const result = await this.uploadService.getPresignedUrl(fileName, mimeType);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 필요합니다.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
    }

    try {
      const imageUrl = await this.uploadService.uploadImageToS3(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      return {
        success: true,
        data: {
          imageUrl
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
