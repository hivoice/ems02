import { ref } from 'vue';
import type { Department } from '@/types';
import { departmentService } from '@/lib/services/department';

export function useDepartments() {
  const departments = ref<Department[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadDepartments() {
    isLoading.value = true;
    error.value = null;

    try {
      departments.value = await departmentService.getAllDepartments();
    } catch (err) {
      console.error('Failed to load departments:', err);
      error.value = '部署データの取得に失敗しました';
    } finally {
      isLoading.value = false;
    }
  }

  async function createDepartment(data: Partial<Department>) {
    isLoading.value = true;
    error.value = null;

    try {
      const department = await departmentService.createDepartment(data);
      departments.value.push(department);
      return department;
    } catch (err) {
      console.error('Failed to create department:', err);
      error.value = '部署の作成に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateDepartment(id: string, data: Partial<Department>) {
    isLoading.value = true;
    error.value = null;

    try {
      await departmentService.updateDepartment(id, data);
      const index = departments.value.findIndex(d => d.id === id);
      if (index !== -1) {
        departments.value[index] = { ...departments.value[index], ...data };
      }
    } catch (err) {
      console.error('Failed to update department:', err);
      error.value = '部署の更新に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteDepartment(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await departmentService.deleteDepartment(id);
      departments.value = departments.value.filter(d => d.id !== id);
    } catch (err) {
      console.error('Failed to delete department:', err);
      error.value = '部署の削除に失敗しました';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    departments,
    isLoading,
    error,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
}