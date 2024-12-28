import { ref, computed } from 'vue';
import type { Employee } from '@/types';
import { employeeService } from '@/lib/services/employee';

export function useEmployeeSearch() {
  const searchQuery = ref('');
  const employees = ref<Employee[]>([]);
  const isLoading = ref(false);

  const filteredEmployees = computed(() => {
    if (!searchQuery.value) return employees.value;
    return employeeService.searchEmployees(searchQuery.value);
  });

  async function loadEmployees() {
    isLoading.value = true;
    try {
      employees.value = await employeeService.getAllEmployees();
    } catch (error) {
      console.error('従業員データの取得に失敗しました:', error);
    } finally {
      isLoading.value = false;
    }
  }

  function updateSearch(query: string) {
    searchQuery.value = query;
  }

  return {
    searchQuery,
    employees,
    isLoading,
    filteredEmployees,
    loadEmployees,
    updateSearch
  };
}