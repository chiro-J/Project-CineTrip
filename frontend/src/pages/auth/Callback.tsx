import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const SocialLoginModal = () => {
  // Zustand 스토어에서 모달 상태와 닫기 액션을 가져옵니다.
  const isLoginModalOpen = useAuthStore(s => s.isLoginModalOpen);
  const closeLoginModal  = useAuthStore(s => s.closeLoginModal);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const { user, access_token } = await res.json(); // API 응답에서 토큰과 사용자 정보를 구조분해 할당
          if (!cancelled) {
            login(access_token, user); // 토큰과 사용자 정보를 login 함수에 전달
        };
      }
    } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
    } finally {
      if (!cancelled) {
        useAuthStore.getState().closeLoginModal?.();
        navigate('/home', { replace: true });
      }
    }
  })();

  return () => { cancelled = true; };
}, [navigate, closeLoginModal, login]);

  const handleGoogleLogin = () => {
    // Google 로그인 로직 구현
    window.location.href = "http://localhost:3000/auth/google";
  };

  // 모달을 렌더링할 필요가 없을 때 아무것도 반환하지 않음
  if (!isLoginModalOpen) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      
      {/* 모달 오버레이 */}
      
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl">
            {/* 닫기 버튼 */}
            <button
              onClick={closeLoginModal}
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
      
    </div>
  );
};

export default SocialLoginModal;
