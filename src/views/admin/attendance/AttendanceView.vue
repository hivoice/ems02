<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">勤怠管理</h1>
      <div class="flex items-center space-x-4">
        <!-- 期間選択 -->
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

        <!-- 日付選択 -->
        <input
          type="month"
          :value="formatYearMonth(currentDate)"
          @input="handleDateChange"
          class="px-3 py-1 border rounded"
        />

        <!-- 勤怠登録ボタン -->
        <button
          @click="showAddModal = true"
          class="btn-primary py-2 px-4 flex items-center"
        >
          <Plus class="w-5 h-5 mr-2" />
          勤怠登録
        </button>
      </div>
    </div>

    <!-- 勤怠統計 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        v-for="stat in attendanceStats"
        :key="stat.key"
        v-bind="stat"
      />
    </div>

    <!-- 勤怠一覧 -->
    <AttendanceList
      :attendance-records="attendance"
      :loading="isLoading"
      @edit="editAttendance"
    />

    <!-- 勤怠登録/編集モーダル -->
    <AttendanceFormModal
      v-if="showAddModal || showEditModal"
      :attendance="selectedAttendance"
      :is-edit="showEditModal"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { Clock, UserX, AlertTriangle, Calendar } from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';
import AttendanceList from '@/components/attendance/AttendanceList.vue';
import AttendanceFormModal from '@/components/attendance/AttendanceFormModal.vue';
import { useAttendance } from '@/composables/useAttendance';
import type { AttendanceWithEmployee, AttendancePeriod } from '@/types/attendance';

const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedAttendance = ref<AttendanceWithEmployee | null>(null);

const {
  attendance,
  isLoading,
  selectedPeriod,
  currentDate,
  setPeriod,
  setDate,
  loadAttendance,
  createAttendance,
  updateAttendance
} = useAttendance();

const periods: AttendancePeriod[] = ['月次', '四半期', '年次'];

const attendanceStats = computed(() => {
  const total = attendance.value.length;
  const present = attendance.value.filter(a => a.status === '出勤').length;
  const absent = attendance.value.filter(a => a.status === '欠勤').length;
  const late = attendance.value.filter(a => a.status === '遅刻').length;

  return [
    {
      icon: Clock,
      label: '出勤',
      value: `${present}名`,
      color: 'bg-green-500',
      key: 'present'
    },
    {
      icon: UserX,
      label: '欠勤',
      value: `${absent}名`,
      color: 'bg-red-500',
      key: 'absent'
    },
    {
      icon: AlertTriangle,
      label: '遅刻',
      value: `${late}名`,
      color: 'bg-yellow-500',
      key: 'late'
    },
    {
      icon: Calendar,
      label: '出勤率',
      value: `${total ? Math.round((present / total) * 100) : 0}%`,
      color: 'bg-blue-500',
      key: 'rate'
    }
  ];
});

function formatYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function handleDateChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    setDate(new Date(value));
  }
}

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedAttendance.value = null;
}

function editAttendance(attendance: AttendanceWithEmployee) {
  selectedAttendance.value = attendance;
  showEditModal.value = true;
}

async function handleSubmit(formData: any) {
  try {
    if (showEditModal.value && selectedAttendance.value) {
      await updateAttendance(selectedAttendance.value.id, formData);
    } else {
      await createAttendance(formData);
    }
    closeModal();
  } catch (error) {
    console.error('勤怠記録の保存に失敗しました:', error);
  }
}

// 初期データ読み込み
loadAttendance();
</script>