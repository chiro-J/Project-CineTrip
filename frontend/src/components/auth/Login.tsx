import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SocialLoginModal = ({ isOpen, onClose }: SocialLoginModalProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);

    // Admin 로그인 시뮬레이션
    setTimeout(() => {
      // Admin 사용자로 로그인
      const adminUser = {
        id: 'admin-001',
        username: 'Admin',
        email: 'admin@cinetrip.com',
        avatarUrl: 'https://picsum.photos/seed/admin/40/40',
        role: 'admin' as const
      };
      
      login(adminUser);
      setIsLoggingIn(false);
      onClose();
      navigate('/home');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 모달 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl">
            {/* 닫기 버튼 */}
            <Button
              onClick={onClose}
              className="absolute flex items-center justify-center w-8 h-8 text-2xl text-gray-400 top-4 right-4 hover:text-gray-600"
            >
              ×
            </Button>

            {/* 모달 내용 */}
            <div className="px-8 py-12 text-center">
              {/* 제목 */}
              <h2 className="mb-12 text-2xl font-medium text-gray-900">
                계속하려면 로그인
              </h2>

              {/* Google 로그인 버튼 */}
              <div className="mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoggingIn}
                  onClick={handleGoogleLogin}
                  leftIcon={
                    !isLoggingIn && (
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )
                  }
                  className="rounded-full !border-gray-300 !text-gray-600"
                >
                  {isLoggingIn ? "Google 로그인 중..." : "Continue with Google"}
                </Button>
              </div>

              {/* 약관 동의 텍스트 */}
              <p className="text-sm leading-relaxed text-gray-500">
                By proceeding, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Use
                </a>{" "}
                and confirm you have read our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy and Cookie Statement
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLoginModal;
