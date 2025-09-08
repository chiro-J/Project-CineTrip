import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/Avatar"; // 가정된 Avatar 컴포넌트 경로
import UserDropdownMenu from "./UserDropdown"; // UserDropdownMenu 컴포넌트 임포트
import logo from "../../assets/logos/logo.png";

/**
 * 사용자 프로필 정보 인터페이스
 * @property username - 사용자 이름
 * @property email - 사용자 이메일 (드롭다운 메뉴에서 필요)
 * @property avatarUrl - 사용자 아바타 이미지 URL
 */
interface UserProfile {
  username: string;
  email: string; // 드롭다운 메뉴에서 사용하기 위해 email 추가
  avatarUrl: string;
}

interface HeaderProps {
  user?: UserProfile;
}

/**
 * 전역 네비게이션 바 (GNB) 컴포넌트 (UI 전용)
 * 사이트 로고, 검색 기능, 사용자 프로필 영역(드롭다운 포함)을 포함합니다.
 */
const Header = ({ user }: HeaderProps): React.ReactElement => {
  // 드롭다운 메뉴의 열림/닫힘 상태를 관리하는 state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * 로그아웃 버튼 클릭 시 실행될 함수 (UI 테스트용)
   */
  const handleLogout = (): void => {
    console.log("Logout action triggered");
    setIsDropdownOpen(false); // 로그아웃 시 드롭다운 닫기
  };

  // 드롭다운 메뉴 외부를 클릭했을 때 메뉴를 닫는 effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-3 bg-white shadow-md">
      {/* 1. 로고 영역 (이동 기능 제거) */}
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="CineTrip Logo"
          className="w-8 h-8 rounded-full" // 로고 스타일에 맞게 className을 수정하세요.
        />
        <span className="text-xl font-bold text-gray-800">CineTrip</span>
      </div>

      {/* 2. 검색창 영역 */}
      <div className="flex-1 px-16">
        <input
          type="search"
          placeholder="Search in Site"
          className="w-1/2 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 3. 사용자 정보 및 드롭다운 영역 */}
      <div className="relative" ref={dropdownRef}>
        {user ? (
          // 로그인 상태: 클릭 가능한 사용자 프로필 영역
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3"
            >
              <Avatar size="md" src={user.avatarUrl} alt={user.username} />
              <span className="font-medium text-gray-700">{user.username}</span>
            </button>

            {/* isDropdownOpen 상태가 true일 때만 드롭다운 메뉴 렌더링 */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 top-full">
                <UserDropdownMenu
                  user={user}
                  onLogout={handleLogout}
                  onCloseMenu={() => setIsDropdownOpen(false)}
                />
              </div>
            )}
          </>
        ) : (
          // 로그아웃 상태: 로그인 버튼
          <button className="px-4 py-1.5 text-sm font-medium text-black bg-blue-600 rounded-md hover:bg-blue-700">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
