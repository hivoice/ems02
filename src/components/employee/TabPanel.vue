<template>
  <div 
    v-show="isActive" 
    class="transition-all duration-200"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean;
}>();
</script>