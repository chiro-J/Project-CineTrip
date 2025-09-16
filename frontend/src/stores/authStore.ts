import { create } from 'zustand';
import Cookies from 'js-cookie';


interface User {
  email: string;
  username: string;
  avatarUrl: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  user: User | null;
  token: string | null;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

type AuthStore = AuthState & AuthActions;

// user_data 쿠키에서 초기 사용자 정보를 읽어옵니다.
const initialUserData = Cookies.get('user_data');
const initialUser: User | null = initialUserData ? JSON.parse(initialUserData) : null;
const initialToken: string | null = Cookies.get('access_token') || null;

export const useAuthStore = create<AuthStore>((set) => ({
  // user_data가 존재하면 로그인 상태로 간주합니다.
  isLoggedIn: !!initialUser,
  isLoginModalOpen: false,
  user: initialUser,
  token: initialToken,

  login: (token, user) => {
    set({ isLoggedIn: true, isLoginModalOpen: false, user, token });
    // 백엔드에서 user_data 쿠키를 보내므로, 프런트엔드에서 쿠키를 추가할 필요가 없습니다.
  },
  logout: () => {
    set({ isLoggedIn: false, user: null, token: null });
    Cookies.remove('user_data');
    Cookies.remove('access_token');
  },
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));