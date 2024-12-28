<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              部署名
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              説明
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              所属人数
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="department in departments" :key="department.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ department.name }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-500">{{ department.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ department.employeeCount }}名</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="$emit('edit', department)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                編集
              </button>
              <button
                @click="$emit('delete', department)"
                class="text-red-600 hover:text-red-900"
                :disabled="department.employeeCount > 0"
                :class="{ 'opacity-50 cursor-not-allowed': department.employeeCount > 0 }"
              >
                削除
              </button>
            </td>
          </tr>
          <tr v-if="departments.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
              部署が登録されていません
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Department } from '@/types/department';

defineProps<{
  departments: Department[];
}>();

defineEmits<{
  edit: [department: Department];
  delete: [department: Department];
}>();
</script>