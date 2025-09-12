import { useState } from "react";
import { Button } from "../../components/ui/Button";

const SocialLoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleGoogleLogin = () => {
    // Google 로그인 로직 구현
    console.log("Google 로그인 시도");
    // 실제 구현시에는 Google OAuth API를 사용
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* 모달 열기 버튼 */}
      <Button variant="primary" size="lg" onClick={openModal}>
        로그인 모달 열기
      </Button>

      {/* 모달 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute text-2xl text-gray-400 top-4 right-4 hover:text-gray-600"
            >
              ×
            </button>

            {/* 모달 내용 */}
            <div className="px-8 py-12 text-center">
              {/* 제목 */}
              <h2 className="mb-12 text-2xl font-medium text-gray-900">
                계속하려면 로그인
              </h2>

              {/* Google 로그인 버튼 */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full gap-3 px-6 py-4 mb-8 transition-colors bg-white border border-gray-300 rounded-full hover:border-gray-400"
              >
                {/* Google 로고 */}
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
                <span className="font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>

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
    </div>
  );
};

export default SocialLoginModal;
