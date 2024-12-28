<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              役職名
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              所属部署
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
          <tr v-for="position in positions" :key="position.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ position.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ position.departmentName }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-500">{{ position.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ position.employeeCount }}名</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="$emit('edit', position)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                編集
              </button>
              <button
                @click="$emit('delete', position)"
                class="text-red-600 hover:text-red-900"
                :disabled="position.employeeCount > 0"
                :class="{ 'opacity-50 cursor-not-allowed': position.employeeCount > 0 }"
              >
                削除
              </button>
            </td>
          </tr>
          <tr v-if="positions.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              役職が登録されていません
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '@/types/position';

defineProps<{
  positions: Position[];
}>();

defineEmits<{
  edit: [position: Position];
  delete: [position: Position];
}>();
</script>