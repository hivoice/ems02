```vue
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">部署管理</h1>
      <button
        @click="showAddModal = true"
        class="btn-primary py-2 px-4 flex items-center"
      >
        <Plus class="w-5 h-5 mr-2" />
        部署追加
      </button>
    </div>

    <DepartmentList
      :departments="departments"
      @edit="editDepartment"
      @delete="confirmDelete"
    />

    <!-- 部署追加/編集モーダル -->
    <DepartmentFormModal
      v-if="showAddModal || showEditModal"
      :department="selectedDepartment"
      :is-edit="showEditModal"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 削除確認モーダル -->
    <ConfirmDialog
      v-if="showDeleteModal"
      title="部署削除"
      message="この部署を削除してもよろしいですか？この操作は取り消せません。"
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
import { Plus } from 'lucide-vue-next';
import DepartmentList from '@/components/department/DepartmentList.vue';
import DepartmentFormModal from '@/components/department/DepartmentFormModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Notification from '@/components/Notification.vue';
import { useDepartments } from '@/composables/useDepartments';
import type { Department } from '@/types/department';

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedDepartment = ref<Department | null>(null);
const notification = ref<{ addNotification: Function } | null>(null);

const {
  departments,
  isLoading,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  loadDepartments
} = useDepartments();

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedDepartment.value = null;
}

function editDepartment(department: Department) {
  selectedDepartment.value = department;
  showEditModal.value = true;
}

function confirmDelete(department: Department) {
  selectedDepartment.value = department;
  showDeleteModal.value = true;
}

async function handleSubmit(formData: Partial<Department>) {
  try {
    if (showEditModal.value && selectedDepartment.value) {
      await updateDepartment(selectedDepartment.value.id, formData);
      notification.value?.addNotification('success', '部署情報を更新しました');
    } else {
      await createDepartment(formData);
      notification.value?.addNotification('success', '部署を追加しました');
    }
    
    await loadDepartments();
    closeModal();
  } catch (error) {
    console.error('操作に失敗しました:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

async function handleDelete() {
  if (!selectedDepartment.value || isLoading.value) return;

  try {
    await deleteDepartment(selectedDepartment.value.id);
    notification.value?.addNotification('success', '部署を削除しました');
    await loadDepartments();
    showDeleteModal.value = false;
    selectedDepartment.value = null;
  } catch (error: any) {
    console.error('削除に失敗しました:', error);
    notification.value?.addNotification('error', error.message || 'エラーが発生しました');
  }
}

// 初期データ読み込み
loadDepartments();
</script>
```