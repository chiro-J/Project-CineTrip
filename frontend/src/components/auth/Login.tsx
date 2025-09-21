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
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const { login, loginAsUser, loginAsAdmin, loginAsUser2, loginAsUser3 } = useAuth();
  const navigate = useNavigate();

  // 하드코딩된 테스트 계정들
  const testAccounts = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@cinetrip.com',
      avatarUrl: 'https://picsum.photos/seed/admin/200/200',
      role: 'admin' as const,
      displayName: '관리자'
    },
    {
      id: 2,
      username: 'photographer',
      email: 'photographer@example.com',
      avatarUrl: 'https://picsum.photos/seed/photographer/200/200',
      role: 'user' as const,
      displayName: '사진작가'
    },
    {
      id: 3,
      username: 'traveler',
      email: 'traveler@example.com',
      avatarUrl: 'https://picsum.photos/seed/traveler/200/200',
      role: 'user' as const,
      displayName: '여행자'
    }
  ];

  const handleAccountLogin = async (accountId: number) => {
    setIsLoggingIn(true);
    setSelectedAccount(accountId);

    // 로그인 시뮬레이션
    setTimeout(() => {
      // 각 계정 ID에 따라 해당하는 로그인 함수 호출
      switch (accountId) {
        case 1:
          loginAsAdmin();
          break;
        case 2:
          loginAsUser2();
          break;
        case 3:
          loginAsUser3();
          break;
        default:
          loginAsUser();
      }
      
      setIsLoggingIn(false);
      setSelectedAccount(null);
      onClose();
      navigate('/home');
    }, 1000);
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
            <div className="px-8 py-12">
              {/* 제목 */}
              <h2 className="mb-8 text-2xl font-medium text-center text-gray-900">
                테스트 계정으로 로그인
              </h2>

              {/* 계정 선택 */}
              <div className="space-y-3 mb-8">
                {testAccounts.map((account) => (
                  <Button
                    key={account.id}
                    variant="outline"
                    size="lg"
                    fullWidth
                    loading={isLoggingIn && selectedAccount === account.id}
                    onClick={() => handleAccountLogin(account.id)}
                    className="flex items-center justify-start p-4 h-auto text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={account.avatarUrl}
                        alt={account.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {account.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.email}
                        </div>
                        <div className="text-xs text-blue-600">
                          {account.role === 'admin' ? '관리자' : '일반 사용자'}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
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
