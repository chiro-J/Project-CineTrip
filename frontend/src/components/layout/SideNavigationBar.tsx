import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 닫기(X) 아이콘 추가
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// JSDoc: 네비게이션 아이템의 데이터 구조를 정의합니다.
/**
 * 네비게이션 메뉴 아이템 인터페이스
 * @property id - 각 아이템을 식별하기 위한 고유 ID
 * @property label - 메뉴에 표시될 텍스트
 * @property icon - 메뉴에 표시될 이모지 아이콘
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

// JSDoc: 네비게이션 아이템의 데이터 구조를 정의합니다.
/**
 * 네비게이션 메뉴 아이템 인터페이스
 * @property id - 각 아이템을 식별하기 위한 고유 ID
 * @property label - 메뉴에 표시될 텍스트
 * @property icon - 메뉴에 표시될 이모지 아이콘
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

// JSDoc: SideNavigationBar 컴포넌트의 props 타입을 정의합니다.
/**
 * SideNavigationBar 컴포넌트 Props
 * @property isLoggedIn - 사용자의 로그인 상태. 제공되지 않으면 false로 간주됩니다.
 * @property activeItemId - (선택사항) 외부에서 활성화된 아이템의 ID를 제어할 때 사용합니다.
 * @property onItemClick - (선택사항) 외부에서 아이템 클릭 이벤트를 처리할 때 사용합니다.
 * @property onToggle - 사이드바의 열림/닫힘 상태가 변경될 때 호출될 콜백
 */
interface SideNavigationBarProps {
  activeItemId?: string; // 선택사항으로 변경
  onItemClick?: (id: string) => void; // 선택사항으로 변경
  onToggle?: (isOpen: boolean) => void;
}

/**
 * 토글 버튼이 내장된 독립적인 사이드 네비게이션 바 컴포넌트.
 * activeItemId와 onItemClick prop이 제공되지 않으면 상태를 자체적으로 관리합니다.
 */
const SideNavigationBar = ({
  activeItemId,
  onItemClick,
  onToggle,
}: SideNavigationBarProps): React.ReactElement | null => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // 로그인 상태가 아니라면 컴포넌트를 렌더링하지 않습니다.
  if (!isLoggedIn) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const fixedNavItems: NavigationItem[] = [
    { id: "movie-search", label: "영화 검색하기", icon: "🔍" },
    { id: "checklist", label: "여행 체크리스트", icon: "📋" },
    { id: "photos", label: "내 사진 편집", icon: "📷" },
    { id: "movies", label: "감상한 영화", icon: "🍿" },
    { id: "profile", label: "내 정보 수정", icon: "🛠️" },
  ];

  // 현재 경로에 따라 활성 아이템 결정
  const getActiveItemFromPath = useCallback((): string => {
    const { pathname, search } = location;

    if (pathname === "/profile") {
      return "checklist";
    } else if (pathname === "/profile/gallery") {
      const params = new URLSearchParams(search);
      const tab = params.get("tab");
      if (tab === "photos") return "photos";
      if (tab === "movies") return "movies";
      return "photos"; // 기본값
    } else if (pathname === "/movies") {
      return "movie-search";
    } else if (pathname.includes("/user/") && pathname.includes("/edit")) {
      return "profile";
    }

    // SNB 관련 페이지가 아닌 경우 빈 문자열 반환 (아무것도 선택되지 않음)
    return "";
  }, [location]);

  // --- 상태 내부 관리 로직 수정 ---
  const [internalActiveId, setInternalActiveId] = useState(() =>
    getActiveItemFromPath()
  );

  // 경로가 변경될 때마다 활성 아이템 업데이트
  useEffect(() => {
    if (activeItemId === undefined) {
      setInternalActiveId(getActiveItemFromPath());
    }
  }, [location.pathname, location.search, activeItemId, getActiveItemFromPath]);

  // prop으로 activeItemId가 제공되면 prop 값을, 아니면 내부 상태 값을 사용합니다 (Controlled vs Uncontrolled).
  const currentActiveId =
    activeItemId !== undefined ? activeItemId : internalActiveId;

  const navigate = useNavigate();

  const handleItemClick = (id: string): void => {
    // Navigate to different pages based on menu item
    switch (id) {
      case "checklist":
        navigate("/profile");
        break;
      case "photos":
        navigate("/profile/gallery?tab=photos");
        break;
      case "movies":
        navigate("/profile/gallery?tab=movies");
        break;
      case "movie-search":
        navigate("/movies");
        break;
      case "profile":
        navigate("/user/1/edit"); // 샘플 예시, 실제로는 user/1/edit을 user에 맞게 변경해야 함.
        break;
      default:
        break;
    }

    // SNB 메뉴 클릭시 사이드바를 닫지 않음 (열림 상태 유지)
    // 기존의 setIsOpen(false) 또는 handleClose() 호출을 제거

    // prop으로 onItemClick 핸들러가 제공되면 해당 핸들러를, 아니면 내부 상태를 업데이트합니다.
    if (onItemClick) {
      onItemClick(id);
    } else {
      setInternalActiveId(id);
    }
  };
  // --- 여기까지 ---

  const handleToggle = (): void => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const handleClose = (): void => {
    if (isOpen) {
      setIsOpen(false);
      onToggle?.(false);
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        toggleButtonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const asideClasses = `
    fixed top-24 left-0 z-40 flex flex-col w-64 h-[calc(100vh-6rem)] bg-white border-r border-gray-200
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    pt-2
  `;

  const buttonClasses = `
    fixed top-24 z-40 p-2 rounded-md hover:bg-gray-100
    transition-all duration-300 ease-in-out
    ${isOpen ? "left-[16rem]" : "left-4"}
  `;

  return (
    <>
      <button
        ref={toggleButtonRef}
        onClick={handleToggle}
        className={buttonClasses}
      >
        {isOpen ? (
          <span className="flex items-center justify-center w-5 h-5 bg-white rounded-sm shadow">
            <ChevronLeft size={16} color="black" />
          </span>
        ) : (
          <ChevronRight size={24} />
        )}
      </button>

      <aside ref={sidebarRef} className={asideClasses}>
        <nav>
          <ul className="space-y-2">
            {fixedNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                // 내부 상태 또는 외부 prop을 기준으로 활성화 상태를 결정합니다.
                isActive={item.id === currentActiveId}
                // 통합된 클릭 핸들러를 사용합니다.
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

// --- NavItem ---
interface NavItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({
  item,
  isActive,
  onClick,
}: NavItemProps): React.ReactElement => {
  const itemClasses = `
    flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg
    ${isActive ? "bg-gray-600 text-white" : "text-gray-600 hover:bg-gray-100"}
  `;

  return (
    <li>
      <button onClick={onClick} className={itemClasses}>
        <span className="mr-3 text-xl">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );
};

export default SideNavigationBar;
