<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ title }}
    </template>
    <template #content>
      <p class="text-sm text-gray-600">
        {{ message }}
      </p>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="$emit('confirm')"
        class="btn-primary px-4 py-2"
        :class="{ 'bg-red-600 hover:bg-red-700': danger }"
      >
        {{ $t('common.confirm') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';

defineProps<{
  title: string;
  message: string;
  danger?: boolean;
}>();

defineEmits(['close', 'confirm']);
</script>