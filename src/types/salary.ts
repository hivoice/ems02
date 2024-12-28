export interface SalaryAllowance {
  type: string;
  amount: number;
}

export interface SalaryDeduction {
  type: string;
  amount: number;
}

export interface Salary {
  id: string;
  employeeId: string;
  year: number;
  month: number;
  baseAmount: number;
  overtimeAmount: number;
  allowances: SalaryAllowance[];
  deductions: SalaryDeduction[];
  totalAmount: number;
  paymentDate: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryWithEmployee extends Salary {
  employee: {
    firstName: string;
    lastName: string;
    departmentName: string;
  };
}

export interface SalaryFormData {
  employeeId: string;
  year: number;
  month: number;
  baseAmount: number;
  overtimeAmount: number;
  allowances: SalaryAllowance[];
  deductions: SalaryDeduction[];
  paymentDate: string;
  note?: string;
}