import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  user: { id: string; username: string } | null; // 사용자 정보
}

interface AuthActions {
  login: (user: { id: string; username: string }) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  isLoginModalOpen: false,
  user: null,

  login: (user) => set({ isLoggedIn: true, isLoginModalOpen: false, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));