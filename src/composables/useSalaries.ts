import { ref, computed } from 'vue';
import type { Salary, SalaryWithEmployee } from '@/types/salary';
import { salaryService } from '@/lib/services/salary';

export function useSalaries() {
  const salaries = ref<SalaryWithEmployee[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth() + 1);

  const totalSalaryAmount = computed(() => {
    return salaries.value.reduce((sum, s) => sum + s.totalAmount, 0);
  });

  async function loadSalaries() {
    isLoading.value = true;
    error.value = null;

    try {
      salaries.value = await salaryService.getAllSalaries(
        currentYear.value,
        currentMonth.value
      );
    } catch (err) {
      console.error('Failed to load salaries:', err);
      error.value = '給与データの取得に失敗しました';
    } finally {
      isLoading.value = false;
    }
  }

  async function createSalary(data: Partial<Salary>) {
    isLoading.value = true;
    error.value = null;

    try {
      const salary = await salaryService.createSalary(data);
      await loadSalaries();
      return salary;
    } catch (err) {
      console.error('Failed to create salary:', err);
      error.value = '給与データの作成に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateSalary(id: string, data: Partial<Salary>) {
    isLoading.value = true;
    error.value = null;

    try {
      await salaryService.updateSalary(id, data);
      await loadSalaries();
    } catch (err) {
      console.error('Failed to update salary:', err);
      error.value = '給与データの更新に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function setDate(year: number, month: number) {
    currentYear.value = year;
    currentMonth.value = month;
    loadSalaries();
  }

  return {
    salaries,
    isLoading,
    error,
    currentYear,
    currentMonth,
    totalSalaryAmount,
    loadSalaries,
    createSalary,
    updateSalary,
    setDate
  };
}