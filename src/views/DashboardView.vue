<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">{{ t('dashboard.title') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        v-for="stat in stats"
        :key="stat.key"
        v-bind="stat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Users, Building2, Clock, DollarSign } from 'lucide-vue-next';
import StatCard from '../components/StatCard.vue';

const { t } = useI18n();

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
]);</script>