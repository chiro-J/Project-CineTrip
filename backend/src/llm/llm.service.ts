import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  sceneItemsSchema,
  sceneItemSchema,
} from '../locations/modules/scene.schemas';
import { checklistItemsSchema } from './modules/checklist.schemas';

type GenerateInput = { tmdbId: number };
type ChecklistInput = {
  tmdbId: number;
  movieTitle?: string;
  sceneLocations: any[];
  travelSchedule: {
    startDate: string;
    endDate: string;
    destinations: string[];
  };
};

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

      // 스키마 검증 수행
      const validatedResponse = sceneItemsSchema.parse(response);
      const rawItems = validatedResponse.items.slice(0, 5); // 최대 5개로 제한

      // 검증된 데이터를 처리하여 반환
      const processedItems = rawItems.map((item, index) => {
        return {
          id: item.id || index + 1,
          name: item.name,
          scene: item.scene,
          timestamp: item.timestamp || undefined,
          address: item.address,
          country: item.country,
          city: item.city,
          lat: item.lat,
          lng: item.lng,
        };
      });

      return { items: processedItems };
    } catch (error) {
      console.error('LLM API 호출 또는 데이터 검증 실패:', error);

      // 스키마 검증 실패인 경우 구체적인 에러 메시지 제공
      if (error.name === 'ZodError') {
        console.error('스키마 검증 실패:', error.issues);
        throw new InternalServerErrorException(
          'LLM 응답 데이터 형식이 올바르지 않습니다.',
        );
      }

      throw new InternalServerErrorException(
        `LLM 서비스 호출에 실패했습니다: ${error.message}`,
      );
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
      "scene": "장면 설명 (반드시 한국어로 작성)",
      "timestamp": "00:15:30 (영화에서 해당 장면이 나오는 시간)",
      "address": "상세 주소",
      "country": "${country}",
      "city": "도시명",
      "lat": 37.5665,
      "lng": 126.9780
    }
  ]
}

최대 5개의 촬영지를 포함하고, 좌표는 WGS84 형식으로 제공하세요. 타임스탬프는 "00:00:00" 형식으로 영화에서 해당 장면이 나오는 시간을 제공하세요. 

**중요: scene 필드는 반드시 한국어로 작성해주세요.**`;
  }

  async generateChecklist(input: ChecklistInput) {
    const movieInfo = await this.fetchMovieInfo(input.tmdbId);
    const prompt = this.buildChecklistPrompt(input, movieInfo);

    try {
      const response = await this.callLlmApi(prompt);

      // 체크리스트 스키마 검증 수행
      const validatedResponse = checklistItemsSchema.parse(response);
      const rawItems = validatedResponse.items;

      // 검증된 데이터를 처리하여 반환
      const processedItems = rawItems.map((item, index) => {
        return {
          id: item.id || index + 1,
          title: item.title,
          description: item.description,
          category: item.category,
          completed: item.completed || false,
        };
      });

      return { items: processedItems };
    } catch (error) {
      console.error('체크리스트 생성 또는 데이터 검증 실패:', error);

      // 스키마 검증 실패인 경우 구체적인 에러 메시지 제공
      if (error.name === 'ZodError') {
        console.error('체크리스트 스키마 검증 실패:', error.issues);
        throw new InternalServerErrorException(
          '체크리스트 응답 데이터 형식이 올바르지 않습니다.',
        );
      }

      throw new InternalServerErrorException(
        `체크리스트 생성에 실패했습니다: ${error.message}`,
      );
    }
  }

  private buildChecklistPrompt(input: ChecklistInput, movieInfo: any): string {
    const movieTitle = input.movieTitle || movieInfo?.title || '영화';
    const country = movieInfo?.production_countries?.[0]?.name || '한국';

    // 촬영지 정보 정리
    const locationsInfo = input.sceneLocations
      .map(
        (location, index) =>
          `${index + 1}. ${location.name} (${location.city}, ${location.country})
     - 장면: ${location.scene}
     - 주소: ${location.address}
     - 좌표: ${location.lat}, ${location.lng}`,
      )
      .join('\n');

    // 여행 일정 정보
    const startDate = new Date(input.travelSchedule.startDate);
    const endDate = new Date(input.travelSchedule.endDate);
    const travelDuration =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;
    const month = startDate.getMonth() + 1;

    // 사용자가 선택한 촬영지의 위도와 국가를 사용하여 계절 계산
    const selectedLocation = this.findSelectedLocation(
      input.travelSchedule.destinations,
      input.sceneLocations,
    );
    const selectedLocationLat = selectedLocation?.lat;
    const selectedLocationCountry = selectedLocation?.country;
    const season = this.getSeason(
      month,
      selectedLocationLat,
      selectedLocationCountry,
    );

    return `다음 영화의 촬영지를 여행할 때 필요한 체크리스트를 만들어주세요:

