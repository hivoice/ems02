<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ isEdit ? '部署編集' : '部署追加' }}
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            部署名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="input-field mt-1"
          ></textarea>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="mr-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        キャンセル
      </button>
      <button
        @click="handleSubmit"
        class="btn-primary px-4 py-2"
        :disabled="isLoading"
      >
        {{ isEdit ? '更新' : '追加' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import type { Department, DepartmentFormData } from '@/types/department';

const props = defineProps<{
  department?: Department | null;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: DepartmentFormData];
}>();

const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  name: props.department?.name || '',
  description: props.department?.description || ''
});

function validate(): boolean {
  errors.value = {};
  
  if (!form.value.name.trim()) {
    errors.value.name = '部署名を入力してください';
    return false;
  }
  
  return true;
}

async function handleSubmit() {
  if (isLoading.value || !validate()) return;
  
  emit('submit', {
    name: form.value.name.trim(),
    description: form.value.description.trim()
  });
}
</script>