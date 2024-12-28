import type { NavItem } from '@/types';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  FileBarChart,
  Settings,
  UserCircle,
  FileText,
  Key,
  UserCog
} from 'lucide-vue-next';

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, key: 'dashboard', path: '/admin/dashboard' },
  { icon: Users, key: 'employees', path: '/admin/employees' },
  { icon: Building2, key: 'departments', path: '/admin/departments' },
  { icon: Briefcase, key: 'positions', path: '/admin/positions' },
  { icon: Clock, key: 'attendance', path: '/admin/attendance' },
  { icon: DollarSign, key: 'salary', path: '/admin/salary' },
  { icon: Star, key: 'performance', path: '/admin/performance' },
  { icon: FileBarChart, key: 'reports', path: '/admin/reports' },
  { 
    icon: Settings, 
    key: 'settings', 
    path: '/admin/settings',
    children: [
      { icon: Key, key: 'changePassword', path: '/admin/settings/password' },
      { icon: UserCog, key: 'userManagement', path: '/admin/settings/users' }
    ]
  }
];

export const EMPLOYEE_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, key: 'dashboard', path: '/employee/dashboard' },
  { icon: UserCircle, key: 'profile', path: '/employee/profile' },
  { icon: Clock, key: 'attendance', path: '/employee/attendance' },
  { icon: DollarSign, key: 'salary', path: '/employee/salary' },
  { icon: Star, key: 'performance', path: '/employee/performance' },
  { icon: FileText, key: 'documents', path: '/employee/documents' }
];