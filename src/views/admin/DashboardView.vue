<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">{{ $t('dashboard.adminTitle') }}</h1>
      <div class="text-sm text-gray-600">
        {{ currentDateTime }}
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="stat in stats"
        :key="stat.key"
        v-bind="stat"
      />
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">{{ $t('dashboard.quickActions') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.key"
          class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
          @click="handleQuickAction(action.key)"
        >
          <component :is="action.icon" class="w-8 h-8 text-[#321fdb] mb-2" />
          <span class="text-sm text-gray-700">{{ $t(`dashboard.${action.key}`) }}</span>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold mb-4">{{ $t('dashboard.recentActivity') }}</h2>
      <div class="space-y-4">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <component :is="activity.icon" class="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p class="text-sm text-gray-900">{{ activity.message }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { 
  Users, Building2, Clock, DollarSign,
  UserPlus, FileText, Building, Award
} from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';

const { t } = useI18n();
const router = useRouter();

// Current date/time
const currentDateTime = computed(() => {
  return new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Stats data
const stats = computed(() => [
  {
    icon: Users,
    label: t('dashboard.totalEmployees'),
    value: '150',
    color: 'bg-blue-500',
    key: 'employees'
  },
  {
    icon: Building2,
    label: t('dashboard.departments'),
    value: '8',
    color: 'bg-green-500',
    key: 'departments'
  },
  {
    icon: Clock,
    label: t('dashboard.presentToday'),
    value: '142',
    color: 'bg-yellow-500',
    key: 'attendance'
  },
  {
    icon: DollarSign,
    label: t('dashboard.totalPayroll'),
    value: '¥4,525,000',
    color: 'bg-purple-500',
    key: 'payroll'
  }
]);

// Quick actions
const quickActions = [
  { key: 'addEmployee', icon: UserPlus },
  { key: 'createReport', icon: FileText },
  { key: 'manageDepartments', icon: Building },
  { key: 'reviewPerformance', icon: Award }
];

function handleQuickAction(key: string) {
  switch (key) {
    case 'addEmployee':
      router.push('/admin/employees/new');
      break;
    case 'createReport':
      router.push('/admin/reports/new');
      break;
    case 'manageDepartments':
      router.push('/admin/departments');
      break;
    case 'reviewPerformance':
      router.push('/admin/performance');
      break;
  }
}

// Recent activities (mock data)
const recentActivities = ref([
  {
    id: 1,
    icon: UserPlus,
    message: '田中太郎さんが新しく入社しました',
    time: '10分前'
  },
  {
    id: 2,
    icon: Building,
    message: '営業部門が新設されました',
    time: '1時間前'
  },
  {
    id: 3,
    icon: Clock,
    message: '全社員の勤怠レポートが更新されました',
    time: '2時間前'
  }
]);
</script>