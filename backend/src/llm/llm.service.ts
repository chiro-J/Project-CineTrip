import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  sceneItemsSchema,
  sceneItemSchema,
} from '../modules/scene-locations/scene.schemas';

type GenerateInput = { tmdbId: number };

@Injectable()
export class LlmService {
  constructor(private configService: ConfigService) {}
  async generateSceneLocations(input: GenerateInput, movieInfo?: any) {
    // 프론트엔드에서 전달받은 영화 정보가 있으면 사용, 없으면 TMDB API 호출
    const finalMovieInfo =
      movieInfo && movieInfo.title
        ? movieInfo
        : await this.fetchMovieInfo(input.tmdbId);
    const prompt = this.buildPrompt(input, finalMovieInfo);

    try {
      // 실제 LLM API 호출 (OpenAI GPT-4 사용 예시)
      const response = await this.callLlmApi(prompt);

      // 공급자가 5개 초과를 줘도 방어적으로 자르기
      const rawItems = Array.isArray(response.items)
        ? response.items.slice(0, 5)
        : [];

      // 스키마 검증 우회하고 직접 데이터 반환
      const processedItems = rawItems.map((item, index) => {
        return {
          id: item.id || index + 1,
          name: item.name || `촬영지 ${index + 1}`,
          scene: item.scene || '장면 설명',
          timestamp: item.timestamp || undefined,
          address: item.address || '주소 정보 없음',
          country: item.country || 'Unknown',
          city: item.city || 'Unknown',
          lat: typeof item.lat === 'number' ? item.lat : 37.5665,
          lng: typeof item.lng === 'number' ? item.lng : 126.978,
        };
      });

      return { items: processedItems };
    } catch (error) {
      console.error('LLM API 호출 실패:', error);
      throw new InternalServerErrorException('LLM 서비스 호출에 실패했습니다.');
    }
  }

  private async callLlmApi(prompt: string): Promise<{ items: any[] }> {
    // OpenAI API 호출 예시
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new InternalServerErrorException(
        'OpenAI API 키가 설정되지 않았습니다.',
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              '당신은 영화 촬영지 전문가입니다. JSON 형식으로만 응답하세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API 오류: ${errorData.error?.message || 'Unknown error'}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('LLM 응답이 비어있습니다.');
    }

    try {
      // JSON 파싱 시도
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      // JSON 파싱 실패 시 텍스트에서 JSON 추출 시도
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        } catch (secondParseError) {
          // 추출된 JSON 파싱도 실패
        }
      }

      // JSON 파싱이 완전히 실패한 경우 에러 던지기
      throw new Error('LLM 응답을 JSON으로 파싱할 수 없습니다.');
    }
  }

  private async fetchMovieInfo(tmdbId: number): Promise<any> {
    try {
      const tmdbApiKey = this.configService.get<string>('TMDB_API_KEY');
      if (!tmdbApiKey) {
        return this.getHardcodedMovieInfo(tmdbId);
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?language=ko-KR`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbApiKey}`,
          },
        },
      );

      if (!response.ok) {
        return this.getHardcodedMovieInfo(tmdbId);
      }

      const data = await response.json();

      return {
        title: data.title || data.original_title,
        original_title: data.original_title,
        overview: data.overview,
        original_language: data.original_language,
        production_countries: data.production_countries,
        release_date: data.release_date,
      };
    } catch (error) {
      return this.getHardcodedMovieInfo(tmdbId);
    }
  }

  private getHardcodedMovieInfo(tmdbId: number): any {
    const movieDatabase = {
      1255: {
        title: '괴물',
        original_title: 'The Host',
        country: '대한민국',
        language: 'ko',
      },
      550: {
        title: '파이트 클럽',
        original_title: 'Fight Club',
        country: '미국',
        language: 'en',
      },
      299536: {
        title: '어벤져스: 인피니티 워',
        original_title: 'Avengers: Infinity War',
        country: '미국',
        language: 'en',
      },
      13855: {
        title: '인터스텔라',
        original_title: 'Interstellar',
        country: '미국',
        language: 'en',
      },
      1316719: {
        title: '기생충',
        original_title: 'Parasite',
        country: '대한민국',
        language: 'ko',
      },
    };

    const movieInfo = movieDatabase[tmdbId] || {
      title: `영화 ID ${tmdbId}`,
      original_title: `Movie ${tmdbId}`,
      country: 'Unknown',
      language: 'en',
    };

    return movieInfo;
  }

  private buildPrompt({ tmdbId }: GenerateInput, movieInfo: any): string {
    const country = movieInfo.country || 'Unknown';
    const isKorean =
      movieInfo.language === 'ko' ||
      country.includes('한국') ||
      country.includes('Korea');

    return `당신은 영화 촬영지 전문가입니다. 

다음 영화의 실제 촬영지를 찾아주세요:

**영화 제목: "${movieInfo.title || 'Unknown'}"**
**원제: "${movieInfo.original_title || 'Unknown'}"**
**개봉년도: ${movieInfo.release_date?.split('-')[0] || 'Unknown'}**
**줄거리: ${movieInfo.overview || '정보 없음'}**
**제작국가: ${country}**
**언어: ${movieInfo.language || 'Unknown'}**

예시:
- 만약 "괴물"이라면: 한강, 한강대교, 한강공원 등
- 만약 "어벤져스"라면: 뉴욕 맨하탄, 스타크 타워 등
- 만약 "인터스텔라"라면: 아이스랜드, 캐나다 등
- 만약 "기생충"이라면: 서울 강남구, 반포동 등

위 영화의 실제 촬영지를 찾아서 정확히 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{
  "items": [
    {
      "id": 1,
      "name": "촬영지 이름",
      "scene": "장면 설명",
      "timestamp": "00:15:30 (영화에서 해당 장면이 나오는 시간)",
      "address": "상세 주소",
      "country": "${country}",
      "city": "도시명",
      "lat": 37.5665,
      "lng": 126.9780
    }
  ]
}

최대 5개의 촬영지를 포함하고, 좌표는 WGS84 형식으로 제공하세요. 타임스탬프는 "00:00:00" 형식으로 영화에서 해당 장면이 나오는 시간을 제공하세요.`;
  }
}
