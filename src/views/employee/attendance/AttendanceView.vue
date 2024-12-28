<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">勤怠情報</h1>

    <!-- 期間選択 -->
    <div class="flex items-center space-x-4 mb-6">
      <div class="flex items-center space-x-2">
        <button
          v-for="period in periods"
          :key="period"
          @click="setPeriod(period)"
          class="px-3 py-1 rounded"
          :class="[
            selectedPeriod === period
              ? 'bg-[#321fdb] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ period }}
        </button>
      </div>

      <input
        type="month"
        :value="formatYearMonth(currentDate)"
        @input="handleDateChange"
        class="px-3 py-1 border rounded"
      />
    </div>

    <!-- 勤怠統計 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        v-for="stat in stats"
        :key="stat.key"
        v-bind="stat"
      />
    </div>

    <!-- 勤怠履歴 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日付
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
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="!isLoading">
              <tr v-for="record in myAttendance" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(record.date) }}
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
              </tr>
            </template>
            <tr v-else>
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                読み込み中...
              </td>
            </tr>
            <tr v-if="!isLoading && myAttendance.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                勤怠記録がありません
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Clock, UserX, AlertTriangle, Calendar } from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';
import { useAttendance } from '@/composables/useAttendance';
import { useAuthStore } from '@/stores/auth';
import type { Attendance, AttendancePeriod } from '@/types/attendance';

const authStore = useAuthStore();
const {
  isLoading,
  selectedPeriod,
  currentDate,
  setPeriod,
  setDate,
  getAttendanceStats
} = useAttendance();

const periods: AttendancePeriod[] = ['月次', '四半期', '年次'];
const myAttendance = ref<Attendance[]>([]);
const attendanceStats = ref<any>(null);

// 統計情報
const stats = computed(() => {
  if (!attendanceStats.value) return [];

  return [
    {
      icon: Clock,
      label: '出勤日数',
      value: `${attendanceStats.value.presentDays}日`,
      color: 'bg-green-500',
      key: 'present'
    },
    {
      icon: UserX,
      label: '欠勤日数',
      value: `${attendanceStats.value.absentDays}日`,
      color: 'bg-red-500',
      key: 'absent'
    },
    {
      icon: AlertTriangle,
      label: '遅刻回数',
      value: `${attendanceStats.value.lateDays}回`,
      color: 'bg-yellow-500',
      key: 'late'
    },
    {
      icon: Calendar,
      label: '有給休暇取得日数',
      value: `${attendanceStats.value.paidLeaveDays}日`,
      color: 'bg-blue-500',
      key: 'leave'
    }
  ];
});

function formatYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

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

function handleDateChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    setDate(new Date(value));
    loadMyAttendance();
  }
}

async function loadMyAttendance() {
  if (!authStore.user) return;

  try {
    const stats = await getAttendanceStats(authStore.user.id);
    attendanceStats.value = stats;
  } catch (error) {
    console.error('勤怠データの取得に失敗しました:', error);
  }
}

// 初期データ読み込み
loadMyAttendance();
</script>