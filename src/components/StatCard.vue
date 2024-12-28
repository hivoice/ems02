<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center">
      <div :class="[color, 'p-3 rounded-full text-white mr-4']">
        <component :is="icon" class="w-6 h-6" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ label }}</p>
        <h3 class="text-2xl font-semibold">{{ value }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  label: string;
  value: string;
  color: string;
}>();
</script>