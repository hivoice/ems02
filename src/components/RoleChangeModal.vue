<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ $t('settings.userRoleManagement') }}
    </template>
    <template #content>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ $t('settings.confirmRoleChange') }}
        </p>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('common.role') }}
          </label>
          <select
            v-model="selectedRole"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#321fdb] focus:border-[#321fdb] sm:text-sm rounded-md"
          >
            <option value="employee">{{ $t('settings.userRole.employee') }}</option>
            <option value="admin">{{ $t('settings.userRole.admin') }}</option>
          </select>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="handleRoleChange"
        class="btn-primary px-4 py-2"
        :disabled="isLoading || selectedRole === currentRole"
      >
        {{ $t('common.save') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  userId: string;
  currentRole: 'admin' | 'employee';
  onRoleChange: (userId: string, newRole: 'admin' | 'employee') => Promise<void>;
}>();

const emit = defineEmits(['close']);
const isLoading = ref(false);
const selectedRole = ref(props.currentRole);

async function handleRoleChange() {
  if (isLoading.value || selectedRole.value === props.currentRole) return;
  
  isLoading.value = true;
  try {
    await props.onRoleChange(props.userId, selectedRole.value);
    emit('close');
  } catch (error) {
    console.error('Failed to change role:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>