import { ref } from 'vue';
import type { Employee } from '@/types';
import { employeeService } from '@/lib/services/employee';

export function useEmployeeForm() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function createEmployee(data: Partial<Employee>) {
    isLoading.value = true;
    error.value = null;

    try {
      const employee = await employeeService.createEmployee(data);
      return employee;
    } catch (err: any) {
      error.value = err.message || 'エラーが発生しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEmployee(id: string, data: Partial<Employee>) {
    isLoading.value = true;
    error.value = null;

    try {
      await employeeService.updateEmployee(id, data);
    } catch (err: any) {
      error.value = err.message || 'エラーが発生しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    createEmployee,
    updateEmployee
  };
}