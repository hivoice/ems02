export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: '男性' | '女性' | 'その他';
  age: number;
  position: string;
  department: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  active?: boolean;
}

export interface NavItem {
  icon: Component;
  key: string;
  path: string;
  children?: NavItem[];
}

export interface StatCardProps {
  icon: Component;
  label: string;
  value: string;
  color: string;
}