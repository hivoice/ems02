import type { DBSchema } from 'idb';

export interface HRMSSchema extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      password: string;
      role: 'admin' | 'employee';
      active: boolean;
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-email': string };
  };
  
  employees: {
    key: string;
    value: {
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      departmentId: string;
      positionId: string;
      gender: '男性' | '女性' | 'その他';
      age: number;
      created_at: string;
      updated_at: string;
    };
    indexes: { 
      'by-user-id': string;
      'by-department-id': string;
      'by-position-id': string;
    };
  };

  departments: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    indexes: {};
  };

  positions: {
    key: string;
    value: {
      id: string;
      title: string;
      departmentId: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-department-id': string };
  };

  attendance: {
    key: string;
    value: {
      id: string;
      employeeId: string;
      date: string;
      checkIn?: string;
      checkOut?: string;
      status: '出勤' | '欠勤' | '遅刻' | '早退' | '有給休暇' | '特別休暇';
      note?: string;
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-employee-id': string };
  };

  salaries: {
    key: string;
    value: {
      id: string;
      employeeId: string;
      year: number;
      month: number;
      baseAmount: number;
      overtimeAmount: number;
      allowances: Array<{ type: string; amount: number; }>;
      deductions: Array<{ type: string; amount: number; }>;
      totalAmount: number;
      paymentDate: string;
      note?: string;
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-employee-id': string };
  };
}

export const DB_CONFIG = {
  name: 'hrms',
  version: 1,
  stores: {
    users: {
      keyPath: 'id',
      indexes: [
        { name: 'by-email', keyPath: 'email', options: { unique: true } }
      ]
    },
    employees: {
      keyPath: 'id',
      indexes: [
        { name: 'by-user-id', keyPath: 'userId', options: { unique: true } },
        { name: 'by-department-id', keyPath: 'departmentId', options: { unique: false } },
        { name: 'by-position-id', keyPath: 'positionId', options: { unique: false } }
      ]
    },
    departments: {
      keyPath: 'id',
      indexes: []
    },
    positions: {
      keyPath: 'id',
      indexes: [
        { name: 'by-department-id', keyPath: 'departmentId', options: { unique: false } }
      ]
    },
    attendance: {
      keyPath: 'id',
      indexes: [
        { name: 'by-employee-id', keyPath: 'employeeId', options: { unique: false } }
      ]
    },
    salaries: {
      keyPath: 'id',
      indexes: [
        { name: 'by-employee-id', keyPath: 'employeeId', options: { unique: false } }
      ]
    }
  }
} as const;