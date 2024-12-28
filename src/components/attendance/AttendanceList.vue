<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日付
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              従業員名
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              部署
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              出勤時刻
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              退勤時刻
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状態
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              備考
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="!loading">
            <tr v-for="record in attendanceRecords" :key="record.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(record.date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ record.employee.lastName }} {{ record.employee.firstName }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ record.employee.departmentName }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ record.checkIn ? formatTime(record.checkIn) : '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ record.checkOut ? formatTime(record.checkOut) : '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(record.status)">
                  {{ record.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">
                  {{ record.note || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="$emit('edit', record)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  編集
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              読み込み中...
            </td>
          </tr>
          <tr v-if="!loading && attendanceRecords.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              勤怠記録がありません
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AttendanceWithEmployee } from '@/types/attendance';

defineProps<{
  attendanceRecords: AttendanceWithEmployee[];
  loading: boolean;
}>();

defineEmits<{
  edit: [attendance: AttendanceWithEmployee];
}>();

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
}

function formatTime(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusClass(status: string): string {
  switch (status) {
    case '出勤':
      return 'bg-green-100 text-green-800';
    case '欠勤':
      return 'bg-red-100 text-red-800';
    case '遅刻':
      return 'bg-yellow-100 text-yellow-800';
    case '早退':
      return 'bg-orange-100 text-orange-800';
    case '有給休暇':
      return 'bg-blue-100 text-blue-800';
    case '特別休暇':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>