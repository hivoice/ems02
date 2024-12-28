<template>
  <Modal @close="$emit('close')">
    <template #title>
      {{ isEdit ? '勤怠編集' : '勤怠登録' }}
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

        <!-- 日付 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            日付 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.date"
            type="date"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.date }"
          />
          <p v-if="errors.date" class="mt-1 text-sm text-red-600">
            {{ errors.date }}
          </p>
        </div>

        <!-- 状態 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            状態 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="input-field mt-1"
            :class="{ 'border-red-500': errors.status }"
          >
            <option value="">状態を選択</option>
            <option value="出勤">出勤</option>
            <option value="欠勤">欠勤</option>
            <option value="遅刻">遅刻</option>
            <option value="早退">早退</option>
            <option value="有給休暇">有給休暇</option>
            <option value="特別休暇">特別休暇</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-600">
            {{ errors.status }}
          </p>
        </div>

        <!-- 出退勤時刻 -->
        <div v-if="form.status === '出勤' || form.status === '遅刻' || form.status === '早退'">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                出勤時刻
              </label>
              <input
                v-model="form.checkIn"
                type="time"
                class="input-field mt-1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                退勤時刻
              </label>
              <input
                v-model="form.checkOut"
                type="time"
                class="input-field mt-1"
              />
            </div>
          </div>
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
import Modal from '@/components/Modal.vue';
import type { AttendanceWithEmployee } from '@/types/attendance';
import { employeeService } from '@/lib/services/employee';

const props = defineProps<{
  attendance?: AttendanceWithEmployee | null;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();

const employees = ref<any[]>([]);
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  employeeId: props.attendance?.employeeId || '',
  date: props.attendance?.date || new Date().toISOString().split('T')[0],
  status: props.attendance?.status || '',
  checkIn: props.attendance?.checkIn?.split('T')[1].slice(0, 5) || '',
  checkOut: props.attendance?.checkOut?.split('T')[1].slice(0, 5) || '',
  note: props.attendance?.note || ''
});

async function loadEmployees() {
  try {
    employees.value = await employeeService.getAllEmployees();
  } catch (error) {
    console.error('従業員データの取得に失敗しました:', error);
  }
}

function validate(): boolean {
  errors.value = {};
  
  if (!form.value.employeeId) {
    errors.value.employeeId = '従業員を選択してください';
    return false;
  }
  
  if (!form.value.date) {
    errors.value.date = '日付を選択してください';
    return false;
  }
  
  if (!form.value.status) {
    errors.value.status = '状態を選択してください';
    return false;
  }
  
  return true;
}

function handleSubmit() {
  if (isLoading.value || !validate()) return;
  
  const data = {
    ...form.value,
    checkIn: form.value.checkIn 
      ? `${form.value.date}T${form.value.checkIn}:00` 
      : undefined,
    checkOut: form.value.checkOut
      ? `${form.value.date}T${form.value.checkOut}:00`
      : undefined
  };
  
  emit('submit', data);
}

onMounted(() => {
  loadEmployees();
});
</script>