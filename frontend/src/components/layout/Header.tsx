import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import UserDropdown from "./UserDropdown";
import logo from "../../assets/logos/logo.png";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

/**
 * 전역 네비게이션 바 (GNB) 컴포넌트
 * 사이트 로고, 검색 기능, 사용자 프로필 영역(드롭다운 포함)을 포함합니다.
 */
const Header = (): React.ReactElement => {
  // Zustand 스토어에서 로그인 상태와 사용자 정보, 액션을 가져옵니다.
  const user = useAuthStore(s => s.user);
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const logout = useAuthStore(s => s.logout);
  const openLoginModal = useAuthStore(s => s.openLoginModal);

  // 드롭다운 메뉴의 열림/닫힘 상태를 관리하는 state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 검색어 상태를 관리하는 state
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * 검색 아이콘 클릭 또는 Enter 키 입력 시 실행될 함수
   * 검색어를 URL 파라미터로 전달하여 검색 결과 페이지로 이동합니다.
   */
  const handleSearch = (): void => {
    // 검색어가 비어있지 않을 때만 실행
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  /**
   * Enter 키를 눌렀을 때 검색을 실행하는 핸들러
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * 로그아웃 핸들러를 Zustand 스토어의 logout 액션과 연결
   */
  const handleLogout = (): void => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  /**
   * 로고/CineTrip 영역 클릭 시 홈으로 이동하는 함수
   */
  const handleLogoClick = (): void => {
    navigate("/home");
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
      {/* 1. 로고 영역 (홈으로 이동) */}
      <div 
        className="flex items-center space-x-2 transition-opacity cursor-pointer hover:opacity-80"
        onClick={handleLogoClick}
      >
        <img src={logo} alt="CineTrip Logo" className="w-8 h-8 rounded-full" />
        <span className="text-xl font-bold text-gray-800">CineTrip</span>
      </div>

      {/* 2. 검색창 영역 */}
      <div className="flex items-center justify-center flex-1 px-16">
        <input
          type="search"
          placeholder="Search in Site"
          className="w-full max-w-md px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="p-2 ml-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 3. 사용자 정보 및 드롭다운 영역 */}
      <div className="relative" ref={dropdownRef}>
        {isLoggedIn && user ? (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3"
            >
              <Avatar size="md" src={user.avatarUrl} alt={user.username} />
              <span className="font-medium text-gray-700">{user.username}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 top-full">
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  onCloseMenu={() => setIsDropdownOpen(false)}
                />
              </div>
            )}
          </>
        ) : (
          // 로그아웃 상태: 로그인 버튼
          <Button variant="outline" onClick={openLoginModal}>로그인</Button>
        )}
      </div>
      
    </nav>
  );
};

export default Header;
