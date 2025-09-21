import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface UploadResponse {
  success: boolean;
  data: {
    imageUrl: string;
  };
}

export const uploadService = {
  async uploadBase64Image(imageData: string, fileName: string, mimeType: string): Promise<string> {
    try {
      const response = await axios.post<UploadResponse>(`${API_BASE_URL}/upload/base64`, {
        imageData,
        fileName,
        mimeType
      });

      if (response.data.success) {
        return response.data.data.imageUrl;
      } else {
        throw new Error('업로드 실패');
      }
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      throw new Error(error.response?.data?.message || '이미지 업로드에 실패했습니다.');
    }
  },

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(`${API_BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.data.imageUrl;
      } else {
        throw new Error('업로드 실패');
      }
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      throw new Error(error.response?.data?.message || '이미지 업로드에 실패했습니다.');
    }
  }
};