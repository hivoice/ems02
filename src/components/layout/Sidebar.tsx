import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase,
  Clock,
  DollarSign,
  Star,
  FileBarChart,
  Settings
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Building2, label: 'Departments', path: '/departments' },
  { icon: Briefcase, label: 'Positions', path: '/positions' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: DollarSign, label: 'Salary', path: '/salary' },
  { icon: Star, label: 'Performance', path: '/performance' },
  { icon: FileBarChart, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-[#3c4b64] text-white w-64 min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">HRMS Admin</h1>
      </div>
      <nav className="mt-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-6 py-3 text-sm ${
              location.pathname === path
                ? 'bg-[#321fdb] text-white'
                : 'text-gray-300 hover:bg-[#321fdb] hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;