import { getDB } from '../db/client';
import { generateId } from '../utils/ids';
import type { Employee } from '@/types';

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const db = await getDB();
      const tx = db.transaction('employees', 'readonly');
      return tx.store.getAll();
    } catch (error) {
      console.error('従業員データの取得に失敗しました:', error);
      return [];
    }
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | null> {
    try {
      const db = await getDB();
      const tx = db.transaction('employees', 'readonly');
      const index = tx.store.index('by-user-id');
      return index.get(userId);
    } catch (error) {
      console.error('従業員データの取得に失敗しました:', error);
      return null;
    }
  }

  async createEmployee(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const employee: Employee = {
        id: generateId(),
        ...data,
        created_at: now,
        updated_at: now
      };

      const tx = db.transaction('employees', 'readwrite');
      await tx.store.add(employee);
      await tx.done;
      
      return employee;
    } catch (error) {
      console.error('従業員の作成に失敗しました:', error);
      throw new Error('従業員の作成に失敗しました');
    }
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('employees', 'readwrite');
      
      const employee = await tx.store.get(id);
      if (!employee) {
        throw new Error('従業員が見つかりません');
      }

      const updatedEmployee = {
        ...employee,
        ...data,
        updated_at: new Date().toISOString()
      };

      await tx.store.put(updatedEmployee);
      await tx.done;
    } catch (error) {
      console.error('従業員の更新に失敗しました:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('employees', 'readwrite');
      await tx.store.delete(id);
      await tx.done;
    } catch (error) {
      console.error('従業員の削除に失敗しました:', error);
      throw error;
    }
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    try {
      const db = await getDB();
      const tx = db.transaction('employees', 'readonly');
      const employees = await tx.store.getAll();
      
      const searchQuery = query.toLowerCase();
      return employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery) ||
        emp.lastName.toLowerCase().includes(searchQuery) ||
        emp.position.toLowerCase().includes(searchQuery) ||
        emp.department.toLowerCase().includes(searchQuery)
      );
    } catch (error) {
      console.error('従業員の検索に失敗しました:', error);
      return [];
    }
  }
}

export const employeeService = new EmployeeService();