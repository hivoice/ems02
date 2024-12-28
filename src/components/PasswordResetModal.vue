<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ $t('settings.resetPassword') }}
    </template>
    <template #content>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ $t('settings.resetPasswordConfirm') }}
        </p>
        <div v-if="newPassword" class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700">
            {{ $t('settings.newPasswordIs') }}:
          </p>
          <p class="mt-2 text-lg font-mono bg-white p-2 rounded border">
            {{ newPassword }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        {{ $t('common.close') }}
      </button>
      <button
        v-if="!newPassword"
        @click="handleReset"
        class="btn-primary px-4 py-2"
        :disabled="isLoading"
      >
        {{ $t('settings.resetPassword') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  userId: string;
  onReset: (userId: string) => Promise<string>;
}>();

const emit = defineEmits(['close']);
const isLoading = ref(false);
const newPassword = ref('');

async function handleReset() {
  if (isLoading.value) return;
  
  isLoading.value = true;
  try {
    newPassword.value = await props.onReset(props.userId);
  } catch (error) {
    console.error('Failed to reset password:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>