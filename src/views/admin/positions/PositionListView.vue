<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">役職管理</h1>
      <button
        @click="showAddModal = true"
        class="btn-primary py-2 px-4 flex items-center"
      >
        <Plus class="w-5 h-5 mr-2" />
        役職追加
      </button>
    </div>

    <PositionList
      :positions="positions"
      @edit="editPosition"
      @delete="confirmDelete"
    />

    <!-- 役職追加/編集モーダル -->
    <PositionFormModal
      v-if="showAddModal || showEditModal"
      :position="selectedPosition"
      :is-edit="showEditModal"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 削除確認モーダル -->
    <ConfirmDialog
      v-if="showDeleteModal"
      title="役職削除"
      message="この役職を削除してもよろしいですか？この操作は取り消せません。"
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
import PositionList from '@/components/position/PositionList.vue';
import PositionFormModal from '@/components/position/PositionFormModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Notification from '@/components/Notification.vue';
import { usePositions } from '@/composables/usePositions';
import type { Position } from '@/types/position';

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedPosition = ref<Position | null>(null);
const notification = ref<{ addNotification: Function } | null>(null);

const {
  positions,
  isLoading,
  createPosition,
  updatePosition,
  deletePosition,
  loadPositions
} = usePositions();

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedPosition.value = null;
}

function editPosition(position: Position) {
  selectedPosition.value = position;
  showEditModal.value = true;
}

function confirmDelete(position: Position) {
  selectedPosition.value = position;
  showDeleteModal.value = true;
}

async function handleSubmit(formData: Partial<Position>) {
  try {
    if (showEditModal.value && selectedPosition.value) {
      await updatePosition(selectedPosition.value.id, formData);
      notification.value?.addNotification('success', '役職情報を更新しました');
    } else {
      await createPosition(formData);
      notification.value?.addNotification('success', '役職を追加しました');
    }
    
    await loadPositions();
    closeModal();
  } catch (error) {
    console.error('操作に失敗しました:', error);
    notification.value?.addNotification('error', 'エラーが発生しました');
  }
}

async function handleDelete() {
  if (!selectedPosition.value || isLoading.value) return;

  try {
    await deletePosition(selectedPosition.value.id);
    notification.value?.addNotification('success', '役職を削除しました');
    await loadPositions();
    showDeleteModal.value = false;
    selectedPosition.value = null;
  } catch (error: any) {
    console.error('削除に失敗しました:', error);
    notification.value?.addNotification('error', error.message || 'エラーが発生しました');
  }
}

// 初期データ読み込み
loadPositions();
</script>