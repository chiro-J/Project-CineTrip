import React from "react";
import { Avatar } from "../ui/Avatar";
import { Search, Star, User, LogOut } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  avatarUrl: string;
}

interface UserDropdownProps {
  user: UserProfile;
  onLogout: () => void;
  onCloseMenu?: () => void;
}

/**
 * 사용자 프로필 드롭다운 메뉴 컴포넌트 (UI 전용)
 */
const UserDropdown = ({
  user,
  onLogout,
  onCloseMenu,
}: UserDropdownProps): React.ReactElement => {
  const handleItemClick = (menuName: string) => {
    console.log(`${menuName} menu clicked`);
    onCloseMenu?.();
  };

  const handleLogoutClick = (): void => {
    onLogout();
    onCloseMenu?.();
  };

  return (
    <div className="w-64 bg-white border border-gray-200 shadow-lg rounded-xl">
      <div className="flex items-center p-4 space-x-3">
        <Avatar size="md" src={user.avatarUrl} alt={user.username} />
        <div>
          <p className="text-sm font-medium text-gray-600 truncate">
            {user.email}
          </p>
          <p className="text-base font-semibold text-gray-900">
            {user.username}
          </p>
        </div>
      </div>
      <hr className="mx-2 border-gray-100" />
      <nav className="py-2">
        <ul>
          <MenuItem
            icon={<Search size={18} />}
            text="Browse"
            onClick={() => handleItemClick("Browse")}
          />
          <MenuItem
            icon={<Star size={18} />}
            text="Favorites"
            onClick={() => handleItemClick("Favorites")}
          />
          <MenuItem
            icon={<User size={18} />}
            text="My Page"
            onClick={() => handleItemClick("My Page")}
          />
        </ul>
      </nav>
      <hr className="mx-2 border-gray-100" />
      <div className="p-2">
        <MenuItem
          icon={<LogOut size={18} />}
          text="Logout"
          onClick={handleLogoutClick}
        />
      </div>
    </div>
  );
};

// --- MenuItem ---
interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

const MenuItem = ({
  icon,
  text,
  onClick,
}: MenuItemProps): React.ReactElement => {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <span className="text-gray-500">{icon}</span>
        <span>{text}</span>
      </button>
    </li>
  );
};

export default UserDropdown;
