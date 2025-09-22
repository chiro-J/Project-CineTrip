import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface UploadResponse {
  success: boolean;
  data: {
    imageUrl: string;
  };
}

export const uploadService = {
  async uploadImage(file: File): Promise<{imageUrl: string}> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(`${API_BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return {
          imageUrl: response.data.data.imageUrl
        };
      } else {
        throw new Error('업로드 실패');
      }
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      throw new Error((error as any).response?.data?.message || '이미지 업로드에 실패했습니다.');
    }
  }
};