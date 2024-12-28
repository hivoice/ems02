import { getDB } from '../db/client';
import { generateId } from '../utils/ids';
import type { Department } from '@/types/department';

class DepartmentService {
  async getAllDepartments(): Promise<Department[]> {
    try {
      const db = await getDB();
      const tx = db.transaction('departments', 'readonly');
      const departments = await tx.store.getAll();
      
      // Get employee counts for each department
      const employeeTx = db.transaction('employees', 'readonly');
      const employees = await employeeTx.store.getAll();
      
      return departments.map(dept => ({
        ...dept,
        employeeCount: employees.filter(emp => emp.departmentId === dept.id).length
      }));
    } catch (error) {
      console.error('部署データの取得に失敗しました:', error);
      return [];
    }
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const department: Department = {
        id: generateId(),
        name: data.name!,
        description: data.description || '',
        employeeCount: 0,
        created_at: now,
        updated_at: now
      };

      const tx = db.transaction('departments', 'readwrite');
      await tx.store.add(department);
      await tx.done;
      
      return department;
    } catch (error) {
      console.error('部署の作成に失敗しました:', error);
      throw new Error('部署の作成に失敗しました');
    }
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('departments', 'readwrite');
      
      const department = await tx.store.get(id);
      if (!department) {
        throw new Error('部署が見つかりません');
      }

      const updatedDepartment = {
        ...department,
        ...data,
        updated_at: new Date().toISOString()
      };

      await tx.store.put(updatedDepartment);
      await tx.done;
    } catch (error) {
      console.error('部署の更新に失敗しました:', error);
      throw error;
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    try {
      const db = await getDB();
      
      // Check if department has employees
      const employeeTx = db.transaction('employees', 'readonly');
      const employees = await employeeTx.store.index('by-department-id').getAll(id);
      
      if (employees.length > 0) {
        throw new Error('所属する従業員が存在するため削除できません');
      }

      const tx = db.transaction('departments', 'readwrite');
      await tx.store.delete(id);
      await tx.done;
    } catch (error) {
      console.error('部署の削除に失敗しました:', error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();