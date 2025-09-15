import type { Item } from "../types/common";

// --- Mock Data ---
const uploadedPhotos = [
  {
    id: 1,
    src: "https://placehold.co/400x400/f0f0f0/333?text=Nature",
    alt: "Sunset at Grand Canyon",
    likes: 100,
  },
  {
    id: 2,
    src: "https://placehold.co/400x400/e0e0e0/333?text=Food",
    alt: "Tacos in Mexico",
    likes: 200,
  },
  {
    id: 3,
    src: "https://placehold.co/400x400/d0d0d0/333?text=Architecture",
    alt: "Cathedral in Barcelona",
    likes: 150,
  },
];

const watchedMovies = [
  { id: 1, src: "https://placehold.co/400x600/f8d7da/333?text=Movie+1" },
  { id: 2, src: "https://placehold.co/400x600/d1ecf1/333?text=Movie+2" },
  { id: 3, src: "https://placehold.co/400x600/d4edda/333?text=Movie+3" },
  { id: 4, src: "https://placehold.co/400x600/fff3cd/333?text=Movie+4" },
];

// 더미데이터
const mockPhotos: Item[] = Array.from({ length: 15 }, (_, index) => ({
  id: `photo-${index + 1}`,
  src: `https://picsum.photos/seed/p${index + 1}/400/400`,
  alt: `Sample photo ${index + 1}`,
  likes: Math.floor(Math.random() * 200) + 1,
}));

// 더미데이터
const mockMovies: Item[] = Array.from({ length: 8 }, (_, index) => ({
  id: `movie-${index + 1}`,
  src: `https://picsum.photos/seed/m${index + 1}/400/600`, // 영화 포스터 비율
  alt: `Sample movie poster ${index + 1}`,
}));

// 더미데이터
const mockBookmarks: Item[] = [];
