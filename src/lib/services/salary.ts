import { getDB } from '../db/client';
import { generateId } from '../utils/ids';
import type { Salary, SalaryWithEmployee } from '@/types/salary';

class SalaryService {
  async getAllSalaries(year?: number, month?: number): Promise<SalaryWithEmployee[]> {
    try {
      const db = await getDB();
      const tx = db.transaction(['salaries', 'employees', 'departments'], 'readonly');
      
      let salaries = await tx.objectStore('salaries').getAll();
      const employees = await tx.objectStore('employees').getAll();
      const departments = await tx.objectStore('departments').getAll();

      // Filter by year and month if provided
      if (year !== undefined && month !== undefined) {
        salaries = salaries.filter(s => 
          s.year === year && s.month === month
        );
      }

      return salaries.map(salary => {
        const employee = employees.find(e => e.id === salary.employeeId);
        const department = employee 
          ? departments.find(d => d.id === employee.departmentId)
          : null;

        return {
          ...salary,
          employee: {
            firstName: employee?.firstName || '',
            lastName: employee?.lastName || '',
            departmentName: department?.name || ''
          }
        };
      });
    } catch (error) {
      console.error('給与データの取得に失敗しました:', error);
      return [];
    }
  }

  async getEmployeeSalaries(
    employeeId: string,
    year?: number,
    month?: number
  ): Promise<Salary[]> {
    try {
      const db = await getDB();
      const tx = db.transaction('salaries', 'readonly');
      const index = tx.store.index('by-employee-id');
      let records = await index.getAll(employeeId);

      if (year !== undefined && month !== undefined) {
        records = records.filter(r => 
          r.year === year && r.month === month
        );
      }

      return records;
    } catch (error) {
      console.error('従業員の給与データの取得に失敗しました:', error);
      return [];
    }
  }

  async createSalary(data: Partial<Salary>): Promise<Salary> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const salary: Salary = {
        id: generateId(),
        employeeId: data.employeeId!,
        year: data.year!,
        month: data.month!,
        baseAmount: data.baseAmount!,
        overtimeAmount: data.overtimeAmount!,
        allowances: data.allowances || [],
        deductions: data.deductions || [],
        totalAmount: this.calculateTotalAmount(data),
        paymentDate: data.paymentDate!,
        note: data.note,
        created_at: now,
        updated_at: now
      };

      const tx = db.transaction('salaries', 'readwrite');
      await tx.store.add(salary);
      await tx.done;
      
      return salary;
    } catch (error) {
      console.error('給与データの作成に失敗しました:', error);
      throw new Error('給与データの作成に失敗しました');
    }
  }

  async updateSalary(id: string, data: Partial<Salary>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('salaries', 'readwrite');
      
      const salary = await tx.store.get(id);
      if (!salary) {
        throw new Error('給与データが見つかりません');
      }

      const updatedSalary = {
        ...salary,
        ...data,
        totalAmount: this.calculateTotalAmount({ ...salary, ...data }),
        updated_at: new Date().toISOString()
      };

      await tx.store.put(updatedSalary);
      await tx.done;
    } catch (error) {
      console.error('給与データの更新に失敗しました:', error);
      throw error;
    }
  }

  private calculateTotalAmount(data: Partial<Salary>): number {
    const baseAmount = data.baseAmount || 0;
    const overtimeAmount = data.overtimeAmount || 0;
    const allowancesTotal = (data.allowances || [])
      .reduce((sum, a) => sum + a.amount, 0);
    const deductionsTotal = (data.deductions || [])
      .reduce((sum, d) => sum + d.amount, 0);

    return baseAmount + overtimeAmount + allowancesTotal - deductionsTotal;
  }
}

export const salaryService = new SalaryService();