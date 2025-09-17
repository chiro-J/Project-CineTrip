export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  rating?: number;
  releaseYear?: string;
}

export const getImageUrl = (
  path: string | null,
  size: "w200" | "w300" | "w400" | "w500" | "original" = "w300"
): string => {
  if (!path)
    return "https://placehold.co/300x450/2B4162/FFFFFF/png?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const convertMovieToImage = (movie: Movie): MovieImage => ({
  id: movie.id.toString(),
  src: getImageUrl(movie.poster_path),
  alt: movie.title,
  title: movie.title,
  rating: Math.round(movie.vote_average * 10) / 10,
  releaseYear: movie.release_date
    ? new Date(movie.release_date).getFullYear().toString()
    : undefined,
});
