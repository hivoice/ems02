import { getDB } from '../db/client';
import { generateId } from '../utils/ids';
import type { Attendance, AttendanceWithEmployee, AttendanceStats } from '@/types/attendance';

class AttendanceService {
  async getAllAttendance(startDate?: string, endDate?: string): Promise<AttendanceWithEmployee[]> {
    try {
      const db = await getDB();
      const tx = db.transaction(['attendance', 'employees', 'departments'], 'readonly');
      
      let attendance = await tx.objectStore('attendance').getAll();
      const employees = await tx.objectStore('employees').getAll();
      const departments = await tx.objectStore('departments').getAll();

      // Filter by date range if provided
      if (startDate && endDate) {
        attendance = attendance.filter(a => 
          a.date >= startDate && a.date <= endDate
        );
      }

      return attendance.map(record => {
        const employee = employees.find(e => e.id === record.employeeId);
        const department = employee 
          ? departments.find(d => d.id === employee.departmentId)
          : null;

        return {
          ...record,
          employee: {
            firstName: employee?.firstName || '',
            lastName: employee?.lastName || '',
            departmentName: department?.name || ''
          }
        };
      });
    } catch (error) {
      console.error('勤怠データの取得に失敗しました:', error);
      return [];
    }
  }

  async getEmployeeAttendance(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    try {
      const db = await getDB();
      const tx = db.transaction('attendance', 'readonly');
      const index = tx.store.index('by-employee-id');
      let records = await index.getAll(employeeId);

      if (startDate && endDate) {
        records = records.filter(r => 
          r.date >= startDate && r.date <= endDate
        );
      }

      return records;
    } catch (error) {
      console.error('従業員の勤怠データの取得に失敗しました:', error);
      return [];
    }
  }

  async createAttendance(data: Partial<Attendance>): Promise<Attendance> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const attendance: Attendance = {
        id: generateId(),
        employeeId: data.employeeId!,
        date: data.date!,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        status: data.status!,
        note: data.note,
        created_at: now,
        updated_at: now
      };

      const tx = db.transaction('attendance', 'readwrite');
      await tx.store.add(attendance);
      await tx.done;
      
      return attendance;
    } catch (error) {
      console.error('勤怠記録の作成に失敗しました:', error);
      throw new Error('勤怠記録の作成に失敗しました');
    }
  }

  async updateAttendance(id: string, data: Partial<Attendance>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('attendance', 'readwrite');
      
      const record = await tx.store.get(id);
      if (!record) {
        throw new Error('勤怠記録が見つかりません');
      }

      const updatedRecord = {
        ...record,
        ...data,
        updated_at: new Date().toISOString()
      };

      await tx.store.put(updatedRecord);
      await tx.done;
    } catch (error) {
      console.error('勤怠記録の更新に失敗しました:', error);
      throw error;
    }
  }

  async getAttendanceStats(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<AttendanceStats> {
    try {
      const records = await this.getEmployeeAttendance(employeeId, startDate, endDate);
      
      return {
        totalDays: records.length,
        presentDays: records.filter(r => r.status === '出勤').length,
        absentDays: records.filter(r => r.status === '欠勤').length,
        lateDays: records.filter(r => r.status === '遅刻').length,
        earlyLeaveDays: records.filter(r => r.status === '早退').length,
        paidLeaveDays: records.filter(r => r.status === '有給休暇').length,
        specialLeaveDays: records.filter(r => r.status === '特別休暇').length
      };
    } catch (error) {
      console.error('勤怠統計の取得に失敗しました:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();