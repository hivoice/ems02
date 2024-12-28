```vue
<template>
  <Modal @close="$emit('close')">
    <template #title>
      給与承認
    </template>
    <template #content>
      <div class="space-y-6">
        <!-- 承認状況 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-4">承認状況</h3>
          <div class="space-y-2">
            <div
              v-for="(status, index) in approvalStatus"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <component
                  :is="getStatusIcon(status.status)"
                  class="w-5 h-5 mr-2"
                  :class="getStatusColor(status.status)"
                />
                <span>{{ status.name }}</span>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(status.date) }}
              </div>
            </div>
          </div>
        </div>

        <!-- コメント -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            承認コメント
          </label>
          <textarea
            v-model="comment"
            rows="3"
            class="input-field"
            placeholder="承認に関するコメントを入力してください"
          ></textarea>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        キャンセル
      </button>
      <button
        @click="reject"
        class="mr-3 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
        :disabled="isLoading"
      >
        却下
      </button>
      <button
        @click="approve"
        class="btn-primary px-4 py-2"
        :disabled="isLoading"
      >
        承認
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle, XCircle, Clock } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';

const emit = defineEmits<{
  close: [];
  approve: [comment: string];
  reject: [comment: string];
}>();

const isLoading = ref(false);
const comment = ref('');

// 承認状況のサンプルデータ
const approvalStatus = ref([
  {
    name: '経理担当者確認',
    status: 'approved',
    date: '2024-01-15T10:00:00'
  },
  {
    name: '部門長承認',
    status: 'pending',
    date: null
  },
  {
    name: '人事部確認',
    status: 'waiting',
    date: null
  }
]);

function getStatusIcon(status: string) {
  switch (status) {
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    default:
      return Clock;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'text-green-500';
    case 'rejected':
      return 'text-red-500';
    case 'pending':
      return 'text-yellow-500';
    default:
      return 'text-gray-400';
  }
}

function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function approve() {
  if (isLoading.value) return;
  emit('approve', comment.value);
}

function reject() {
  if (isLoading.value) return;
  emit('reject', comment.value);
}
</script>
```