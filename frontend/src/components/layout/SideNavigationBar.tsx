import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 닫기(X) 아이콘 추가

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
 * @property activeItemId - 현재 활성화된 아이템의 ID
 * @property onItemClick - 아이템 클릭 시 호출될 콜백 함수
 * @property onToggle - 사이드바의 열림/닫힘 상태가 변경될 때 호출될 콜백
 */
interface SideNavigationBarProps {
  activeItemId: string;
  onItemClick: (id: string) => void;
  onToggle?: (isOpen: boolean) => void;
}

/**
 * 토글 버튼이 내장된 독립적인 사이드 네비게이션 바 컴포넌트
 */
const SideNavigationBar = ({
  activeItemId,
  onItemClick,
  onToggle,
}: SideNavigationBarProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(true);

  const fixedNavItems: NavigationItem[] = [
    { id: "checklist", label: "여행 체크리스트", icon: "📋" },
    { id: "photos", label: "내 사진 편집", icon: "📷" },
    { id: "movies", label: "감상한 영화", icon: "🍿" },
    { id: "profile", label: "내 정보 수정", icon: "🛠️" },
  ];

  const handleItemClick = (id: string): void => {
    onItemClick(id);
  };

  // 2. 토글 버튼 클릭 핸들러
  const handleToggle = (): void => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const asideClasses = `
    fixed top-16 left-0 z-40 flex flex-col w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    pt-2`;

  // 3. isOpen 상태에 따라 버튼의 위치를 동적으로 변경하는 클래스
  const buttonClasses = `
		fixed top-16 z-50 p-2 rounded-md hover:bg-gray-100
		transition-all duration-300 ease-in-out
		${isOpen ? "left-[16rem]" : "left-4"}`;

  return (
    <>
      <button onClick={handleToggle} className={buttonClasses}>
        {isOpen ? (
          <span className="flex items-center justify-center w-5 h-5 bg-white rounded-sm shadow">
            <ChevronLeft size={12} />
          </span>
        ) : (
          <ChevronRight size={24} />
        )}
      </button>

      <aside className={asideClasses}>
        <nav>
          <ul className="space-y-2">
            {fixedNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={item.id === activeItemId}
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
    ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
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
