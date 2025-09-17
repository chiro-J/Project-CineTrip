// src/lib/api.ts
import {
    sceneLocationsByTmdbResponseSchema,
    type SceneLocationsByTmdbResponse
  } from '../types/content';
  
  export async function fetchSceneLocationsByTmdb(
    tmdbId: number,
    opts?: { regen?: boolean; movieInfo?: { title?: string; originalTitle?: string; country?: string; language?: string } }
  ): Promise<SceneLocationsByTmdbResponse> {
    const params = new URLSearchParams();
    if (opts?.regen) params.set('regen', String(opts.regen));
    if (opts?.movieInfo?.title) params.set('title', opts.movieInfo.title);
    if (opts?.movieInfo?.originalTitle) params.set('originalTitle', opts.movieInfo.originalTitle);
    if (opts?.movieInfo?.country) params.set('country', opts.movieInfo.country);
    if (opts?.movieInfo?.language) params.set('language', opts.movieInfo.language);
    
    const url = `/api/llm/scenes/${tmdbId}?${params}`;
    console.log('API 호출:', url);
    
    // 백엔드 LLM 컨트롤러 엔드포인트에 맞게 수정
    const res = await fetch(url);
    console.log('API 응답 상태:', res.status);
    
    const json = await res.json().catch(() => ({}));
    console.log('API 응답 데이터:', json);
    
    if (!res.ok) {
      throw new Error(json?.message ?? 'API Error');
    }
    
    // 백엔드 응답 형식에 맞게 래핑
    const response = {
      tmdbId: tmdbId,
      items: json.items || []
    };
    
    return sceneLocationsByTmdbResponseSchema.parse(response);
  }
  