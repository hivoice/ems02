<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ isEdit ? '役職編集' : '役職追加' }}
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            役職名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            所属部署 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.departmentId"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.departmentId }"
          >
            <option value="">部署を選択</option>
            <option
              v-for="dept in departments"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
          <p v-if="errors.departmentId" class="mt-1 text-sm text-red-600">
            {{ errors.departmentId }}
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
import { ref, onMounted } from 'vue';
import Modal from '@/components/Modal.vue';
import { useDepartments } from '@/composables/useDepartments';
import type { Position, PositionFormData } from '@/types/position';
import type { Department } from '@/types/department';

const props = defineProps<{
  position?: Position | null;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: PositionFormData];
}>();

const { departments, loadDepartments } = useDepartments();
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  title: props.position?.title || '',
  departmentId: props.position?.departmentId || '',
  description: props.position?.description || ''
});

function validate(): boolean {
  errors.value = {};
  
  if (!form.value.title.trim()) {
    errors.value.title = '役職名を入力してください';
    return false;
  }
  
  if (!form.value.departmentId) {
    errors.value.departmentId = '部署を選択してください';
    return false;
  }
  
  return true;
}

async function handleSubmit() {
  if (isLoading.value || !validate()) return;
  
  emit('submit', {
    title: form.value.title.trim(),
    departmentId: form.value.departmentId,
    description: form.value.description.trim()
  });
}

onMounted(() => {
  loadDepartments();
});
</script>