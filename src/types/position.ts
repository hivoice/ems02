export interface Position {
  id: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  description: string;
  employeeCount: number;
  created_at: string;
  updated_at: string;
}

export interface PositionFormData {
  title: string;
  departmentId: string;
  description?: string;
}