import React, { createContext, useContext, useState, ReactNode } from 'react';

// 사용자 프로필 정보 인터페이스
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin 사용자 데이터 (개발용)
const ADMIN_USER: UserProfile = {
  id: 'admin-001',
  username: 'Admin',
  email: 'admin@cinetrip.com',
  avatarUrl: 'https://picsum.photos/seed/admin/40/40',
  role: 'admin'
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // localStorage에서 로그인 상태 복원
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;