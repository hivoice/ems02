<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">従業員一覧</h1>
      <button
        @click="showAddModal = true"
        class="btn-primary py-2 px-4 flex items-center"
      >
        <UserPlus class="w-5 h-5 mr-2" />
        従業員追加
      </button>
    </div>

    <!-- 検索バー -->
    <EmployeeSearch
      placeholder="名前、部署、役職で検索"
      @search="handleSearch"
    />

    <!-- 従業員テーブル -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                年齢
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                性別
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                部署
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                役職
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ employee.lastName }} {{ employee.firstName }}
                </div>
                <div class="text-sm text-gray-500">{{ employee.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.age }}歳
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.gender }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.department }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.position }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="editEmployee(employee)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  編集
                </button>
                <button
                  @click="confirmDelete(employee)"
                  class="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 従業員追加/編集モーダル -->
    <Modal v-if="showAddModal || showEditModal" @close="closeModal">
      <template #title>
        {{ showEditModal ? '従業員情報編集' : '従業員追加' }}
      </template>
      <template #content>
        <EmployeeForm
          ref="employeeForm"
          :initial-data="selectedEmployee"
          :is-admin="true"
          @submit="handleSubmit"
        >
          <template #actions>
            <button
              @click="closeModal"
              class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              キャンセル
            </button>
            <button
              type="submit"
              class="btn-primary px-4 py-2"
              :disabled="isLoading"
            >
              {{ showEditModal ? '更新' : '追加' }}
            </button>
          </template>
        </EmployeeForm>
      </template>
    </Modal>

    <!-- 削除確認モーダル -->
    <ConfirmDialog
      v-if="showDeleteModal"
      title="従業員削除"
      message="この従業員を削除してもよろしいですか？この操作は取り消せません。"
      danger
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <!-- 通知 -->
    <Notification ref="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserPlus } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Notification from '@/components/Notification.vue';
import EmployeeSearch from '@/components/employee/EmployeeSearch.vue';
import EmployeeForm from '@/components/employee/EmployeeForm.vue';
import { useEmployeeSearch } from '@/composables/useEmployeeSearch';
import { useEmployeeForm } from '@/composables/useEmployeeForm';
import type { Employee } from '@/types';

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedEmployee = ref<Employee | null>(null);
const notification = ref<{ addNotification: Function } | null>(null);
const employeeForm = ref<any>(null);

const {
  filteredEmployees,
  loadEmployees,
  updateSearch
} = useEmployeeSearch();

const {
  isLoading,
  createEmployee,
  updateEmployee
} = useEmployeeForm();

function handleSearch(query: string) {
  updateSearch(query);
}

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedEmployee.value = null;
}

function editEmployee(employee: Employee) {
  selectedEmployee.value = employee;
  showEditModal.value = true;
}

function confirmDelete(employee: Employee) {
  selectedEmployee.value = employee;
  showDeleteModal.value = true;
}

async function handleSubmit(formData: Partial<Employee>) {
  try {
    if (showEditModal.value && selectedEmployee.value) {
      await updateEmployee(selectedEmployee.value.id, formData);
      notification.value?.addNotification('success', '従業員情報を更新しました');
    } else {
      await createEmployee(formData);
      notification.value?.addNotification('success', '従業員を追加しました');
    }
    
    await loadEmployees();
    closeModal();
  } catch (error) {
    console.error('操作に失敗しました:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

async function handleDelete() {
  if (!selectedEmployee.value || isLoading.value) return;

  try {
    await employeeService.deleteEmployee(selectedEmployee.value.id);
    notification.value?.addNotification('success', '従業員を削除しました');
    await loadEmployees();
    showDeleteModal.value = false;
    selectedEmployee.value = null;
  } catch (error) {
    console.error('削除に失敗しました:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

// コンポーネントマウント時に従業員データを読み込む
loadEmployees();
</script>