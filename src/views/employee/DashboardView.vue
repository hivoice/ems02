<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">{{ $t('dashboard.employeeTitle') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
import { Clock, DollarSign, Star } from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';

const { t } = useI18n();

const stats = computed(() => [
  {
    icon: Clock,
    label: t('dashboard.attendance'),
    value: t('dashboard.present'),
    color: 'bg-green-500',
    key: 'attendance'
  },
  {
    icon: DollarSign,
    label: t('dashboard.monthlySalary'),
    value: '¥350,000',
    color: 'bg-blue-500',
    key: 'salary'
  },
  {
    icon: Star,
    label: t('dashboard.performance'),
    value: '4.5/5.0',
    color: 'bg-yellow-500',
    key: 'performance'
  }
]);</script>