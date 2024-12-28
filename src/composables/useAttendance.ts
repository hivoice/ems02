import { ref, computed } from 'vue';
import type { 
  Attendance, 
  AttendanceWithEmployee,
  AttendanceStats,
  AttendancePeriod 
} from '@/types/attendance';
import { attendanceService } from '@/lib/services/attendance';

export function useAttendance() {
  const attendance = ref<AttendanceWithEmployee[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const selectedPeriod = ref<AttendancePeriod>('月次');
  const currentDate = ref(new Date());

  const dateRange = computed(() => {
    const start = new Date(currentDate.value);
    const end = new Date(currentDate.value);

    switch (selectedPeriod.value) {
      case '月次':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
        break;
      case '四半期':
        start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
        end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 3, 0);
        break;
      case '年次':
        start.setMonth(0, 1);
        end.setMonth(12, 0);
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });

  async function loadAttendance() {
    isLoading.value = true;
    error.value = null;

    try {
      attendance.value = await attendanceService.getAllAttendance(
        dateRange.value.start,
        dateRange.value.end
      );
    } catch (err) {
      console.error('Failed to load attendance:', err);
      error.value = '勤怠データの取得に失敗しました';
    } finally {
      isLoading.value = false;
    }
  }

  async function createAttendance(data: Partial<Attendance>) {
    isLoading.value = true;
    error.value = null;

    try {
      await attendanceService.createAttendance(data);
      await loadAttendance();
    } catch (err) {
      console.error('Failed to create attendance:', err);
      error.value = '勤怠記録の作成に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAttendance(id: string, data: Partial<Attendance>) {
    isLoading.value = true;
    error.value = null;

    try {
      await attendanceService.updateAttendance(id, data);
      await loadAttendance();
    } catch (err) {
      console.error('Failed to update attendance:', err);
      error.value = '勤怠記録の更新に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getAttendanceStats(
    employeeId: string
  ): Promise<AttendanceStats> {
    try {
      return await attendanceService.getAttendanceStats(
        employeeId,
        dateRange.value.start,
        dateRange.value.end
      );
    } catch (err) {
      console.error('Failed to get attendance stats:', err);
      throw err;
    }
  }

  function setPeriod(period: AttendancePeriod) {
    selectedPeriod.value = period;
    loadAttendance();
  }

  function setDate(date: Date) {
    currentDate.value = date;
    loadAttendance();
  }

  return {
    attendance,
    isLoading,
    error,
    selectedPeriod,
    currentDate,
    dateRange,
    loadAttendance,
    createAttendance,
    updateAttendance,
    getAttendanceStats,
    setPeriod,
    setDate
  };
}