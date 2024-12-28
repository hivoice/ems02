export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
}