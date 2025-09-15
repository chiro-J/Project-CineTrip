import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import tmdbApi from "../utils/api";
import { getImageUrl } from "../types/movie";

// 사용자 업로드 사진 인터페이스
export interface UserPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  likes: number;
  uploadDate: string;
  movieId?: number; // 관련 영화 ID
}

// 사용자 감상한 영화 인터페이스
export interface WatchedMovie {
  movieId: number;
  watchedAt: string;
  rating?: number; // 사용자가 준 평점 (1-5)
  review?: string; // 사용자 리뷰
}

// 사용자 프로필 정보 인터페이스
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: "user" | "admin";
  photos: UserPhoto[];
  watchedMovies: WatchedMovie[];
  bookmarkedMovies: number[]; // 북마크한 영화 ID 배열
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (user: UserProfile) => void;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  isAdmin: boolean;
  addPhoto: (photo: UserPhoto) => void;
  addWatchedMovie: (movieId: number, rating?: number, review?: string) => void;
  toggleBookmark: (movieId: number) => void;
  isBookmarked: (movieId: number) => boolean;
  // 페이지에서 사용할 준비된 데이터
  userPhotosForGallery: any[];
  userMoviesForGallery: any[];
  userBookmarksForGallery: any[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// TMDB에서 영화 정보를 가져오는 함수
const fetchMovieData = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie ${movieId}:`, error);
    return null;
  }
};

// 일반 사용자 예시 데이터 생성 함수
const createExampleUserData = (): UserProfile => {
  return {
    id: "1",
    username: "cinephile_user",
    email: "user@example.com",
    avatarUrl: "https://placehold.co/100x100/4F46E5/FFFFFF/png?text=U",
    role: "user",
    photos: [
      {
        id: "photo-1",
        src: "https://placehold.co/400x400/2B4162/FFFFFF/png?text=Photo+1",
        alt: "영화 촬영지 사진 1",
        title: "인셉션 촬영지",
        location: "도쿄, 일본",
        likes: 156,
        uploadDate: "2024-01-15",
        movieId: 27205,
      },
      {
        id: "photo-2",
        src: "https://placehold.co/400x400/2B4162/FFFFFF/png?text=Photo+2",
        alt: "영화 촬영지 사진 2",
        title: "어벤져스 촬영지",
        location: "뉴욕, 미국",
        likes: 234,
        uploadDate: "2024-01-20",
        movieId: 24428,
      },
      {
        id: "photo-3",
        src: "https://placehold.co/400x400/2B4162/FFFFFF/png?text=Photo+3",
        alt: "영화 촬영지 사진 3",
        title: "해리포터 촬영지",
        location: "런던, 영국",
        likes: 189,
        uploadDate: "2024-01-25",
        movieId: 671,
      },
    ],
    watchedMovies: [
      {
        movieId: 27205, // 인셉션
        watchedAt: "2024-01-10",
        rating: 5,
        review: "정말 놀라운 영화였습니다!",
      },
      {
        movieId: 24428, // 어벤져스
        watchedAt: "2024-01-18",
        rating: 4,
        review: "액션이 정말 멋졌어요.",
      },
      {
        movieId: 671, // 해리포터
        watchedAt: "2024-01-22",
        rating: 5,
        review: "마법의 세계가 정말 아름다웠습니다.",
      },
      {
        movieId: 155, // 다크 나이트
        watchedAt: "2024-01-28",
        rating: 5,
        review: "히스 레저의 연기가 압권이었습니다.",
      },
    ],
    bookmarkedMovies: [27205, 155, 13, 680], // 인셉션, 다크나이트, 포레스트 검프, 터미네이터
  };
};

// Admin 사용자 예시 데이터 생성 함수
const createExampleAdminData = (): UserProfile => {
  return {
    id: "admin-001",
    username: "Admin",
    email: "admin@cinetrip.com",
    avatarUrl: "https://picsum.photos/seed/admin/40/40",
    role: "admin",
    photos: [
      {
        id: "admin-photo-1",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        alt: "아름다운 촬영지 사진 1",
        title: "뉴질랜드 촬영지",
        location: "뉴질랜드, 웰링턴",
        likes: 1250,
        uploadDate: "2024-01-10",
        movieId: 19995,
      },
      {
        id: "admin-photo-2",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80",
        alt: "아름다운 촬영지 사진 2",
        title: "호비튼 마을",
        location: "뉴질랜드, 호비튼",
        likes: 2100,
        uploadDate: "2024-01-12",
        movieId: 120,
      },
      {
        id: "admin-photo-3",
        src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=400&fit=crop",
        alt: "아름다운 촬영지 사진 3",
        title: "사막 풍경",
        location: "튀니지, 타투인",
        likes: 1800,
        uploadDate: "2024-01-15",
        movieId: 11,
      },
      {
        id: "admin-photo-4",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&brightness=1.1",
        alt: "아름다운 촬영지 사진 4",
        title: "바다 전망",
        location: "멕시코, 로스알카트라세스",
        likes: 1650,
        uploadDate: "2024-01-18",
        movieId: 597,
      },
      {
        id: "admin-photo-5",
        src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
        alt: "아름다운 촬영지 사진 5",
        title: "도시 전경",
        location: "호주, 시드니",
        likes: 1950,
        uploadDate: "2024-01-20",
        movieId: 603,
      },
    ],
    watchedMovies: [
      {
        movieId: 19995, // 아바타
        watchedAt: "2024-01-05",
        rating: 5,
        review: "혁신적인 3D 기술이 놀라웠습니다!",
      },
      {
        movieId: 120, // 반지의 제왕
        watchedAt: "2024-01-08",
        rating: 5,
        review: "판타지 영화의 걸작입니다.",
      },
      {
        movieId: 11, // 스타워즈
        watchedAt: "2024-01-12",
        rating: 5,
        review: "SF 영화의 원조라고 할 수 있습니다.",
      },
      {
        movieId: 597, // 타이타닉
        watchedAt: "2024-01-15",
        rating: 5,
        review: "사랑과 비극이 아름답게 어우러진 작품.",
      },
      {
        movieId: 603, // 매트릭스
        watchedAt: "2024-01-18",
        rating: 5,
        review: "현실과 가상현실의 경계를 흐린 걸작.",
      },
      {
        movieId: 13, // 포레스트 검프
        watchedAt: "2024-01-22",
        rating: 5,
        review: "인생의 의미를 되새기게 하는 영화.",
      },
      {
        movieId: 680, // 터미네이터
        watchedAt: "2024-01-25",
        rating: 4,
        review: "액션과 SF의 완벽한 조화.",
      },
    ],
    bookmarkedMovies: [19995, 120, 11, 597, 603, 13, 680, 27205, 155], // 더 많은 북마크
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // localStorage에서 사용자 데이터를 먼저 불러옵니다.
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // 데이터가 있으면 JSON.parse하여 반환
      return JSON.parse(storedUser);
    }
    // 데이터가 없으면 초기 사용자(예: 관리자) 데이터를 설정하고 반환
    const adminData = createExampleAdminData();
    localStorage.setItem("user", JSON.stringify(adminData));
    return adminData;
  });

  // 영화 ID에 따른 포스터 경로 매핑
  const getMoviePosterPath = (movieId: number): string => {
    const posterPaths: { [key: number]: string } = {
      19995: "kyeqWdyUXW608qlYkRqosgbbJyK.jpg", // 아바타
      120: "6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", // 반지의 제왕
      11: "6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", // 스타워즈
      597: "9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", // 타이타닉
      603: "f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", // 매트릭스
      13: "saHP97rTPS5eLmrLQEcANmKrsFl.jpg", // 포레스트 검프
      680: "qvktm0BHcnmDpul4Hz01GIazWPr.jpg", // 터미네이터
      27205: "ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg", // 인셉션
      155: "qJ2tW6WMUDux911r6m7haRef0WH.jpg", // 다크 나이트
      24428: "RYMX2wcKCBAr24UyPD7xwmjaTn.jpg", // 어벤져스
      671: "wuMc08IPKEatf9rnMNXvIDxqP4W.jpg", // 해리포터
    };
    return posterPaths[movieId] || "no-poster.jpg";
  };

  // 갤러리용 데이터 준비
  const userPhotosForGallery = user?.photos?.map((photo) => ({
    id: photo.id,
    src: photo.src,
    alt: photo.alt,
    likes: photo.likes,
  })) || [];

  const userMoviesForGallery = user?.watchedMovies?.map((watched) => ({
    id: watched.movieId.toString(),
    src: `https://image.tmdb.org/t/p/w300/${getMoviePosterPath(watched.movieId)}`,
    alt: `Movie ${watched.movieId}`,
    movieId: watched.movieId,
  })) || [];

  const userBookmarksForGallery = user?.bookmarkedMovies?.map((movieId) => ({
    id: movieId.toString(),
    src: `https://image.tmdb.org/t/p/w300/${getMoviePosterPath(movieId)}`,
    alt: `Bookmarked Movie ${movieId}`,
    movieId: movieId,
  })) || [];

  const login = (userData: UserProfile) => {
    // 만약 전달받은 userData에 photos, watchedMovies, bookmarkedMovies가 없다면 예시 데이터 추가
    let enrichedUserData = userData;

    if (!userData.photos || !userData.watchedMovies || !userData.bookmarkedMovies) {
      if (userData.role === 'admin') {
        // Admin인 경우 예시 데이터 사용
        const adminExample = createExampleAdminData();
        enrichedUserData = {
          ...userData,
          photos: adminExample.photos,
          watchedMovies: adminExample.watchedMovies,
          bookmarkedMovies: adminExample.bookmarkedMovies
        };
      } else {
        // 일반 사용자인 경우 예시 데이터 사용
        const userExample = createExampleUserData();
        enrichedUserData = {
          ...userData,
          photos: userExample.photos,
          watchedMovies: userExample.watchedMovies,
          bookmarkedMovies: userExample.bookmarkedMovies
        };
      }
    }

    setUser(enrichedUserData);
    localStorage.setItem("user", JSON.stringify(enrichedUserData));
  };

  const loginAsUser = () => {
    const userData = createExampleUserData();
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loginAsAdmin = () => {
    const adminData = createExampleAdminData();
    setUser(adminData);
    localStorage.setItem("user", JSON.stringify(adminData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addPhoto = (photo: UserPhoto) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      photos: [...user.photos, photo],
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const addWatchedMovie = (
    movieId: number,
    rating?: number,
    review?: string
  ) => {
    if (!user) return;
    const watchedMovie: WatchedMovie = {
      movieId,
      watchedAt: new Date().toISOString().split("T")[0],
      rating,
      review,
    };
    const updatedUser = {
      ...user,
      watchedMovies: [...user.watchedMovies, watchedMovie],
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const toggleBookmark = (movieId: number) => {
    if (!user) return;
    const isCurrentlyBookmarked = user.bookmarkedMovies.includes(movieId);
    const updatedBookmarks = isCurrentlyBookmarked
      ? user.bookmarkedMovies.filter((id) => id !== movieId)
      : [...user.bookmarkedMovies, movieId];

    const updatedUser = {
      ...user,
      bookmarkedMovies: updatedBookmarks,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isBookmarked = (movieId: number): boolean => {
    return user?.bookmarkedMovies.includes(movieId) ?? false;
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    loginAsUser,
    loginAsAdmin,
    logout,
    isAdmin: user?.role === "admin",
    addPhoto,
    addWatchedMovie,
    toggleBookmark,
    isBookmarked,
    userPhotosForGallery,
    userMoviesForGallery,
    userBookmarksForGallery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
