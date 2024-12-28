import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, signOut } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">
          <Bell className="w-6 h-6" />
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <User className="w-6 h-6" />
            <span>{user?.email}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;