<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ isEdit ? '給与編集' : '給与登録' }}
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 従業員選択 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            従業員 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.employeeId"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.employeeId }"
          >
            <option value="">従業員を選択</option>
            <option
              v-for="emp in employees"
              :key="emp.id"
              :value="emp.id"
            >
              {{ emp.lastName }} {{ emp.firstName }}
            </option>
          </select>
          <p v-if="errors.employeeId" class="mt-1 text-sm text-red-600">
            {{ errors.employeeId }}
          </p>
        </div>

        <!-- 年月 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              年 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.year"
              type="number"
              min="2000"
              max="2100"
              required
              class="input-field mt-1"
              :class="{ 'border-red-500': errors.year }"
            />
            <p v-if="errors.year" class="mt-1 text-sm text-red-600">
              {{ errors.year }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              月 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.month"
              type="number"
              min="1"
              max="12"
              required
              class="input-field mt-1"
              :class="{ 'border-red-500': errors.month }"
            />
            <p v-if="errors.month" class="mt-1 text-sm text-red-600">
              {{ errors.month }}
            </p>
          </div>
        </div>

        <!-- 基本給・残業代 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              基本給 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.baseAmount"
              type="number"
              min="0"
              required
              class="input-field mt-1"
              :class="{ 'border-red-500': errors.baseAmount }"
            />
            <p v-if="errors.baseAmount" class="mt-1 text-sm text-red-600">
              {{ errors.baseAmount }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              残業代
            </label>
            <input
              v-model.number="form.overtimeAmount"
              type="number"
              min="0"
              class="input-field mt-1"
            />
          </div>
        </div>

        <!-- 手当 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            手当
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

        <!-- 控除 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            控除
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

        <!-- 支給日 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            支給日 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.paymentDate"
            type="date"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.paymentDate }"
          />
          <p v-if="errors.paymentDate" class="mt-1 text-sm text-red-600">
            {{ errors.paymentDate }}
          </p>
         </div>

        <!-- 備考 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            備考
          </label>
          <textarea
            v-model="form.note"
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
        {{ isEdit ? '更新' : '登録' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { employeeService } from '@/lib/services/employee';
import type { SalaryWithEmployee, SalaryFormData } from '@/types/salary';

const props = defineProps<{
  salary?: SalaryWithEmployee | null;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: SalaryFormData];
}>();

const employees = ref<any[]>([]);
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  employeeId: props.salary?.employeeId || '',
  year: props.salary?.year || new Date().getFullYear(),
  month: props.salary?.month || new Date().getMonth() + 1,
  baseAmount: props.salary?.baseAmount || 0,
  overtimeAmount: props.salary?.overtimeAmount || 0,
  allowances: props.salary?.allowances || [],
  deductions: props.salary?.deductions || [],
  paymentDate: props.salary?.paymentDate || new Date().toISOString().split('T')[0],
  note: props.salary?.note || ''
});

async function loadEmployees() {
  try {
    employees.value = await employeeService.getAllEmployees();
  } catch (error) {
    console.error('従業員データの取得に失敗しました:', error);
  }
}

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

function validate(): boolean {
  errors.value = {};
  
  if (!form.value.employeeId) {
    errors.value.employeeId = '従業員を選択してください';
    return false;
  }
  
  if (!form.value.year || form.value.year < 2000 || form.value.year > 2100) {
    errors.value.year = '有効な年を入力してください';
    return false;
  }
  
  if (!form.value.month || form.value.month < 1 || form.value.month > 12) {
    errors.value.month = '有効な月を入力してください';
    return false;
  }
  
  if (!form.value.baseAmount || form.value.baseAmount < 0) {
    errors.value.baseAmount = '有効な基本給を入力してください';
    return false;
  }
  
  if (!form.value.paymentDate) {
    errors.value.paymentDate = '支給日を入力してください';
    return false;
  }
  
  return true;
}

function handleSubmit() {
  if (isLoading.value || !validate()) return;
  
  emit('submit', {
    ...form.value,
    allowances: form.value.allowances.filter(a => a.type && a.amount > 0),
    deductions: form.value.deductions.filter(d => d.type && d.amount > 0)
  });
}

onMounted(() => {
  loadEmployees();
});
</script>