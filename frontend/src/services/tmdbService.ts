import axios from "axios";
import type { Movie, MovieListResponse } from "../types/movie";

/**
 * TMDB v4 Bearer 토큰 방식 전용 Axios 인스턴스
 * - 프런트에서 사용 시 .env(.env.local)에 VITE_TMDB_V4_TOKEN 필요
 *   VITE_TMDB_V4_TOKEN=<TMDB v4 Read Access Token>
 * - dev 서버를 반드시 재시작하세요.
 */
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
  params: {
    language: "ko-KR",
    region: "KR",
  },
});

/** 인기 영화 */
async function getPopularMovies(
  page = 1,
  config?: { language?: string; region?: string; includeAdult?: boolean }
): Promise<MovieListResponse> {
  const params: any = { page };

  if (config?.language) params.language = config.language;
  if (config?.region) params.region = config.region;
  if (config?.includeAdult !== undefined)
    params.include_adult = config.includeAdult;

  const { data } = await tmdb.get("/movie/popular", { params });
  return data;
}

/** 최신/현재 상영중 */
async function getLatestMovies(
  page = 1,
  config?: { language?: string; region?: string; includeAdult?: boolean }
): Promise<MovieListResponse> {
  const params: any = { page };

  if (config?.language) params.language = config.language;
  if (config?.region) params.region = config.region;
  if (config?.includeAdult !== undefined)
    params.include_adult = config.includeAdult;

  const { data } = await tmdb.get("/movie/now_playing", { params });
  return data;
}

/** 영화 상세 */
async function getMovieDetails(
  movieId: number,
  config?: { language?: string; region?: string; includeAdult?: boolean }
): Promise<Movie> {
  const params: any = {};

  if (config?.language) params.language = config.language;
  if (config?.region) params.region = config.region;
  if (config?.includeAdult !== undefined)
    params.include_adult = config.includeAdult;

  const { data } = await tmdb.get(`/movie/${movieId}`, { params });
  return data;
}

/** 영화 검색 */
async function searchMovies(
  query: string,
  page = 1,
  config?: { language?: string; region?: string; includeAdult?: boolean }
): Promise<MovieListResponse> {
  const params: any = { query, page };

  if (config?.language) params.language = config.language;
  if (config?.region) params.region = config.region;
  if (config?.includeAdult !== undefined)
    params.include_adult = config.includeAdult;
  else params.include_adult = false; // 기본값

  const { data } = await tmdb.get("/search/movie", { params });
  return data;
}

export const tmdbService = {
  getPopularMovies,
  getLatestMovies,
  getMovieDetails,
  searchMovies,
};

export default tmdbService;
