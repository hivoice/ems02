```vue
<template>
  <Modal @close="$emit('close')">
    <template #title>
      給与テンプレート
    </template>
    <template #content>
      <div class="space-y-4">
        <!-- テンプレート選択 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            テンプレート名
          </label>
          <div class="flex items-center space-x-2 mt-1">
            <select
              v-model="selectedTemplate"
              class="input-field flex-1"
            >
              <option value="">新規テンプレート</option>
              <option
                v-for="template in templates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </option>
            </select>
            <button
              v-if="selectedTemplate"
              @click="deleteTemplate"
              class="text-red-600 hover:text-red-800"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- テンプレート内容 -->
        <form @submit.prevent="saveTemplate" class="space-y-4">
          <div v-if="!selectedTemplate">
            <label class="block text-sm font-medium text-gray-700">
              テンプレート名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input-field mt-1"
            />
          </div>

          <!-- 手当テンプレート -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              手当項目
            </label>
            <div class="space-y-2">
              <div
                v-for="(allowance, index) in form.allowances"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="allowance.type"
                  type="text"
                  placeholder="手当名"
                  class="input-field flex-1"
                />
                <input
                  v-model.number="allowance.amount"
                  type="number"
                  min="0"
                  placeholder="金額"
                  class="input-field w-32"
                />
                <button
                  type="button"
                  @click="removeAllowance(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                @click="addAllowance"
                class="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + 手当を追加
              </button>
            </div>
          </div>

          <!-- 控除テンプレート -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              控除項目
            </label>
            <div class="space-y-2">
              <div
                v-for="(deduction, index) in form.deductions"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="deduction.type"
                  type="text"
                  placeholder="控除名"
                  class="input-field flex-1"
                />
                <input
                  v-model.number="deduction.amount"
                  type="number"
                  min="0"
                  placeholder="金額"
                  class="input-field w-32"
                />
                <button
                  type="button"
                  @click="removeDeduction(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                @click="addDeduction"
                class="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + 控除を追加
              </button>
            </div>
          </div>
        </form>
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
        @click="saveTemplate"
        class="btn-primary px-4 py-2"
        :disabled="isLoading"
      >
        保存
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';

const emit = defineEmits<{
  close: [];
  save: [template: any];
}>();

const isLoading = ref(false);
const selectedTemplate = ref('');
const templates = ref([
  { id: '1', name: '一般社員基本テンプレート' },
  { id: '2', name: '管理職テンプレート' }
]);

const form = ref({
  name: '',
  allowances: [
    { type: '通勤手当', amount: 0 },
    { type: '住宅手当', amount: 0 }
  ],
  deductions: [
    { type: '健康保険料', amount: 0 },
    { type: '厚生年金保険料', amount: 0 },
    { type: '雇用保険料', amount: 0 }
  ]
});

function addAllowance() {
  form.value.allowances.push({ type: '', amount: 0 });
}

function removeAllowance(index: number) {
  form.value.allowances.splice(index, 1);
}

function addDeduction() {
  form.value.deductions.push({ type: '', amount: 0 });
}

function removeDeduction(index: number) {
  form.value.deductions.splice(index, 1);
}

function saveTemplate() {
  if (isLoading.value) return;
  emit('save', {
    id: selectedTemplate.value || generateId(),
    name: form.value.name,
    allowances: form.value.allowances,
    deductions: form.value.deductions
  });
}

function deleteTemplate() {
  // テンプレート削除の実装
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
</script>
```