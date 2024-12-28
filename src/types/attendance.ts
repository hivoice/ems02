export type AttendanceStatus = '出勤' | '欠勤' | '遅刻' | '早退' | '有給休暇' | '特別休暇';

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithEmployee extends Attendance {
  employee: {
    firstName: string;
    lastName: string;
    departmentName: string;
  };
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  paidLeaveDays: number;
  specialLeaveDays: number;
}

export type AttendancePeriod = '月次' | '四半期' | '年次';