=== 영화 정보 ===
영화 제목: ${movieTitle}
제작 국가: ${country}
개봉년도: ${movieInfo?.release_date?.split('-')[0] || '알 수 없음'}
장르: ${movieInfo?.genres?.map((g: any) => g.name).join(', ') || '알 수 없음'}

=== 촬영지 정보 ===
${locationsInfo}

=== 여행 일정 ===
여행 기간: ${input.travelSchedule.startDate} ~ ${input.travelSchedule.endDate} (${travelDuration}일)
여행지: ${input.travelSchedule.destinations.join(', ')}
여행 시기: ${month}월 (${season})
${selectedLocation ? `선택된 촬영지: ${selectedLocation.name} (${selectedLocation.city}, ${selectedLocation.country}) - 위도: ${selectedLocation.lat}` : ''}

위 정보를 바탕으로 다음 카테고리별로 실용적인 체크리스트를 만들어주세요:

1. 현지 문화·안전 (팁 문화, 신분증, 규정 등)
2. 감성 스냅 체크리스트 (영화 분위기 재현을 위한 촬영 팁)
3. 날씨별 준비물 (${season} 날씨에 맞는 의류, 소품)
4. 촬영지별 특별 준비사항 (각 촬영지의 특성에 맞는 준비물)
5. 이동·교통 (지역별 교통수단, 이동 팁)

다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{
  "items": [
    {
      "id": 1,
      "title": "체크리스트 항목 제목",
      "description": "상세 설명",
      "category": "카테고리명",
      "completed": false
    }
  ]
}

최대 15개의 체크리스트 항목을 포함하고, 실제 여행에 도움이 되는 구체적이고 실용적인 내용을 제공하세요.`;
  }

  private findSelectedLocation(
    destinations: string[],
    sceneLocations: any[],
  ): any {
    // 사용자가 선택한 목적지와 매칭되는 촬영지 찾기
    for (const destination of destinations) {
      const matchedLocation = sceneLocations.find((location) => {
        // 정확한 이름 매칭
        if (location.name === destination) return true;

        // 부분 매칭 (도시명이나 지역명 포함)
        if (
          location.name.includes(destination) ||
          destination.includes(location.name)
        )
          return true;
        if (
          location.city === destination ||
          destination.includes(location.city)
        )
          return true;

        return false;
      });

      if (matchedLocation) {
        return matchedLocation;
      }
    }

    // 매칭되는 촬영지가 없으면 첫 번째 촬영지 반환
    return sceneLocations[0];
  }

  private getSeason(
    month: number,
    latitude?: number,
    country?: string,
  ): string {
    // 위도 정보가 없으면 북반구 기준으로 가정
    const isNorthernHemisphere = latitude === undefined || latitude >= 0;

    // 적도 근처 국가들은 계절 구분이 명확하지 않음
    const isEquatorialRegion =
      latitude !== undefined && Math.abs(latitude) < 10;

    if (isEquatorialRegion) {
      // 적도 근처: 건기/우기 구분
      if (month >= 6 && month <= 10) return '우기';
      return '건기';
    }

    if (isNorthernHemisphere) {
      // 북반구
      if (month >= 3 && month <= 5) return '봄';
      if (month >= 6 && month <= 8) return '여름';
      if (month >= 9 && month <= 11) return '가을';
      return '겨울';
    } else {
      // 남반구 (계절이 반대)
      if (month >= 3 && month <= 5) return '가을';
      if (month >= 6 && month <= 8) return '겨울';
      if (month >= 9 && month <= 11) return '봄';
      return '여름';
    }
  }
}
